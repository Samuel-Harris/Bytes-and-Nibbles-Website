import React from "react";
import { FieldProps, FieldHelperText } from "@firecms/core";
import { TextField, Markdown } from "@firecms/ui";

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
  // Handle both string and object formats for backward compatibility
  const actualValue = typeof value === 'string' ? value : '';
  return (
    <div className="space-y-3">
      <TextField
        value={actualValue ?? ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text content (supports Markdown)"
        disabled={isSubmitting || disabled}
        error={!!error}
        autoFocus={autoFocus}
        multiline
      />

      {/* Markdown Preview */}
      {actualValue?.trim() && (
        <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Markdown preview
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <Markdown source={actualValue} />
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
