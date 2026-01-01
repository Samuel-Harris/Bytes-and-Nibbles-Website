import React from "react";
import { FieldProps } from "firecms";
import { TextField, Box, FormLabel, FormHelperText } from "@mui/material";

interface ColorFieldCustomProps {
  defaultColor?: string;
}

export function ColorField({
  property,
  value,
  setValue,
  includeDescription,
  showError,
  error,
  isSubmitting,
  disabled,
  autoFocus,
}: FieldProps<string, ColorFieldCustomProps>) {
  // Custom props are accessed via the property object in v2 if passed via the schema
  const customProps = property.customProps as ColorFieldCustomProps;

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <FormLabel sx={{ fontSize: "0.875rem" }}>{property.name}</FormLabel>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Color Picker Input */}
        <input
          type="color"
          value={value || customProps?.defaultColor || "#000000"}
          onChange={handleColorChange}
          disabled={isSubmitting || disabled}
          autoFocus={autoFocus}
          style={{
            width: "48px",
            height: "40px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
        />

        {/* Hex Text Input */}
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={value || ""}
          onChange={handleTextChange}
          placeholder="#000000"
          disabled={isSubmitting || disabled}
          error={showError}
        />
      </Box>

      {/* Manual replacement for FieldHelperText */}
      {(showError || (includeDescription && property.description)) && (
        <FormHelperText error={showError}>
          {showError ? error : property.description}
        </FormHelperText>
      )}
    </Box>
  );
}
