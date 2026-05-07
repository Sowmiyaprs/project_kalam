# NFR Design - Data Management

**Unit**: Data Management  
**Phase**: CONSTRUCTION - NFR Design  
**Date**: 2026-05-06

---

## Overview

This document specifies implementation patterns and design decisions to achieve the NFR requirements defined for the Data Management unit.

---

## 1. Performance Design Patterns

### Pattern 1.1: Efficient localStorage Operations

**Requirement**: Save operations < 100ms

**Design**:
- Minimize JSON serialization overhead
- Use single-key strategy for atomic updates
- Batch multiple operations when possible

**Implementation**:
```javascript
// Efficient save with minimal serialization
class StorageService {
  constructor() {
    this.cache = null; // In-memory cache
  }

  async saveEntry(entry) {
    // Load once, modify, save once
    const data = this.loadData();
    data.entries.push(entry);
    data.metadata.totalEntries++;
    this.saveData(data);
    this.cache = data; // Update cache
  }

  loadData() {
    // Use cache if available
    if (this.cache) return this.cache;
    
    const json = localStorage.getItem('mindmirror_data');
    this.cache = json ? JSON.parse(json) : this.getEmptyData();
    return this.cache;
  }

  saveData(data) {
    localStorage.setItem('mindmirror_data', JSON.stringify(data));
    this.cache = data;
  }
}
```

**Benefit**: Single read/write operation, in-memory cache reduces localStorage access

---

### Pattern 1.2: Lazy Loading with Caching

**Requirement**: Data retrieval < 200ms

**Design**:
- Load data on-demand (not on app startup)
- Cache in memory with expiration
- Invalidate cache on save

**Implementation**:
```javascript
class StorageService {
  constructor() {
    this.historyCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async getHistoryData(days = 30) {
    const cacheKey = `history_${days}`;
    const cached = this.historyCache.get(cacheKey);
    
    // Check cache validity
    if (cached && (Date.now() - cached.timestamp < this.cacheExpiry)) {
      return cached.data;
    }
    
    // Load from localStorage
    const data = this.loadData();
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    const filtered = data.entries.filter(e => new Date(e.timestamp).getTime() >= cutoffDate);
    
    // Cache result
    this.historyCache.set(cacheKey, {
      data: filtered,
      timestamp: Date.now()
    });
    
    return filtered;
  }

  invalidateCache() {
    this.historyCache.clear();
    this.cache = null;
  }
}
```

**Benefit**: Faster repeated reads, reduced localStorage access

---

### Pattern 1.3: Debounced Saves

**Requirement**: Avoid excessive localStorage writes

**Design**:
- Debounce save operations with 500ms delay
- Batch multiple saves into single write

**Implementation**:
```javascript
class StorageService {
  constructor() {
    this.saveTimeout = null;
    this.pendingData = null;
  }

  debouncedSave(data) {
    this.pendingData = data;
    
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.saveData(this.pendingData);
      this.pendingData = null;
      this.saveTimeout = null;
    }, 500);
  }
}
```

**Benefit**: Reduces localStorage writes, improves performance

---

## 2. Reliability Design Patterns

### Pattern 2.1: Retry Logic with Exponential Backoff

**Requirement**: 99.9% save success rate

**Design**:
- Retry failed saves up to 3 times
- Exponential backoff (100ms, 200ms, 400ms)
- Fallback to in-memory storage

**Implementation**:
```javascript
async saveWithRetry(data, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      localStorage.setItem('mindmirror_data', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      if (i === retries - 1) {
        // Final retry failed, use fallback
        this.useInMemoryFallback(data);
        return { success: false, error: 'localStorage unavailable' };
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, i)));
    }
  }
}
```

**Benefit**: Handles transient failures, maximizes save success rate

---

### Pattern 2.2: Referential Integrity Enforcement

**Requirement**: 100% referential integrity

**Design**:
- Validate entryId before saving analysis
- Cascade delete when removing entries
- Atomic updates (all or nothing)

