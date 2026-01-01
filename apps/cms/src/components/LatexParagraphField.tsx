import React, { useEffect, useRef, useState, useMemo } from "react";
import { FieldProps } from "firecms";
import { TextField, Box, Typography, Paper } from "@mui/material";
import { useMathJax } from "../hooks/useMathJax";

export function LatexParagraphField({
  property,
  value,
  setValue,
  error,
  showError,
  disabled,
  autoFocus,
  isSubmitting,
}: FieldProps<string>) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const { loaded, mathJax: mathJaxFromHook } = useMathJax();

  const displayContent = useMemo(() => {
    return value?.trim() ? `$$${value}$$` : "";
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
      } catch (err: any) {
        setRenderError("LaTeX syntax error");
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [displayContent, loaded, mathJaxFromHook]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 1 }}>
      <TextField
        label={property.name}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        disabled={isSubmitting || disabled}
        error={showError && !!error}
        helperText={showError ? error : property.description}
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        autoFocus={autoFocus}
      />

      {displayContent && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "grey.900" : "grey.50",
            borderColor: renderError ? "error.main" : "divider",
          }}
        >
          <Typography
            variant="caption"
            sx={{ mb: 1, fontWeight: "bold", display: "block" }}
          >
            LaTeX Preview
          </Typography>

          {renderError ? (
            <Typography variant="body2" color="error">
              {renderError}
            </Typography>
          ) : (
            <Box ref={previewRef} sx={{ overflowX: "auto", py: 1 }}>
              {displayContent}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
