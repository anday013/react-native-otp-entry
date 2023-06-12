/// <reference types="react" />
import { ColorValue, TextStyle, ViewStyle } from "react-native";
export interface OtpInputProps {
    numberOfDigits: number;
    focusColor?: ColorValue;
    onTextChange?: (text: string) => void;
    containerStyle?: ViewStyle;
    inputsContainerStyle?: ViewStyle;
    pinCodeContainerStyle?: ViewStyle;
    pinCodeTextStyle?: TextStyle;
    focusStickStyle?: ViewStyle;
    focusStickBlinkingDuration?: number;
}
export interface OtpInputRef {
    clear: () => void;
    setValue: (value: string) => void;
}
export declare const OtpInput: import("react").ForwardRefExoticComponent<OtpInputProps & import("react").RefAttributes<OtpInputRef>>;