**Implementation**:
```javascript
async saveAnalysis(analysis) {
  const data = this.loadData();
  
  // Validate referential integrity
  const entryExists = data.entries.some(e => e.id === analysis.entryId);
  if (!entryExists) {
    throw new Error('Invalid entryId: linked entry does not exist');
  }
  
  // Link bidirectionally
  const entry = data.entries.find(e => e.id === analysis.entryId);
  entry.analysisId = analysis.id;
  
  // Add analysis
  data.analyses.push(analysis);
  
  // Atomic save
  this.saveData(data);
}

async deleteEntry(entryId) {
  const data = this.loadData();
  
  // Find entry and linked analysis
  const entry = data.entries.find(e => e.id === entryId);
  if (!entry) return;
  
  // Cascade delete
  data.entries = data.entries.filter(e => e.id !== entryId);
  data.analyses = data.analyses.filter(a => a.entryId !== entryId);
  
  // Update metadata
  data.metadata.totalEntries--;
  
  // Atomic save
  this.saveData(data);
}
```

**Benefit**: Maintains data integrity, prevents orphan records

---

### Pattern 2.3: Data Corruption Recovery

**Requirement**: Graceful recovery from data corruption

**Design**:
- Try to parse JSON
- Attempt partial recovery
- Reset to empty state if recovery fails

**Implementation**:
```javascript
loadData() {
  try {
    const json = localStorage.getItem('mindmirror_data');
    if (!json) return this.getEmptyData();
    
    const data = JSON.parse(json);
    
    // Validate structure
    if (!data.entries || !data.analyses || !data.metadata) {
      throw new Error('Invalid data structure');
    }
    
    return data;
  } catch (error) {
    console.error('Data corruption detected', error);
    
    // Attempt partial recovery
    try {
      const recovered = this.attemptRecovery();
      if (recovered) return recovered;
    } catch (recoveryError) {
      console.error('Recovery failed', recoveryError);
    }
    
    // Reset to empty state
    this.showError('Data corruption detected. Storage has been reset.');
    return this.getEmptyData();
  }
}

attemptRecovery() {
  // Try to recover partial data
  const json = localStorage.getItem('mindmirror_data');
  const partial = JSON.parse(json);
  
  return {
    entries: Array.isArray(partial.entries) ? partial.entries : [],
    analyses: Array.isArray(partial.analyses) ? partial.analyses : [],
    metadata: partial.metadata || this.getDefaultMetadata()
  };
}
```

**Benefit**: Minimizes data loss, graceful degradation

---

## 3. Scalability Design Patterns

### Pattern 3.1: Automatic Cleanup

**Requirement**: Handle up to 100 entries efficiently

**Design**:
- Automatic cleanup on quota threshold (80%)
- Delete oldest entries first
- Update metadata after cleanup

**Implementation**:
```javascript
async cleanupOldData() {
  const data = this.loadData();
  const cutoffDate = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  // Filter entries to keep
  const entriesToKeep = data.entries.filter(e => 
    new Date(e.timestamp).getTime() >= cutoffDate
  );
  
  const deletedCount = data.entries.length - entriesToKeep.length;
  
  if (deletedCount === 0) return { deletedEntries: 0, deletedAnalyses: 0 };
  
  // Get IDs of deleted entries
  const deletedIds = data.entries
    .filter(e => new Date(e.timestamp).getTime() < cutoffDate)
    .map(e => e.id);
  
  // Filter analyses to keep
  const analysesToKeep = data.analyses.filter(a => 
    !deletedIds.includes(a.entryId)
  );
  
  // Update data
  data.entries = entriesToKeep;
  data.analyses = analysesToKeep;
  data.metadata.totalEntries = entriesToKeep.length;
  data.metadata.lastCleanup = new Date().toISOString();
  
  // Update oldest/newest
  if (entriesToKeep.length > 0) {
    data.metadata.oldestEntry = entriesToKeep[0].timestamp;
    data.metadata.newestEntry = entriesToKeep[entriesToKeep.length - 1].timestamp;
  }
  
  // Save cleaned data
  this.saveData(data);
  
  return {
    deletedEntries: deletedCount,
    deletedAnalyses: data.analyses.length - analysesToKeep.length
  };
}
```

**Benefit**: Automatic data volume management, prevents quota issues

---

### Pattern 3.2: Quota Monitoring

**Requirement**: Proactive quota management

**Design**:
- Check quota using StorageManager API
- Fallback to size estimation
- Trigger cleanup at 80% threshold

