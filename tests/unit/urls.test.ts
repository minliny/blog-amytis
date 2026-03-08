import { describe, test, expect, mock, beforeAll, afterAll } from 'bun:test';
import { getPostUrl, getPostsBasePath, getSeriesAutoPaths, validateSeriesAutoPaths } from '../../src/lib/urls';

// ── Default config (autoPaths: true, customPaths: {}) ─────────────────────────

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

  test('throws for each reserved route segment it encounters', () => {
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

// ── customPaths override ───────────────────────────────────────────────────────

describe('getPostUrl — customPaths override', () => {
  beforeAll(() => {
    mock.module('../../site.config', () => ({
      siteConfig: {
        posts: { basePath: 'posts' },
        series: {
          autoPaths: true,
          customPaths: { 'my-series': 'writings' },
        },
      },
    }));
  });

  afterAll(() => {
    mock.restore();
  });

  test('customPaths takes precedence over autoPaths', () => {
    // Re-import after mock so the module picks up the mocked config
    const { getPostUrl: getPostUrlMocked } = require('../../src/lib/urls');
    expect(getPostUrlMocked({ slug: 'hello', series: 'my-series' })).toBe('/writings/hello');
  });
});

describe('validateSeriesAutoPaths — customPaths exemption', () => {
  beforeAll(() => {
    mock.module('../../site.config', () => ({
      siteConfig: {
        posts: { basePath: 'posts' },
        series: {
          autoPaths: true,
          customPaths: { 'tags': 'my-tags' }, // 'tags' is reserved but has an override
        },
      },
    }));
  });

  afterAll(() => {
    mock.restore();
  });

  test('does not throw for a reserved slug that has a customPaths override', () => {
    const { validateSeriesAutoPaths: validate } = require('../../src/lib/urls');
    expect(() => validate(['tags'])).not.toThrow();
  });
});

describe('validateSeriesAutoPaths — autoPaths disabled', () => {
  beforeAll(() => {
    mock.module('../../site.config', () => ({
      siteConfig: {
        posts: { basePath: 'posts' },
        series: {
          autoPaths: false,
          customPaths: {},
        },
      },
    }));
  });

  afterAll(() => {
    mock.restore();
  });

  test('does not throw even for reserved slugs when autoPaths is false', () => {
    const { validateSeriesAutoPaths: validate } = require('../../src/lib/urls');
    expect(() => validate(['tags', 'series', 'books'])).not.toThrow();
  });
});
