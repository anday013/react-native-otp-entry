import { useMemo, useRef, useState, useEffect } from "react";
import { Keyboard, TextInput } from "react-native";
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
  placeholder: _placeholder,
  defaultValue = "", // Default value support
}: OtpInputProps) => {
  const [text, setText] = useState(defaultValue.slice(0, numberOfDigits)); // Initialize with defaultValue
  const [isFocused, setIsFocused] = useState(autoFocus);
  const inputRef = useRef<TextInput>(null);
  const focusedInputIndex = text.length;

  const placeholder = useMemo(
    () => (_placeholder?.length === 1 ? _placeholder.repeat(numberOfDigits) : _placeholder),
    [_placeholder, numberOfDigits]
  );

  useEffect(() => {
    // Ensure state updates if defaultValue changes dynamically
    setText(defaultValue.slice(0, numberOfDigits));
  }, [defaultValue, numberOfDigits]);

  const handlePress = () => {
    if (!Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
    inputRef.current?.focus();
  };

  const handleTextChange = (value: string) => {
    if (type && regexMap[type].test(value)) return;
    if (disabled) return;

    setText(value);
    onTextChange?.(value);

    if (value.length === numberOfDigits) {
      onFilled?.(value);
      if (blurOnFilled) inputRef.current?.blur();
    }
  };

  const setTextWithRef = (value: string) => {
    const normalizedValue = value.slice(0, numberOfDigits);
    setText(normalizedValue);
    onTextChange?.(normalizedValue);
  };

  const clear = () => {
    setText("");
  };

  const focus = () => {
    inputRef.current?.focus();
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
    models: { text, inputRef, focusedInputIndex, isFocused, placeholder },
    actions: { handlePress, handleTextChange, clear, focus, handleFocus, handleBlur },
    forms: { setTextWithRef },
  };
};
