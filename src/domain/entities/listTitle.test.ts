import {
  MAX_LIST_TITLE_LENGTH,
  normalizeListTitle,
  parseListTitle,
  truncateListTitle,
} from './listTitle';

describe('listTitle', () => {
  describe('parseListTitle', () => {
    it('rejects empty and whitespace-only titles', () => {
      expect(parseListTitle('')).toBeNull();
      expect(parseListTitle('   ')).toBeNull();
    });

    it('trims and returns a non-empty title', () => {
      expect(parseListTitle('  Courses  ')).toBe('Courses');
    });

    it('caps length at MAX_LIST_TITLE_LENGTH', () => {
      const long = 'a'.repeat(MAX_LIST_TITLE_LENGTH + 10);
      expect(parseListTitle(long)).toBe('a'.repeat(MAX_LIST_TITLE_LENGTH));
    });
  });

  describe('normalizeListTitle', () => {
    it('trims without rejecting empty results', () => {
      expect(normalizeListTitle('  x  ')).toBe('x');
      expect(normalizeListTitle('   ')).toBe('');
    });
  });

  describe('truncateListTitle', () => {
    it('leaves short titles intact', () => {
      expect(truncateListTitle('Courses')).toBe('Courses');
    });

    it('abbreviates titles beyond the max length', () => {
      const long = 'a'.repeat(MAX_LIST_TITLE_LENGTH + 5);
      const truncated = truncateListTitle(long);
      expect(truncated.length).toBe(MAX_LIST_TITLE_LENGTH);
      expect(truncated.endsWith('…')).toBe(true);
    });
  });
});
