import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { SearchPage } from "./SearchPage"; // ✅ now correct path

vi.mock("../hooks/useSearchWithCache", () => ({
  useSearchWithCache: vi.fn(),
}));

import { useSearchWithCache } from "../hooks/useSearchWithCache";
