import { formatDate } from './dateFormat';

describe('formatDate', () => {
  describe('Basic Formatting', () => {
    it('should format timestamp to Y-m-d H:i format', () => {
      // 2022-06-14 18:20:35.730
      const timestamp = 1655220435730;
      const result = formatDate(timestamp);

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    it('should format a specific date correctly', () => {
      const date = new Date(2023, 2, 15, 14, 30, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-03-15 14:30');
    });
  });

  describe('Padding', () => {
    it('should pad single-digit months with leading zero', () => {
      const date = new Date(2023, 0, 15, 12, 0, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-01-15 12:00');
    });

    it('should pad single-digit days with leading zero', () => {
      const date = new Date(2023, 11, 5, 12, 0, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-12-05 12:00');
    });

    it('should pad single-digit hours with leading zero', () => {
      const date = new Date(2023, 11, 15, 9, 0, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-12-15 09:00');
    });

    it('should pad single-digit minutes with leading zero', () => {
      const date = new Date(2023, 11, 15, 12, 5, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-12-15 12:05');
    });

    it('should pad all single-digit values', () => {
      const date = new Date(2023, 0, 5, 9, 5, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-01-05 09:05');
    });
  });

  describe('Different Times of Day', () => {
    it('should format midnight correctly', () => {
      const date = new Date(2023, 5, 15, 0, 0, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-06-15 00:00');
    });

    it('should format noon correctly', () => {
      const date = new Date(2023, 5, 15, 12, 0, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-06-15 12:00');
    });

    it('should format end of day correctly', () => {
      const date = new Date(2023, 5, 15, 23, 59, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-06-15 23:59');
    });

    it('should format early morning correctly', () => {
      const date = new Date(2023, 5, 15, 1, 30, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-06-15 01:30');
    });
  });

  describe('Edge Cases', () => {
    it('should handle Unix epoch (timestamp 0)', () => {
      const timestamp = 0;
      const result = formatDate(timestamp);

      expect(result).toMatch(/1970-01-01/);
    });

    it('should handle year transitions', () => {
      const date = new Date(2022, 11, 31, 23, 59, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2022-12-31 23:59');
    });

    it('should handle leap year date', () => {
      const date = new Date(2024, 1, 29, 12, 0, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2024-02-29 12:00');
    });

    it('should handle future timestamp', () => {
      const date = new Date(2030, 0, 1, 0, 0, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2030-01-01 00:00');
    });

    it('should ignore seconds and milliseconds', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45, 123);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-06-15 14:30');
    });
  });

  describe('Different Months', () => {
    it('should format January correctly', () => {
      const date = new Date(2023, 0, 15, 12, 0, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-01-15 12:00');
    });

    it('should format February correctly', () => {
      const date = new Date(2023, 1, 15, 12, 0, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-02-15 12:00');
    });

    it('should format December correctly', () => {
      const date = new Date(2023, 11, 15, 12, 0, 0);
      const timestamp = date.getTime();

      const result = formatDate(timestamp);

      expect(result).toBe('2023-12-15 12:00');
    });
  });
});
