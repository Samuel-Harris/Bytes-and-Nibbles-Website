import React from "react";
import { FieldProps } from "firecms";
import {
  TextField,
  Box,
  Typography,
  FormHelperText,
  Paper,
} from "@mui/material";
import ReactMarkdown from "react-markdown";

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
  const actualValue = typeof value === "string" ? value : "";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Label - MUI TextField handles labels better internally */}
      <TextField
        label={property.name}
        value={actualValue ?? ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text content (supports Markdown)"
        disabled={isSubmitting || disabled}
        error={showError}
        autoFocus={autoFocus}
        multiline
        minRows={6}
        fullWidth
        variant="outlined"
      />

      {/* Markdown Preview */}
      {actualValue?.trim() && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "grey.900" : "grey.50",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontWeight: 500,
              color: "text.secondary",
              mb: 1,
            }}
          >
            Markdown preview
          </Typography>

          {/* Using a standard div for the preview. 
              v2 doesn't provide the 'prose' Tailwind class by default.
          */}
          <Box
            sx={{
              fontSize: "0.875rem",
              "& p": { my: 1 },
              "& ul": { pl: 2 },
            }}
          >
            <ReactMarkdown>{actualValue}</ReactMarkdown>
          </Box>
        </Paper>
      )}

      {/* Manual replacement for FieldHelperText */}
      {(showError || (includeDescription && property.description)) && (
        <FormHelperText error={showError} sx={{ ml: 1.5 }}>
          {showError ? error : property.description}
        </FormHelperText>
      )}
    </Box>
  );
}
