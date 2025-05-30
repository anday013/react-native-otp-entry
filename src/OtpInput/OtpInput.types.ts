import { ColorValue, TextInputProps, TextProps, TextStyle, ViewStyle } from "react-native";

export interface OtpInputProps {
  numberOfDigits?: number;
  autoFocus?: boolean;
  focusColor?: ColorValue;
  onTextChange?: (text: string) => void;
  onFilled?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  blurOnFilled?: boolean;
  hideStick?: boolean;
  focusStickBlinkingDuration?: number;
  secureTextEntry?: boolean;
  theme?: Theme;
  disabled?: boolean;
  textInputProps?: TextInputProps;
  textProps?: TextProps;
  type?: "alpha" | "numeric" | "alphanumeric";
  placeholder?: string;
}

export interface OtpInputRef {
  clear: () => void;
  focus: () => void;
  setValue: (value: string) => void;
  blur: () => void;
}

export interface Theme {
  containerStyle?: ViewStyle;
  /**
   * @deprecated Use `containerStyle` instead
   */
  inputsContainerStyle?: ViewStyle;
  pinCodeContainerStyle?: ViewStyle;
  filledPinCodeContainerStyle?: ViewStyle;
  pinCodeTextStyle?: TextStyle;
  focusStickStyle?: ViewStyle;
  focusedPinCodeContainerStyle?: ViewStyle;
  disabledPinCodeContainerStyle?: ViewStyle;
  placeholderTextStyle?: TextStyle;
}
