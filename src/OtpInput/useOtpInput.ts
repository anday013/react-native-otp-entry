import { useMemo, useRef, useState } from "react";
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
}: OtpInputProps) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(autoFocus);
  const inputRef = useRef<TextInput>(null);
  const focusedInputIndex = text.length;
  const placeholder = useMemo(
    () => (_placeholder?.length === 1 ? _placeholder.repeat(numberOfDigits) : _placeholder),
    [_placeholder, numberOfDigits]
  );

  const handlePress = () => {
    // To fix bug when keyboard is not popping up after being dismissed
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
      blurOnFilled && inputRef.current?.blur();
    }
  };

  const setTextWithRef = (value: string) => {
    const normalizedValue = value.length > numberOfDigits ? value.slice(0, numberOfDigits) : value;
    handleTextChange(normalizedValue);
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
    forms: { setText, setTextWithRef },
  };
};
