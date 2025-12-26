import { useEffect, useState } from "react";

const MATHJAX_URL = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js";

declare global {
  interface Window {
    MathJax?: {
      version?: string;
      typesetPromise?: (elements: Element[]) => Promise<void>;
      typesetClear?: (elements: Element[]) => void;
      texReset?: () => void;
      [key: string]: unknown;
    };
    _mathJaxLoading?: Promise<void>;
  }
}

export type MathJaxInstance = NonNullable<Window["MathJax"]>;

export function useMathJax() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mathJax, setMathJax] = useState<MathJaxInstance | null>(null);

  useEffect(() => {
    // Check if MathJax is already loaded and ready
    if (window.MathJax && window.MathJax.version) {
      setLoaded(true);
      setMathJax(window.MathJax);
      return;
    }

    // Check if we're already loading MathJax
    if (window._mathJaxLoading) {
      window._mathJaxLoading
        .then(() => {
          setLoaded(true);
          setMathJax(window.MathJax || null);
        })
        .catch((err: Error) => setError(err.message));
      return;
    }

    // Start loading MathJax
    window._mathJaxLoading = new Promise<void>((resolveLoad, rejectLoad) => {
      const script = document.createElement("script");
      script.src = MATHJAX_URL;
      script.async = true;
      script.onload = () => {
        // Wait for MathJax to be fully initialized
        const checkReady = () => {
          try {
            if (window.MathJax && window.MathJax.version) {
              resolveLoad();
            } else {
              setTimeout(checkReady, 50);
            }
          } catch {
            setTimeout(checkReady, 50);
          }
        };
        checkReady();
      };
      script.onerror = () => {
        delete window._mathJaxLoading;
        rejectLoad(new Error("Failed to load MathJax"));
      };
      document.head.appendChild(script);
    });

    window._mathJaxLoading
      .then(() => {
        setLoaded(true);
        setMathJax(window.MathJax || null);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return { loaded, error, mathJax };
}
