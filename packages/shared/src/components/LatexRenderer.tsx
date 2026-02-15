"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMathJax } from "../hooks/useMathJax";

export type LatexRendererProps = {
  value: string;
  className?: string;
};

export const LatexRenderer: React.FC<LatexRendererProps> = ({
  value,
  className,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const { loaded, mathJax: mathJaxFromHook } = useMathJax();

  const displayContent = useMemo(() => {
    return value?.trim() ? value : "";
  }, [value]);

  useEffect(() => {
    // Prioritize the window object directly to avoid stale state issues
    const mj =
      mathJaxFromHook ||
      (typeof window !== "undefined" ? window.MathJax : undefined);

    // We need the DOM ref, the content, and the actual library methods
    if (!loaded || !mj || !previewRef.current || !displayContent) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        // Double check existence before calling to prevent "is not a function" errors
        if (typeof mj.typesetClear === "function") {
          mj.typesetClear([previewRef.current!]);
        }
        if (typeof mj.texReset === "function") {
          mj.texReset();
        }

        if (typeof mj.typesetPromise === "function") {
          await mj.typesetPromise([previewRef.current!]);
          setRenderError(null);
        } else {
          // Fallback if MathJax is present but typesetPromise isn't ready yet
          console.warn("MathJax found but typesetPromise is missing");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setRenderError(`LaTeX syntax error ${message}`);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [displayContent, loaded, mathJaxFromHook]);

  if (renderError) {
    return <div className="text-sm text-red-500 italic">{renderError}</div>;
  }

  return (
    <div ref={previewRef} className={className}>
      {displayContent}
    </div>
  );
};