**Implementation**:
```javascript
async checkStorageQuota() {
  let used, available;
  
  // Try StorageManager API
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    used = estimate.usage;
    available = estimate.quota;
  } else {
    // Fallback: estimate from data size
    const json = localStorage.getItem('mindmirror_data');
    used = json ? json.length : 0;
    available = 10 * 1024 * 1024; // Assume 10MB
  }
  
  const percentage = (used / available) * 100;
  const needsCleanup = percentage > 80;
  
  if (needsCleanup) {
    await this.cleanupOldData();
  }
  
  return { used, available, percentage, needsCleanup };
}
```

**Benefit**: Prevents quota exceeded errors, proactive management

---

## 4. Availability Design Patterns

### Pattern 4.1: Cross-Tab Synchronization

**Requirement**: < 1 second sync delay

**Design**:
- Listen for storage events
- Reload data when event detected
- Notify UI components to refresh

**Implementation**:
```javascript
class StorageService {
  constructor() {
    this.listeners = [];
    this.setupStorageListener();
  }

  setupStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'mindmirror_data') {
        // Data changed in another tab
        this.invalidateCache();
        this.notifyListeners();
      }
    });
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback());
  }
}

// In React component
useEffect(() => {
  const handleStorageChange = () => {
    // Reload data
    loadHistoryData();
  };
  
  storageService.addListener(handleStorageChange);
  
  return () => {
    // Cleanup listener
  };
}, []);
```

**Benefit**: Real-time sync across tabs, no data conflicts

---

### Pattern 4.2: Offline-First Design

**Requirement**: 100% offline functionality

**Design**:
- No network dependencies
- All operations work offline
- localStorage is only dependency

**Implementation**:
```javascript
// All operations are synchronous or use async/await for consistency
// No fetch() or XMLHttpRequest calls
// No external API dependencies

class StorageService {
  // All methods work offline
  async saveEntry(entry) {
    // Pure localStorage operation
    const data = this.loadData();
    data.entries.push(entry);
    this.saveData(data);
  }
  
  async getHistoryData(days) {
    // Pure localStorage operation
    const data = this.loadData();
    return this.filterByDays(data, days);
  }
}
```

**Benefit**: Complete offline functionality, no network required

---

## 5. Security Design Patterns

### Pattern 5.1: Input Sanitization

**Requirement**: 100% input sanitization

**Design**:
- Remove script tags
- Remove HTML tags
- Filter unsafe characters
- Preserve meaningful content

**Implementation**:
```javascript
sanitizeText(text) {
  if (typeof text !== 'string') return '';
  
  let sanitized = text;
  
  // Remove script tags
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
  
  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]+>/g, '');
  
  // Remove unsafe characters (keep letters, numbers, spaces, basic punctuation)
  sanitized = sanitized.replace(/[^\w\s.,!?'";\-:()\[\]]/g, '');
  
  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  return sanitized;
}
```

**Benefit**: Prevents XSS attacks, ensures data safety

---

### Pattern 5.2: Data Validation

**Requirement**: 100% validation coverage

**Design**:
- Validate all inputs before storage
- Check required fields
- Validate ranges and formats

**Implementation**:
```javascript
validateEntry(entry) {
  const errors = [];
  
  // Required fields
  if (!entry.text || entry.text.trim().length === 0) {
    errors.push('Text is required');
  }
  
  // Length validation
  if (entry.text && (entry.text.length < 10 || entry.text.length > 10000)) {
    errors.push('Text must be between 10 and 10,000 characters');
  }
  
  // Timestamp validation
  if (!entry.timestamp || !this.isValidISO8601(entry.timestamp)) {
    errors.push('Invalid timestamp');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

validateAnalysis(analysis) {
  const errors = [];
  
  // Required fields
  if (!analysis.id || !analysis.entryId || !analysis.emotional) {
    errors.push('Missing required fields');
  }
  
  // Score ranges
  if (analysis.emotional) {
    if (analysis.emotional.stressLevel < 0 || analysis.emotional.stressLevel > 100) {
      errors.push('Stress level must be 0-100');
    }
    // ... validate other scores
  }
  
  // Mood validation
  const validMoods = ['Happy', 'Sad', 'Stressed', 'Anxious', 'Overwhelmed', 'Calm', 'Motivated', 'Frustrated', 'Uncertain', 'Neutral'];
  if (!validMoods.includes(analysis.emotional.mood)) {
    errors.push('Invalid mood category');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

**Benefit**: Ensures data integrity, prevents invalid data

---

## 6. Maintainability Design Patterns

### Pattern 6.1: Service Layer Architecture

**Requirement**: Clean, testable code

**Design**:
- Separate services for different concerns
- Clear interfaces
- Dependency injection for testing

**Implementation**:
```javascript
// StorageService.js
export class StorageService {
  constructor(config = {}) {
    this.storageKey = config.storageKey || 'mindmirror_data';
    this.cache = null;
  }
  
