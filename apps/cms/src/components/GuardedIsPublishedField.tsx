import React, { useCallback, useEffect, useRef } from "react";
import {
  FieldProps,
  FieldHelperText,
  useSnackbarController,
} from "@firecms/core";
import { BooleanSwitchWithLabel } from "@firecms/ui";

export type PublishGuardFn = (
  values: Record<string, unknown>,
) => string | null;

export interface GuardedIsPublishedCustomProps {
  getPublishBlockMessage: PublishGuardFn;
}

export function GuardedIsPublishedField({
  property,
  value,
  setValue,
  includeDescription,
  showError,
  error,
  isSubmitting,
  disabled,
  autoFocus,
  size,
  customProps,
  context,
}: FieldProps<boolean, GuardedIsPublishedCustomProps, Record<string, unknown>>) {
  const snackbarController = useSnackbarController();
  const lastAutoRevertMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (value !== true) {
      lastAutoRevertMessageRef.current = null;
      return;
    }
    const msg = customProps.getPublishBlockMessage(
      context.values as Record<string, unknown>,
    );
    if (!msg) {
      lastAutoRevertMessageRef.current = null;
      return;
    }
    if (lastAutoRevertMessageRef.current === msg) {
      return;
    }
    lastAutoRevertMessageRef.current = msg;
    setValue(false);
    snackbarController.open({
      type: "error",
      message: msg,
      autoHideDuration: 14_000,
    });
  }, [context.values, customProps, setValue, snackbarController, value]);

  const handleChange = useCallback(
    (next: boolean) => {
      if (!next) {
        setValue(false);
        return;
      }
      const msg = customProps.getPublishBlockMessage(
        context.values as Record<string, unknown>,
      );
      if (msg) {
        snackbarController.open({
          type: "error",
          message: msg,
          autoHideDuration: 14_000,
        });
        return;
      }
      setValue(true);
    },
    [context.values, customProps, setValue, snackbarController],
  );

  const label =
    property.validation?.required === true
      ? `${property.name} *`
      : property.name;

  return (
    <div>
      <BooleanSwitchWithLabel
        value={Boolean(value)}
        onValueChange={handleChange}
        error={showError}
        label={label}
        disabled={isSubmitting || disabled}
        autoFocus={autoFocus}
        size={size ?? "large"}
      />
      <FieldHelperText
        includeDescription={includeDescription}
        showError={showError}
        error={error}
        property={property}
      />
    </div>
  );
}
