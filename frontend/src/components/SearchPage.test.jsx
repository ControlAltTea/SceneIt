// SearchPage.test.jsx (lives in the SAME folder as SearchPage.jsx)
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { SearchPage } from "../SearchPage"; // ✅ same folder as component

// Mock the hook so we don't hit real API
vi.mock("../hooks/useSearchWithCache", () => ({
  useSearchWithCache: vi.fn(),
}));

import { useSearchWithCache } from "../hooks/useSearchWithCache";

function renderWithRouter(initialUrl = "/search") {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SearchPage", () => {
  it("shows idle message when there is no query", () => {
    useSearchWithCache.mockReturnValue({
      results: [],
      total: 0,
      status: "idle",
      error: null,
      page: 1,
      pageCount: 0,
      pageSize: 20,
    });

    renderWithRouter("/search");

    expect(
      screen.getByText(/Start by searching for a show or movie/i)
    ).toBeInTheDocument();
  });
});
