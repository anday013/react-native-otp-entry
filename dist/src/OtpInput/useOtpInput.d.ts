/// <reference types="react" />
import { TextInput } from "react-native";
import { OtpInputProps } from "./OtpInput.types";
export declare const useOtpInput: ({ onTextChange, onFilled, numberOfDigits }: OtpInputProps) => {
    models: {
        text: string;
        inputRef: import("react").RefObject<TextInput>;
        focusedInputIndex: number;
    };
    actions: {
        handlePress: () => void;
        handleTextChange: (value: string) => void;
        clear: () => void;
        focus: () => void;
    };
    forms: {
        setText: import("react").Dispatch<import("react").SetStateAction<string>>;
        setTextWithRef: (value: string) => void;
    };
};
