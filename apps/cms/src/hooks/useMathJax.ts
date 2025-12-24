import { useEffect, useState } from "react";

const MATHJAX_URL = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js";

export function useMathJax() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if MathJax is already loaded and ready
    if ((window as any).MathJax && (window as any).MathJax.version) {
      setLoaded(true);
      return;
    }

    // Check if we're already loading MathJax
    if ((window as any)._mathJaxLoading) {
      (window as any)._mathJaxLoading
        .then(() => setLoaded(true))
        .catch((err: Error) => setError(err.message));
      return;
    }

    // Start loading MathJax
    (window as any)._mathJaxLoading = new Promise<void>(
      (resolveLoad, rejectLoad) => {
        const script = document.createElement("script");
        script.src = MATHJAX_URL;
        script.async = true;
        script.onload = () => {
          // Wait for MathJax to be fully initialized
          const checkReady = () => {
            try {
              if ((window as any).MathJax && (window as any).MathJax.version) {
                resolveLoad();
              } else {
                setTimeout(checkReady, 50);
              }
            } catch (e) {
              setTimeout(checkReady, 50);
            }
          };
          checkReady();
        };
        script.onerror = () => {
          delete (window as any)._mathJaxLoading;
          rejectLoad(new Error("Failed to load MathJax"));
        };
        document.head.appendChild(script);
      }
    );

    (window as any)._mathJaxLoading
      .then(() => setLoaded(true))
      .catch((err: Error) => setError(err.message));
  }, []);

  return { loaded, error };
}
