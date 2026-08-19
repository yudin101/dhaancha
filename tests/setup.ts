import { beforeAll, afterAll, vi } from "vitest";

beforeAll(() => {
  // Hide all the console logs, warnings and errors while running test cases
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});
