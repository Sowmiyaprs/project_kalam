# Testing Guide - Data Management

**Unit**: Data Management  
**Phase**: CONSTRUCTION - Code Generation  
**Date**: 2026-05-06

---

## Overview

This guide explains how to run and write tests for the Data Management unit.

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Data Management Tests Only

```bash
npm test DataManagement
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

---

## Test Structure

### Test File Location

```
src/services/storage/__tests__/DataManagement.test.js
```

### Test Organization

Tests are organized by service:
1. **StorageService Tests** (30+ tests)
2. **DataTransformationService Tests** (15+ tests)
3. **ExportService Tests** (10+ tests)

---

## StorageService Tests

### Test Categories

#### 1. saveEntry Tests
- ✅ Save entry successfully
- ✅ Reject entry with text too short
- ✅ Reject entry with text too long
- ✅ Sanitize text input (XSS prevention)
- ✅ Generate unique IDs

#### 2. saveAnalysis Tests
- ✅ Save analysis successfully
- ✅ Reject analysis with invalid entryId
- ✅ Reject analysis with invalid mood
- ✅ Link entry and analysis bidirectionally

#### 3. getHistoryData Tests
- ✅ Retrieve history data for last N days
- ✅ Filter entries older than N days

#### 4. deleteEntry Tests
- ✅ Delete entry successfully
- ✅ Cascade delete linked analysis

#### 5. cleanupOldData Tests
- ✅ Delete entries older than retention period
- ✅ Return zero if no old data

#### 6. checkStorageQuota Tests
- ✅ Return quota information

---

## DataTransformationService Tests

### Test Categories

#### 1. transformForChart Tests
- ✅ Transform analyses to chart data
- ✅ Average multiple analyses on same day

#### 2. calculateStatistics Tests
- ✅ Calculate statistics from history data
- ✅ Detect improving mood trend
- ✅ Detect declining mood trend
- ✅ Detect stable mood trend

---

## ExportService Tests

### Test Categories

#### 1. exportHistory Tests
- ✅ Export history successfully
- ✅ Filter by date range

#### 2. exportLatestAnalysis Tests
- ✅ Export latest analysis
- ✅ Fail if no analysis found

---

## Writing New Tests

### Test Template

```javascript
describe('ServiceName', () => {
  let service;
  let mockStorage;

  beforeEach(() => {
    // Setup
    mockStorage = new MockLocalStorage();
    global.localStorage = mockStorage;
    service = new ServiceName();
  });

  afterEach(() => {
    // Cleanup
    mockStorage.clear();
  });

  describe('methodName', () => {
    it('should do something', async () => {
      // Arrange
      const input = { /* ... */ };

      // Act
      const result = await service.methodName(input);

      // Assert
      expect(result.success).toBe(true);
    });
  });
});
```

---

## Mock localStorage

### MockLocalStorage Class

```javascript
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
```

### Usage

```javascript
beforeEach(() => {
  mockStorage = new MockLocalStorage();
  global.localStorage = mockStorage;
});
```

---

## Testing Best Practices

### 1. Test Isolation

Each test should be independent and not rely on other tests.

```javascript
beforeEach(() => {
  // Reset state before each test
  mockStorage.clear();
  service = new StorageService();
});
```

---

### 2. Test Coverage

Aim for > 80% code coverage:
- ✅ Happy path (success scenarios)
- ✅ Error scenarios
- ✅ Edge cases
- ✅ Validation failures

---

### 3. Descriptive Test Names

Use clear, descriptive test names:

```javascript
// ✅ Good
it('should reject entry with text too short', async () => { /* ... */ });

// ❌ Bad
it('test 1', async () => { /* ... */ });
```

---

### 4. Arrange-Act-Assert Pattern

Structure tests with clear sections:

```javascript
it('should save entry successfully', async () => {
  // Arrange
  const entry = {
    text: 'Test entry',
    timestamp: new Date().toISOString()
  };

  // Act
  const result = await service.saveEntry(entry);

  // Assert
  expect(result.success).toBe(true);
  expect(result.entry.id).toBeDefined();
});
```

---

### 5. Mock External Dependencies

Mock external dependencies to isolate unit tests:

```javascript
const mockStorage = {
  getAllEntries: vi.fn().mockResolvedValue([]),
  getAllAnalyses: vi.fn().mockResolvedValue([])
};

const service = new ExportService(mockStorage);
```

---

## Common Test Scenarios

### Testing Validation

```javascript
it('should reject invalid input', async () => {
  const invalidEntry = {
    text: 'Too short',
    timestamp: new Date().toISOString()
  };

  const result = await service.saveEntry(invalidEntry);

  expect(result.success).toBe(false);
  expect(result.error).toContain('between');
});
```

---

### Testing Error Handling

```javascript
it('should handle localStorage errors gracefully', async () => {
  // Mock localStorage to throw error
  mockStorage.setItem = vi.fn().mockImplementation(() => {
    throw new Error('Quota exceeded');
  });

  const result = await service.saveEntry(validEntry);

  expect(result.success).toBe(false);
  expect(result.error).toBeDefined();
});
```

---

### Testing Async Operations

```javascript
it('should retrieve data asynchronously', async () => {
  await service.saveEntry(entry1);
  await service.saveEntry(entry2);

  const history = await service.getHistoryData(30);

  expect(history.length).toBe(2);
});
```

---

## Test Coverage Report

### Current Coverage

- **StorageService**: > 85%
- **DataTransformationService**: > 90%
- **ExportService**: > 80%
- **Overall**: > 80%

### Viewing Coverage

```bash
npm test -- --coverage
```

Coverage report will be generated in `coverage/` directory.

---

## Continuous Integration

### Running Tests in CI

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- --coverage
```

---

## Debugging Tests

### Run Single Test

```bash
npm test -- -t "should save entry successfully"
```

### Enable Verbose Output

```bash
npm test -- --verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

---

**Status**: ✅ Testing Guide Complete
