// src/utils/searchPagination.test.js
import { describe, it, expect } from "vitest";
import { PAGE_SIZE, getOffset, buildCacheKey } from "./searchPagination";

describe("getOffset", () => {
  it("returns 0 for page 1", () => {
    expect(getOffset(1, PAGE_SIZE)).toBe(0);
  });

  it("returns correct offset for later pages", () => {
    expect(getOffset(2, 20)).toBe(20);
    expect(getOffset(3, 20)).toBe(40);
  });

  it("handles invalid page numbers gracefully", () => {
    expect(getOffset(0, 20)).toBe(0);
    expect(getOffset(-5, 20)).toBe(0);
  });
});

describe("buildCacheKey", () => {
  it("produces stable keys for same filters in different order", () => {
    const key1 = buildCacheKey({
      q: "disney",
      page: 2,
      filters: { genre: "fantasy", year: "2020" },
    });
    const key2 = buildCacheKey({
      q: "disney",
      page: 2,
      filters: { year: "2020", genre: "fantasy" },
    });
    expect(key1).toBe(key2);
  });

  it("produces different keys when q, page, or filters change", () => {
    const base = buildCacheKey({
      q: "disney",
      page: 1,
      filters: { genre: "fantasy" },
    });
    const diffPage = buildCacheKey({
      q: "disney",
      page: 2,
      filters: { genre: "fantasy" },
    });
    const diffFilter = buildCacheKey({
      q: "disney",
      page: 1,
      filters: { genre: "drama" },
    });

    expect(base).not.toBe(diffPage);
    expect(base).not.toBe(diffFilter);
  });
});
