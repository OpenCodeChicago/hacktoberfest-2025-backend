// Tests for utils/regex.js

import {
  escapeRegex,
  tokenize,
  buildLookaheadRegex,
} from '../src/utils/regex.util.js';

describe('regex.js functions', () => {
  // escapeRegex tests
  test('escapeRegex correctly escapes special characters', () => {
    expect(escapeRegex('hello.world')).toBe('hello\\.world');
    expect(escapeRegex('[test]*')).toBe('\\[test\\]\\*');
    expect(escapeRegex('')).toBe(''); // edge case
  });

  // tokenize tests
  test('tokenize splits string and escapes tokens', () => {
    expect(tokenize('hello world')).toEqual(['hello', 'world']);
    expect(tokenize('foo-bar_baz')).toEqual(['foo', 'bar', 'baz']);
    expect(tokenize('   spaced   out   ')).toEqual(['spaced', 'out']);
    expect(tokenize('')).toEqual([]); // edge case
  });

  // buildLookaheadRegex tests
  test('buildLookaheadRegex constructs correct regex', () => {
    const tokens = ['hello', 'world'];
    const regex = buildLookaheadRegex(tokens);
    expect(regex.test('hello amazing world')).toBe(true);
    expect(regex.test('world hello')).toBe(true);
    expect(regex.test('hello')).toBe(false); // missing 'world'
    expect(regex.test('world')).toBe(false); // missing 'hello'
  });
});
