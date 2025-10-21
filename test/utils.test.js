const { slugifyName } = require('../lib/utils');

describe('slugifyName', () => {
  test('converts name to lowercase and removes spaces', () => {
    expect(slugifyName('John Doe')).toBe('johndoe');
  });

  test('handles empty and non-string values', () => {
    expect(slugifyName('')).toBe('');
    expect(slugifyName(null)).toBe('');
  });
});
