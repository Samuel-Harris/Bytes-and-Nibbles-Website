import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

function coerceString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export type UseLocalDebouncedFormStringOptions = {
  debounceMs?: number;
};

export function useLocalDebouncedFormString(
  formValue: unknown,
  setValue: (value: string) => void,
  isSubmitting: boolean,
  options?: UseLocalDebouncedFormStringOptions,
): {
  text: string;
  setTextFromInput: (next: string) => void;
  onBlur: () => void;
} {
  const debounceMs = options?.debounceMs ?? 200;
  const coerced = coerceString(formValue);
  const lastPushedRef = useRef(coerced);
  const textRef = useRef(coerced);
  const lastFormValueRef = useRef(coerced);
  const dirtyRef = useRef(false);
  const [text, setText] = useState(coerced);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasSubmittingRef = useRef(false);

  const cancelDebounce = useCallback(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  const pushToForm = useCallback(
    (next: string) => {
      if (next !== lastPushedRef.current) {
        lastPushedRef.current = next;
        setValue(next);
      }
    },
    [setValue],
  );

  const flush = useCallback(() => {
    cancelDebounce();
    pushToForm(textRef.current);
  }, [cancelDebounce, pushToForm]);

  useEffect(() => {
    const v = coerceString(formValue);
    const formChanged = v !== lastFormValueRef.current;
    lastFormValueRef.current = v;

    if (v === textRef.current) {
      dirtyRef.current = false;
      lastPushedRef.current = v;
      return;
    }

    const acceptFormValue =
      !dirtyRef.current ||
      (formChanged && v !== textRef.current);

    if (acceptFormValue) {
      cancelDebounce();
      dirtyRef.current = false;
      lastPushedRef.current = v;
      textRef.current = v;
      setText(v);
    }
  }, [formValue, cancelDebounce]);

  useLayoutEffect(() => {
    if (isSubmitting && !wasSubmittingRef.current) {
      flush();
    }
    wasSubmittingRef.current = isSubmitting;
  }, [isSubmitting, flush]);

  useEffect(
    () => () => {
      cancelDebounce();
      pushToForm(textRef.current);
    },
    [cancelDebounce, pushToForm],
  );

  const schedulePush = useCallback(() => {
    cancelDebounce();
    debounceRef.current = window.setTimeout(() => {
      debounceRef.current = null;
      pushToForm(textRef.current);
    }, debounceMs);
  }, [cancelDebounce, debounceMs, pushToForm]);

  const setTextFromInput = useCallback(
    (next: string) => {
      dirtyRef.current = true;
      textRef.current = next;
      setText(next);
      schedulePush();
    },
    [schedulePush],
  );

  const onBlur = useCallback(() => {
    cancelDebounce();
    pushToForm(textRef.current);
  }, [cancelDebounce, pushToForm]);

  return { text, setTextFromInput, onBlur };
}
