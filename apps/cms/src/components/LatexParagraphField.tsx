import React, { useEffect, useRef, useState } from "react";
import { FieldProps, FieldHelperText } from "@firecms/core";
import { TextField } from "@firecms/ui";
import { useMathJax } from "../hooks/useMathJax";

export function LatexParagraphField({
  property,
  value,
  setValue,
  includeDescription,
  showError,
  error,
  isSubmitting,
  disabled,
  autoFocus,
}: FieldProps<string>) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [lastRenderedContent, setLastRenderedContent] = useState<string>("");
  const [previewContent, setPreviewContent] = useState<string>("");
  const { loaded: isMathJaxReady, error: mathJaxError } = useMathJax();

  // Handle MathJax loading errors
  useEffect(() => {
    if (mathJaxError) {
      setRenderError(`Failed to load MathJax: ${mathJaxError}`);
    }
  }, [mathJaxError]);

  // Update preview content when LaTeX content changes
  useEffect(() => {
    if (value?.trim()) {
      setPreviewContent(`$$${value}$$`);
    } else {
      setPreviewContent("");
    }
  }, [value]);

  // Render LaTeX whenever preview content changes
  useEffect(() => {
    if (!isMathJaxReady || !previewRef.current || !previewContent) {
      setRenderError(null);
      return;
    }

    // Skip if content hasn't changed since last successful render
    if (value === lastRenderedContent) {
      return;
    }

    // Clear any previous timeout
    const timeoutId = setTimeout(() => {
      try {
        const MathJax = (window as any).MathJax;
        if (!MathJax) {
          setRenderError("MathJax not loaded");
          return;
        }

        // Try to typeset with MathJax - use typesetPromise since it returns a Promise
        try {
          if (
            MathJax.typesetPromise &&
            typeof MathJax.typesetPromise === "function"
          ) {
            // Clear any previous MathJax processing for this element (before updating content)
            if (MathJax.typesetClear) {
              MathJax.typesetClear([previewRef.current!]);
            }

            // Reset TeX state (labels, equation numbers, macros)
            if (MathJax.texReset) {
              MathJax.texReset();
            }

            // Typeset the content (previewContent is already set by React state)
            MathJax.typesetPromise([previewRef.current!])
              .then(() => {
                setRenderError(null);
                setLastRenderedContent(value);
              })
              .catch((err: any) => {
                console.warn("MathJax render error", err);
                setRenderError(
                  `LaTeX rendering failed: ${err.message || "Unknown error"}`
                );
              });
          } else {
            setRenderError("MathJax typesetPromise not available");
          }
        } catch (err) {
          console.warn("MathJax rendering error", err);
          setRenderError("LaTeX rendering failed");
        }
      } catch (err) {
        console.warn("LaTeX rendering error", err);
        setRenderError("LaTeX rendering error");
      }
    }, 300); // Debounce for 300ms to avoid too many renders

    return () => clearTimeout(timeoutId);
  }, [previewContent, isMathJaxReady, lastRenderedContent, value]);

  return (
    <div className="space-y-3">
      <TextField
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter LaTeX (e.g. \int_0^\infty x^2 \, dx or \frac{a}{b})"
        disabled={isSubmitting || disabled}
        error={!!error}
        autoFocus={autoFocus}
        multiline
      />

      {/* Preview */}
      {value?.trim() && (
        <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            LaTeX preview
          </div>

          {renderError ? (
            <div className="text-sm text-red-500 italic">{renderError}</div>
          ) : (
            <div
              ref={previewRef}
              className="prose prose-sm max-w-none dark:prose-invert"
            >
              {previewContent}
            </div>
          )}
        </div>
      )}

      <FieldHelperText
        includeDescription={includeDescription}
        showError={showError}
        error={error}
        property={property}
      />
    </div>
  );
}
