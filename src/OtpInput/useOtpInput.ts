import { useMemo, useRef, useState } from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  LayoutRectangle,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TextInput,
  TextInputSelectionChangeEventData,
} from "react-native";
import { OtpInputProps } from "./OtpInput.types";

const regexMap = {
  alpha: /[^a-zA-Z]/,
  numeric: /[^\d]/,
  alphanumeric: /[^a-zA-Z\d]/,
};

export const useOtpInput = ({
  onTextChange,
  onFilled,
  numberOfDigits = 6,
  disabled,
  autoFocus = true,
  blurOnFilled,
  type,
  onFocus,
  onBlur,
  textInputProps,
  placeholder: _placeholder,
}: OtpInputProps) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(autoFocus);
  const inputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const latestInput = useRef({ text: "", selection });
  const staleSelection = useRef<{ start: number; end: number; rejected?: boolean } | null>(null);
  const cellLayouts = useRef<Record<number, LayoutRectangle>>({});
  const inputLayout = useRef({ x: 0, y: 0 });
  const pressStartedAt = useRef<number | null>(null);
  const activeSelection = textInputProps?.selection ?? selection;
  const focusedInputIndex = Math.min(activeSelection.start, text.length, numberOfDigits - 1);
  const placeholder = useMemo(
    () => (_placeholder?.length === 1 ? _placeholder.repeat(numberOfDigits) : _placeholder),
    [_placeholder, numberOfDigits]
  );

  const updateSelection = (nextSelection: { start: number; end: number }) => {
    latestInput.current.selection = nextSelection;
    setSelection(nextSelection);
  };

  const handlePress = (index = latestInput.current.text.length) => {
    if (disabled) return;
    staleSelection.current = null;
    const start = Math.max(0, Math.min(index, latestInput.current.text.length));
    updateSelection({ start, end: Math.min(start + 1, latestInput.current.text.length) });
    // To fix bug when keyboard is not popping up after being dismissed
    if (!Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
    inputRef.current?.focus();
  };

  const handleTextChange = (value: string, isProgrammatic = false) => {
    if (disabled) return;
    if (type && regexMap[type].test(value)) {
      staleSelection.current = { ...latestInput.current.selection, rejected: true };
      return;
    }
    const previousText = latestInput.current.text;
    const previousSelection = textInputProps?.selection ?? latestInput.current.selection;
    const start = Math.max(0, Math.min(previousSelection.start, previousText.length));
    const end = Math.max(start, Math.min(previousSelection.end ?? start, previousText.length));
    const insertedLength = value.length - previousText.length + end - start;
    let cursor = start + insertedLength;

    // Prefer the selected range: a text diff alone is ambiguous for repeated digits.
    if (
      cursor < 0 ||
      value.slice(0, Math.min(start, cursor)) !== previousText.slice(0, Math.min(start, cursor)) ||
      value.slice(cursor) !== previousText.slice(end)
    ) {
      // Autofill or a native edit can replace a different range (including the whole code).
      let prefixLength = 0;
      while (
        prefixLength < Math.min(previousText.length, value.length) &&
        previousText[prefixLength] === value[prefixLength]
      ) {
        prefixLength++;
      }
      let suffixLength = 0;
      while (
        suffixLength < Math.min(previousText.length, value.length) - prefixLength &&
        previousText[previousText.length - suffixLength - 1] ===
          value[value.length - suffixLength - 1]
      ) {
        suffixLength++;
      }
      cursor = value.length - suffixLength;
    }

    const normalizedValue = value.slice(0, numberOfDigits);
    cursor = isProgrammatic ? normalizedValue.length : Math.min(cursor, normalizedValue.length);
    latestInput.current.text = normalizedValue;
    // Only guard multi-character native insertions. Guarding ordinary typing would
    // swallow a subsequent ArrowLeft back to the previous caret position.
    staleSelection.current = !isProgrammatic && insertedLength > 1 ? { start, end } : null;
    setText(normalizedValue);
    updateSelection({ start: cursor, end: cursor });
    onTextChange?.(normalizedValue);
    if (normalizedValue.length === numberOfDigits) {
      onFilled?.(normalizedValue);
      blurOnFilled && inputRef.current?.blur();
    }
  };

  const setTextWithRef = (value: string) => {
    const normalizedValue = value.length > numberOfDigits ? value.slice(0, numberOfDigits) : value;
    handleTextChange(normalizedValue, true);
  };

  const clear = () => {
    staleSelection.current = null;
    latestInput.current.text = "";
    setText("");
    updateSelection({ start: 0, end: 0 });
  };

  const handleCellLayout = (index: number, event: LayoutChangeEvent) => {
    cellLayouts.current[index] = event.nativeEvent.layout;
  };

  const handleInputLayout = (event: LayoutChangeEvent) => {
    inputLayout.current = event.nativeEvent.layout;
    textInputProps?.onLayout?.(event);
  };

  const handleInputPressIn = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    staleSelection.current = null;
    pressStartedAt.current = event.nativeEvent.timestamp;
    textInputProps?.onPressIn?.(event);
  };

  const handleInputPressOut = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    const { locationX, locationY, timestamp } = event.nativeEvent;
    // Keep native long-press/paste gestures intact. The input overlays the visible cells.
    if (pressStartedAt.current !== null && timestamp - pressStartedAt.current < 500) {
      const x = locationX + inputLayout.current.x;
      const y = locationY + inputLayout.current.y;
      const cell = Object.entries(cellLayouts.current).find(
        ([index, layout]) =>
          Number(index) < numberOfDigits &&
          x >= layout.x &&
          x <= layout.x + layout.width &&
          y >= layout.y &&
          y <= layout.y + layout.height
      );
      if (cell) handlePress(Number(cell[0]));
    }
    pressStartedAt.current = null;
    textInputProps?.onPressOut?.(event);
  };

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    const nextSelection = event.nativeEvent.selection;
    // A truncated paste can report the pre-edit selection after the new text.
    // Ignore that one stale event, but preserve normal native selection/navigation.
    const previousSelection = staleSelection.current;
    staleSelection.current = null;
    const isStale =
      previousSelection &&
      (previousSelection.rejected ||
        (nextSelection.start === previousSelection.start &&
          nextSelection.end === previousSelection.end &&
          (nextSelection.start !== latestInput.current.selection.start ||
            nextSelection.end !== latestInput.current.selection.end)));
    if (
      !disabled &&
      !isStale &&
      nextSelection.start >= 0 &&
      nextSelection.end >= nextSelection.start &&
      nextSelection.end <= latestInput.current.text.length
    ) {
      updateSelection(nextSelection);
    }
    textInputProps?.onSelectionChange?.(event);
  };

  const focus = () => {
    inputRef.current?.focus();
  };

  const blur = () => {
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return {
    models: {
      text,
      inputRef,
      focusedInputIndex,
      isFocused,
      placeholder,
      selection: activeSelection,
    },
    actions: {
      handlePress,
      handleTextChange,
      clear,
      focus,
      blur,
      handleFocus,
      handleBlur,
      handleCellLayout,
      handleInputLayout,
      handleInputPressIn,
      handleInputPressOut,
      handleSelectionChange,
    },
    forms: { setText, setTextWithRef },
  };
};
