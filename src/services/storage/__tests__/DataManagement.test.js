/**
 * Data Management Unit Tests
 * 
 * Comprehensive test suite for StorageService, DataTransformationService, and ExportService.
 * 
 * @module services/storage/__tests__/DataManagement.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageService } from '../StorageService.js';
import { DataTransformationService } from '../DataTransformationService.js';
import { ExportService } from '../ExportService.js';

// Mock localStorage
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

describe('StorageService', () => {
  let service;
  let mockStorage;

  beforeEach(() => {
    mockStorage = new MockLocalStorage();
    global.localStorage = mockStorage;
    service = new StorageService();
  });

  afterEach(() => {
    mockStorage.clear();
  });

  describe('saveEntry', () => {
    it('should save entry successfully', async () => {
      const entry = {
        text: 'Test journal entry with enough characters',
        timestamp: new Date().toISOString(),
      };

      const result = await service.saveEntry(entry);

      expect(result.success).toBe(true);
      expect(result.entry.id).toBeDefined();
      expect(result.entry.wordCount).toBeGreaterThan(0);
      expect(result.entry.characterCount).toBeGreaterThan(0);
    });

    it('should reject entry with text too short', async () => {
      const entry = {
        text: 'Short',
        timestamp: new Date().toISOString(),
      };

      const result = await service.saveEntry(entry);

      expect(result.success).toBe(false);
      expect(result.error).toContain('between');
    });

    it('should reject entry with text too long', async () => {
      const entry = {
        text: 'a'.repeat(10001),
        timestamp: new Date().toISOString(),
      };

      const result = await service.saveEntry(entry);

      expect(result.success).toBe(false);
      expect(result.error).toContain('between');
    });

    it('should sanitize text input', async () => {
      const entry = {
        text: '<script>alert("xss")</script>This is a test entry with enough characters',
        timestamp: new Date().toISOString(),
      };

      const result = await service.saveEntry(entry);

      expect(result.success).toBe(true);
      expect(result.entry.text).not.toContain('<script>');
    });

    it('should generate unique IDs', async () => {
      const entry1 = {
        text: 'First entry with enough characters for validation',
        timestamp: new Date().toISOString(),
      };
      const entry2 = {
        text: 'Second entry with enough characters for validation',
        timestamp: new Date().toISOString(),
      };

      const result1 = await service.saveEntry(entry1);
      const result2 = await service.saveEntry(entry2);

      expect(result1.entry.id).not.toBe(result2.entry.id);
    });
  });

  describe('saveAnalysis', () => {
    it('should save analysis successfully', async () => {
      // First save an entry
      const entry = {
        text: 'Test entry with enough characters',
        timestamp: new Date().toISOString(),
      };
      const entryResult = await service.saveEntry(entry);

      // Then save analysis
      const analysis = {
        id: 'analysis_123',
        entryId: entryResult.entry.id,
        timestamp: new Date().toISOString(),
        emotional: {
          mood: 'Happy',
          stressLevel: 30,
          motivation: 75,
          confidence: 80,
        },
        productivity: {
          score: 'High',
          focusLevel: 'Excellent',
        },
        suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
      };

      const result = await service.saveAnalysis(analysis);

      expect(result.success).toBe(true);
    });

    it('should reject analysis with invalid entryId', async () => {
      const analysis = {
        id: 'analysis_123',
        entryId: 'nonexistent_entry',
        timestamp: new Date().toISOString(),
        emotional: {
          mood: 'Happy',
          stressLevel: 30,
          motivation: 75,
          confidence: 80,
        },
        productivity: {
          score: 'High',
          focusLevel: 'Excellent',
        },
        suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
      };

      const result = await service.saveAnalysis(analysis);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid entryId');
    });

    it('should reject analysis with invalid mood', async () => {
      const entry = {
        text: 'Test entry with enough characters',
        timestamp: new Date().toISOString(),
      };
      const entryResult = await service.saveEntry(entry);

      const analysis = {
        id: 'analysis_123',
        entryId: entryResult.entry.id,
        timestamp: new Date().toISOString(),
        emotional: {
          mood: 'InvalidMood',
          stressLevel: 30,
          motivation: 75,
          confidence: 80,
        },
        productivity: {
          score: 'High',
          focusLevel: 'Excellent',
        },
        suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
      };

      const result = await service.saveAnalysis(analysis);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid mood');
    });

    it('should link entry and analysis bidirectionally', async () => {
      const entry = {
        text: 'Test entry with enough characters',
        timestamp: new Date().toISOString(),
      };
      const entryResult = await service.saveEntry(entry);

      const analysis = {
        id: 'analysis_123',
        entryId: entryResult.entry.id,
        timestamp: new Date().toISOString(),
        emotional: {
          mood: 'Happy',
          stressLevel: 30,
          motivation: 75,
          confidence: 80,
        },
        productivity: {
          score: 'High',
          focusLevel: 'Excellent',
        },
        suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
      };

      await service.saveAnalysis(analysis);

      const entries = await service.getAllEntries();
      const linkedEntry = entries.find((e) => e.id === entryResult.entry.id);

      expect(linkedEntry.analysisId).toBe(analysis.id);
    });
  });

  describe('getHistoryData', () => {
    it('should retrieve history data for last N days', async () => {
      // Save multiple entries
      for (let i = 0; i < 5; i++) {
        const entry = {
          text: `Entry ${i} with enough characters for validation`,
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        };
        await service.saveEntry(entry);
      }

      const history = await service.getHistoryData(7);

      expect(history.length).toBe(5);
    });

    it('should filter entries older than N days', async () => {
      // Save old entry (40 days ago)
      const oldEntry = {
        text: 'Old entry with enough characters',
        timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await service.saveEntry(oldEntry);

      // Save recent entry
      const recentEntry = {
        text: 'Recent entry with enough characters',
        timestamp: new Date().toISOString(),
      };
      await service.saveEntry(recentEntry);

      const history = await service.getHistoryData(30);

      expect(history.length).toBe(1);
    });
  });

  describe('deleteEntry', () => {
    it('should delete entry successfully', async () => {
      const entry = {
        text: 'Entry to delete with enough characters',
        timestamp: new Date().toISOString(),
      };
      const result = await service.saveEntry(entry);

      const deleteResult = await service.deleteEntry(result.entry.id);

      expect(deleteResult.success).toBe(true);

      const entries = await service.getAllEntries();
      expect(entries.length).toBe(0);
    });

    it('should cascade delete linked analysis', async () => {
      const entry = {
        text: 'Entry with analysis and enough characters',
        timestamp: new Date().toISOString(),
      };
      const entryResult = await service.saveEntry(entry);

      const analysis = {
        id: 'analysis_123',
        entryId: entryResult.entry.id,
        timestamp: new Date().toISOString(),
        emotional: {
          mood: 'Happy',
          stressLevel: 30,
          motivation: 75,
          confidence: 80,
        },
        productivity: {
          score: 'High',
          focusLevel: 'Excellent',
        },
        suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
      };
      await service.saveAnalysis(analysis);

      await service.deleteEntry(entryResult.entry.id);

      const analyses = await service.getAllAnalyses();
      expect(analyses.length).toBe(0);
    });
  });

  describe('cleanupOldData', () => {
    it('should delete entries older than retention period', async () => {
      // Save old entry (40 days ago)
      const oldEntry = {
        text: 'Old entry with enough characters',
        timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await service.saveEntry(oldEntry);

      // Save recent entry
      const recentEntry = {
        text: 'Recent entry with enough characters',
        timestamp: new Date().toISOString(),
      };
      await service.saveEntry(recentEntry);

      const result = await service.cleanupOldData();

      expect(result.deletedEntries).toBe(1);

      const entries = await service.getAllEntries();
      expect(entries.length).toBe(1);
    });

    it('should return zero if no old data', async () => {
      const entry = {
        text: 'Recent entry with enough characters',
        timestamp: new Date().toISOString(),
      };
      await service.saveEntry(entry);

      const result = await service.cleanupOldData();

      expect(result.deletedEntries).toBe(0);
    });
  });

  describe('checkStorageQuota', () => {
    it('should return quota information', async () => {
      const quota = await service.checkStorageQuota();

      expect(quota).toBeDefined();
      expect(quota.used).toBeGreaterThanOrEqual(0);
      expect(quota.available).toBeGreaterThan(0);
      expect(quota.percentage).toBeGreaterThanOrEqual(0);
      expect(typeof quota.needsCleanup).toBe('boolean');
    });
  });
});

describe('DataTransformationService', () => {
  let service;

  beforeEach(() => {
    service = new DataTransformationService();
  });

  describe('transformForChart', () => {
    it('should transform analyses to chart data', () => {
      const analyses = [
        {
          timestamp: '2026-05-01T10:00:00.000Z',
          emotional: {
            mood: 'Happy',
            stressLevel: 30,
            motivation: 75,
            confidence: 80,
          },
          productivity: {
            score: 'High',
            focusLevel: 'Excellent',
          },
        },
        {
          timestamp: '2026-05-02T10:00:00.000Z',
          emotional: {
            mood: 'Calm',
            stressLevel: 20,
            motivation: 80,
            confidence: 85,
          },
          productivity: {
            score: 'High',
            focusLevel: 'Good',
          },
        },
      ];

      const chartData = service.transformForChart(analyses);

      expect(chartData.length).toBe(2);
      expect(chartData[0].date).toBe('2026-05-01');
      expect(chartData[0].stress).toBe(30);
      expect(chartData[0].mood).toBe('Happy');
    });

    it('should average multiple analyses on same day', () => {
      const analyses = [
        {
          timestamp: '2026-05-01T10:00:00.000Z',
          emotional: {
            mood: 'Happy',
            stressLevel: 30,
            motivation: 70,
            confidence: 80,
          },
          productivity: {
            score: 'High',
            focusLevel: 'Excellent',
          },
        },
        {
          timestamp: '2026-05-01T15:00:00.000Z',
          emotional: {
            mood: 'Happy',
            stressLevel: 40,
            motivation: 80,
            confidence: 90,
          },
          productivity: {
            score: 'High',
            focusLevel: 'Excellent',
          },
        },
      ];

      const chartData = service.transformForChart(analyses);

      expect(chartData.length).toBe(1);
      expect(chartData[0].stress).toBe(35); // Average of 30 and 40
      expect(chartData[0].motivation).toBe(75); // Average of 70 and 80
    });
  });

  describe('calculateStatistics', () => {
    it('should calculate statistics from history data', () => {
      const historyData = [
        {
          date: '2026-05-01',
          stress: 30,
          motivation: 75,
          confidence: 80,
          productivity: 75,
          focus: 85,
          mood: 'Happy',
          entryCount: 1,
        },
        {
          date: '2026-05-02',
          stress: 20,
          motivation: 80,
          confidence: 85,
          productivity: 75,
          focus: 65,
          mood: 'Calm',
          entryCount: 1,
        },
      ];

      const stats = service.calculateStatistics(historyData);

      expect(stats.avgStress).toBe(25);
      expect(stats.avgMotivation).toBe(78);
      expect(stats.totalEntries).toBe(2);
      expect(stats.mostCommonMood).toBeDefined();
    });

    it('should detect improving mood trend', () => {
      const historyData = [
        {
          date: '2026-05-01',
          stress: 80,
          motivation: 40,
          confidence: 50,
          productivity: 50,
          focus: 50,
          mood: 'Stressed',
          entryCount: 1,
        },
        {
          date: '2026-05-02',
          stress: 30,
          motivation: 80,
          confidence: 85,
          productivity: 75,
          focus: 85,
          mood: 'Happy',
          entryCount: 1,
        },
      ];

      const stats = service.calculateStatistics(historyData);

      expect(stats.moodTrend).toBe('Improving');
    });
  });
});

describe('ExportService', () => {
  let service;
  let mockStorage;
  let mockTransformer;

  beforeEach(() => {
    mockStorage = {
      getAllEntries: vi.fn().mockResolvedValue([]),
      getAllAnalyses: vi.fn().mockResolvedValue([]),
      getLatestAnalysis: vi.fn().mockResolvedValue(null),
    };

    mockTransformer = {
      transformHistoryData: vi.fn().mockReturnValue([]),
      calculateStatistics: vi.fn().mockReturnValue({}),
    };

    service = new ExportService(mockStorage, mockTransformer);

    // Mock document methods
    global.document = {
      createElement: vi.fn().mockReturnValue({
        click: vi.fn(),
      }),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    };

    global.URL = {
      createObjectURL: vi.fn().mockReturnValue('blob:url'),
      revokeObjectURL: vi.fn(),
    };

    global.Blob = vi.fn();
  });

  describe('exportHistory', () => {
    it('should export history successfully', async () => {
      const result = await service.exportHistory();

      expect(result.success).toBe(true);
      expect(mockStorage.getAllEntries).toHaveBeenCalled();
      expect(mockStorage.getAllAnalyses).toHaveBeenCalled();
    });

    it('should filter by date range', async () => {
      mockStorage.getAllEntries.mockResolvedValue([
        {
          id: 'entry_1',
          timestamp: '2026-05-01T10:00:00.000Z',
          text: 'Entry 1',
        },
        {
          id: 'entry_2',
          timestamp: '2026-05-10T10:00:00.000Z',
          text: 'Entry 2',
        },
      ]);

      const result = await service.exportHistory('2026-05-01T00:00:00.000Z', '2026-05-05T23:59:59.999Z');

      expect(result.success).toBe(true);
    });
  });

  describe('exportLatestAnalysis', () => {
    it('should export latest analysis', async () => {
      mockStorage.getLatestAnalysis.mockResolvedValue({
        id: 'analysis_1',
        timestamp: '2026-05-01T10:00:00.000Z',
      });

      const result = await service.exportLatestAnalysis();

      expect(result.success).toBe(true);
    });

    it('should fail if no analysis found', async () => {
      mockStorage.getLatestAnalysis.mockResolvedValue(null);

      const result = await service.exportLatestAnalysis();

      expect(result.success).toBe(false);
      expect(result.error).toContain('No analysis found');
    });
  });
});
