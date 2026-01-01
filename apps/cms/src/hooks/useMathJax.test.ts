import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useMathJax } from "./useMathJax";

// Mock script loading
let scriptOnload: () => void;
let scriptOnerror: () => void;

const mockAppendChild = vi.fn((script: HTMLScriptElement) => {
  scriptOnload = script.onload as () => void;
  scriptOnerror = script.onerror as () => void;
});

describe("useMathJax", () => {
  beforeEach(() => {
    // Reset globals
    delete window.MathJax;
    delete window._mathJaxLoading;

    // Mock document methods
    document.head.appendChild = mockAppendChild as any;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should start with loaded: false", () => {
    const { result } = renderHook(() => useMathJax());
    expect(result.current.loaded).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.mathJax).toBeNull();
  });

  it("should load MathJax and set loaded to true on success", async () => {
    const { result } = renderHook(() => useMathJax());

    expect(mockAppendChild).toHaveBeenCalledOnce();

    // Simulate script has loaded and MathJax is now available
    act(() => {
      window.MathJax = { version: "4.0.0" };
      scriptOnload();
    });

    // Advance timers to resolve the checkReady loop
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(result.current.loaded).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.mathJax).toEqual({ version: "4.0.0" });
  });

  it("should set an error if the script fails to load", async () => {
    const { result } = renderHook(() => useMathJax());

    // Simulate script loading error
    act(() => {
      scriptOnerror();
    });

    // Let the promise rejection propagate
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.loaded).toBe(false);
    expect(result.current.error).toBe("Failed to load MathJax");
    expect(result.current.mathJax).toBeNull();
  });

  it("should immediately set loaded to true if MathJax is already on the window", () => {
    window.MathJax = { version: "4.0.0" };
    const { result } = renderHook(() => useMathJax());

    expect(result.current.loaded).toBe(true);
    expect(result.current.mathJax).toEqual({ version: "4.0.0" });
    expect(mockAppendChild).not.toHaveBeenCalled();
  });

  it("should not load the script twice if called concurrently", async () => {
    const { result: result1 } = renderHook(() => useMathJax());
    const { result: result2 } = renderHook(() => useMathJax());

    expect(mockAppendChild).toHaveBeenCalledOnce();

    // Simulate successful load
    act(() => {
      window.MathJax = { version: "4.0.0" };
      scriptOnload();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(result1.current.loaded).toBe(true);
    expect(result2.current.loaded).toBe(true);
  });
});