  // CRUD operations
  async saveEntry(entry) { /* ... */ }
  async getHistoryData(days) { /* ... */ }
  async deleteEntry(entryId) { /* ... */ }
}

// DataTransformationService.js
export class DataTransformationService {
  transformForChart(analyses) { /* ... */ }
  aggregateByDate(analyses) { /* ... */ }
  calculateStatistics(data) { /* ... */ }
}

// ExportService.js
export class ExportService {
  constructor(storageService) {
    this.storageService = storageService;
  }
  
  async exportHistory(startDate, endDate) { /* ... */ }
  generateJSONFile(data, filename) { /* ... */ }
}
```

**Benefit**: Easy to test, maintain, and extend

---

### Pattern 6.2: Error Boundary Pattern

**Requirement**: Graceful error handling

**Design**:
- Try-catch for all operations
- Fallback strategies
- User-friendly error messages

**Implementation**:
```javascript
async saveEntry(entry) {
  try {
    // Validate
    const validation = this.validateEntry(entry);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    // Sanitize
    entry.text = this.sanitizeText(entry.text);
    
    // Check quota
    const quota = await this.checkStorageQuota();
    if (quota.needsCleanup) {
      await this.cleanupOldData();
    }
    
    // Save
    const data = this.loadData();
    data.entries.push(entry);
    await this.saveWithRetry(data);
    
    return { success: true, entry };
  } catch (error) {
    console.error('Save entry failed', error);
    return {
      success: false,
      error: 'Failed to save entry. Please try again.'
    };
  }
}
```

**Benefit**: No unhandled exceptions, graceful degradation

---

## 7. Testing Design Patterns

### Pattern 7.1: Mock localStorage

**Requirement**: > 80% test coverage

**Design**:
- Mock localStorage for testing
- Test all operations independently
- Test error scenarios

**Implementation**:
```javascript
// Mock localStorage for testing
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  
  getItem(key) {
    return this.store[key] || null;
  }
  
  setItem(key, value) {
    this.store[key] = value;
  }
  
  removeItem(key) {
    delete this.store[key];
  }
  
  clear() {
    this.store = {};
  }
}

// In tests
describe('StorageService', () => {
  let service;
  let mockStorage;
  
  beforeEach(() => {
    mockStorage = new MockLocalStorage();
    global.localStorage = mockStorage;
    service = new StorageService();
  });
  
  it('should save entry successfully', async () => {
    const entry = {
      id: 'entry_1',
      text: 'Test entry',
      timestamp: new Date().toISOString()
    };
    
    const result = await service.saveEntry(entry);
    expect(result.success).toBe(true);
  });
});
```

**Benefit**: Comprehensive testing without browser dependency

---

## 8. Implementation Summary

### Service Responsibilities

**StorageService**:
- CRUD operations for localStorage
- Quota management and cleanup
- Cross-tab synchronization
- Error handling and retry logic

**DataTransformationService**:
- Transform data for charts
- Aggregate by date
- Calculate statistics

**ExportService**:
- Generate JSON exports
- Filter by date range
- Trigger file download

---

### Performance Optimizations

1. **In-memory caching**: Reduce localStorage reads
2. **Lazy loading**: Load data on-demand
3. **Debounced saves**: Batch multiple writes
4. **Single-key strategy**: Atomic updates
5. **Efficient filtering**: Use array methods optimized for performance

---

### Quality Assurance

1. **Input sanitization**: Prevent XSS attacks
2. **Data validation**: Ensure data integrity
3. **Referential integrity**: Maintain relationships
4. **Error handling**: Graceful degradation
5. **Retry logic**: Maximize success rate

---

**Status**: ✅ NFR Design Complete

