import { describe, test, expect } from 'bun:test';
import { getPostUrl, getSeriesAutoPaths, validateSeriesAutoPaths } from '../../src/lib/urls';

describe('getSeriesAutoPaths', () => {
  test('returns true by default', () => {
    expect(getSeriesAutoPaths()).toBe(true);
  });
});

describe('getPostUrl — autoPaths enabled (default)', () => {
  test('post with no series uses basePath', () => {
    expect(getPostUrl({ slug: 'hello' })).toBe('/posts/hello');
  });

  test('post with series uses series slug as prefix', () => {
    expect(getPostUrl({ slug: 'hello', series: 'my-series' })).toBe('/my-series/hello');
  });
});

describe('validateSeriesAutoPaths', () => {
  test('does not throw for a non-reserved series slug', () => {
    expect(() => validateSeriesAutoPaths(['my-series', 'weekly-digest'])).not.toThrow();
  });

  test('throws for series slug matching a reserved route', () => {
    expect(() => validateSeriesAutoPaths(['tags'])).toThrow(/Series slug "tags" conflicts/);
  });

  test('throws for each reserved route segment', () => {
    const reserved = ['series', 'books', 'flows', 'archive', 'authors', 'graph', 'notes', 'page', 'api'];
    for (const slug of reserved) {
      expect(() => validateSeriesAutoPaths([slug])).toThrow(`Series slug "${slug}" conflicts`);
    }
  });

  test('throws when series slug matches the posts basePath', () => {
    // Default basePath is 'posts'
    expect(() => validateSeriesAutoPaths(['posts'])).toThrow(/Series slug "posts" conflicts/);
  });
});
