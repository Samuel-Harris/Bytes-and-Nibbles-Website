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
  const { loaded, mathJax: mathJaxFromHook } = useMathJax();

  const displayContent = useMemo(() => {
    return value?.trim() ? value : "";
  }, [value]);

  useEffect(() => {
    // Prioritize the window object directly to avoid stale state issues
    const mj = mathJaxFromHook || window.MathJax;

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
        minRows={3}
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
