import type { FireCMSContext, FormContext } from "@firecms/core";
import { markAllByteUnitsFinished } from "@bytes-and-nibbles/shared";

type SnackbarControllerType = FireCMSContext["snackbarController"];

/** CMS-only form field; never persist to Firestore. */
export const CMS_UI_MARK_ALL_CONTENT_FINISHED_KEY =
  "cmsUi_markAllContentFinished" as const;

export function stripCmsUiOnlyByteKeys(
  values: Record<string, unknown>,
): void {
  delete values[CMS_UI_MARK_ALL_CONTENT_FINISHED_KEY];
}

/**
 * Sets every byte `is_finished` flag in the current form (clone + setFieldValue).
 */
export function markAllByteContentFinishedInForm(
  formContext: FormContext,
  snackbarController: SnackbarControllerType,
): void {
  const sections = formContext.values?.sections;
  if (!Array.isArray(sections) || sections.length === 0) {
    snackbarController.open({
      type: "info",
      message: "No sections to update.",
    });
    return;
  }
  const next = structuredClone(sections) as typeof sections;
  markAllByteUnitsFinished({ sections: next });
  formContext.setFieldValue("sections", next, true);
  snackbarController.open({
    type: "success",
    message: "All sections and blocks marked finished. Save to persist.",
  });
}
