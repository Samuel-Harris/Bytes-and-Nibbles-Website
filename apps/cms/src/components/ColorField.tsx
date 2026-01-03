import React from "react";
import { FieldProps, FieldHelperText } from "@firecms/core";
import { TextField } from "@firecms/ui";

interface ColorFieldCustomProps {
  defaultColor?: string;
}

export function ColorField({
  property,
  value,
  setValue,
  customProps,
  includeDescription,
  showError,
  error,
  isSubmitting,
  disabled,
  autoFocus,
}: FieldProps<string, ColorFieldCustomProps>) {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    // Basic validation before setting
    if (
      newValue === "" ||
      /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/i.test(newValue)
    ) {
      setValue(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {property.name}
      </label>

      <div className="flex items-center gap-3">
        {/* Color Picker Input */}
        <input
          type="color"
          value={value || customProps?.defaultColor || "#000000"}
          onChange={handleColorChange}
          disabled={isSubmitting || disabled}
          autoFocus={autoFocus}
          className="w-12 h-10 border border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        />

        {/* Hex Text Input */}
        <TextField
          value={value || ""}
          onChange={handleTextChange}
          placeholder="#000000"
          disabled={isSubmitting || disabled}
          error={!!error}
          className="flex-1"
        />
      </div>

      <FieldHelperText
        includeDescription={includeDescription}
        showError={showError}
        error={error}
        property={property}
      />
    </div>
  );
}
