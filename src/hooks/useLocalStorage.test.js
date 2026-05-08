// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { readStoredValue, writeStoredValue } from "./useLocalStorage.js";

describe("localStorage helpers", () => {
  it("reads and writes JSON values", () => {
    writeStoredValue("sample", { ok: true });
    expect(readStoredValue("sample", null)).toEqual({ ok: true });
  });

  it("falls back when JSON is corrupted", () => {
    window.localStorage.setItem("broken", "{");
    expect(readStoredValue("broken", ["fallback"])).toEqual(["fallback"]);
  });
});

