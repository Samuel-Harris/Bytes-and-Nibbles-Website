import React from "react";
import { FieldProps, FieldHelperText, useSnackbarController } from "@firecms/core";
import { Button } from "@firecms/ui";
import { markAllByteContentFinishedInForm } from "../collections/markAllByteContentFinishedForm";

/**
 * CMS-only helper: not stored in Firestore (stripped in `onPreSave` / `onFetch`).
 */
export function MarkAllByteFinishedToolField({
  property,
  includeDescription,
  showError,
  error,
  disabled,
  context,
}: FieldProps<string>) {
  const snackbarController = useSnackbarController();

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="filled"
        color="primary"
        disabled={disabled}
        onClick={() =>
          markAllByteContentFinishedInForm(context, snackbarController)
        }
      >
        {property.name}
      </Button>
      <FieldHelperText
        includeDescription={includeDescription}
        showError={showError}
        error={error}
        property={property}
      />
    </div>
  );
}
