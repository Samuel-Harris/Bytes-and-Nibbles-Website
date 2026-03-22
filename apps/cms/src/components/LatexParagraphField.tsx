import { useEffect, useRef, useState } from "react";
import { FieldProps, FieldHelperText } from "@firecms/core";
import { TextField } from "@firecms/ui";
import { useMathJax } from "@bytes-and-nibbles/shared";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useLocalDebouncedFormString } from "../hooks/useLocalDebouncedFormString";

const LATEX_PREVIEW_DEBOUNCE_MS = 550;

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
  const { text, setTextFromInput, onBlur } = useLocalDebouncedFormString(
    value,
    setValue,
    Boolean(isSubmitting),
  );

  const previewRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const { loaded, mathJax: mathJaxFromHook } = useMathJax();

  const trimmedForPreview = text?.trim() ? text : "";
  const debouncedPreviewTex = useDebouncedValue(
    trimmedForPreview,
    LATEX_PREVIEW_DEBOUNCE_MS,
  );

  const displayContent = debouncedPreviewTex.trim() ? debouncedPreviewTex : "";

  useEffect(() => {
    const mj = mathJaxFromHook || window.MathJax;

    if (!loaded || !mj || !previewRef.current || !displayContent) {
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        const el = previewRef.current;
        if (!el || cancelled) {
          return;
        }

        try {
          if (typeof mj.typesetClear === "function") {
            mj.typesetClear([el]);
          }
          if (typeof mj.texReset === "function") {
            mj.texReset();
          }

          if (typeof mj.typesetPromise === "function") {
            await mj.typesetPromise([el]);
            if (cancelled) {
              return;
            }
            setRenderError(null);
          } else {
            console.warn("MathJax found but typesetPromise is missing");
          }
        } catch (err: unknown) {
          if (cancelled) {
            return;
          }
          const message = err instanceof Error ? err.message : String(err);
          setRenderError(`LaTeX syntax error ${message}`);
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [displayContent, loaded, mathJaxFromHook]);

  return (
    <div className="space-y-3">
      <TextField
        value={text}
        onChange={(e) => setTextFromInput(e.target.value)}
        onBlur={onBlur}
        placeholder="Enter LaTeX (e.g. \int_0^\infty x^2 \, dx or \frac{a}{b})"
        disabled={isSubmitting || disabled}
        error={!!error}
        autoFocus={autoFocus}
        multiline
        minRows={3}
      />

      {text?.trim() && (
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
              {displayContent || (
                <span className="text-gray-500 dark:text-gray-400 italic text-sm">
                  Preview updates after you pause typing.
                </span>
              )}
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
