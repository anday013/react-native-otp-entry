import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { OtpInputProps } from "./OtpInput.types";

export const useOtpInput = ({ onTextChange }: OtpInputProps) => {
  const [text, setText] = useState("");
  const inputRef = useRef<TextInput>(null);
  const focusedInputIndex = text.length;

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleTextChange = (value: string) => {
    setText(value);
    onTextChange?.(value);
  };

  const clear = () => {
    setText("");
  };

  return {
    models: { text, inputRef, focusedInputIndex },
    actions: { handlePress, handleTextChange, clear },
    forms: { setText },
  };
};
