declare module "OTPInput" {
  import { ColorValue, TextStyle, ViewStyle } from "react-native";

  export interface OtpInputProps {
    numberOfDigits: number;
    focusColor?: ColorValue;
    onTextChange?: (text: string) => void;
    containerStyle?: ViewStyle;
    inputsContainerStyle?: ViewStyle;
    pinCodeContainerStyle?: ViewStyle;
    pinCodeTextStyle?: TextStyle;
  }

  export interface OtpInputInstance {
    clear: () => void;
  }
}
