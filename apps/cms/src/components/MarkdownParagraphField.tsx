import { useDeferredValue } from "react";
import { FieldProps, FieldHelperText } from "@firecms/core";
import { TextField, Markdown } from "@firecms/ui";
import { useLocalDebouncedFormString } from "../hooks/useLocalDebouncedFormString";

export function MarkdownParagraphField({
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
  const deferredPreviewSource = useDeferredValue(text);

  return (
    <div className="space-y-3">
      <TextField
        value={text}
        onChange={(e) => setTextFromInput(e.target.value)}
        onBlur={onBlur}
        placeholder="Enter text content (supports Markdown)"
        disabled={isSubmitting || disabled}
        error={!!error}
        autoFocus={autoFocus}
        multiline
        minRows={6}
      />

      {deferredPreviewSource?.trim() && (
        <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Markdown preview
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <Markdown source={deferredPreviewSource} />
          </div>
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
