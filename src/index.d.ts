declare module "OTPInput" {
  import { ColorValue, TextInputProps, TextProps, TextStyle, ViewStyle } from "react-native";

  export interface OtpEntryProps {
    /**
     * Autofocus.
     */
    autoFocus: boolean;

    /**
     * The number of digits to be displayed in the OTP entry.
     */
    numberOfDigits: number;

    /**
     * The color of the input field border and stick when it is focused.
     */
    focusColor?: ColorValue;

    /**
     * The theme to be applied to the OTP entry.
     */
    theme?: Theme;

    /**
     * A callback function that is invoked when the OTP text changes.
     * It receives the updated text as an argument.
     */
    onTextChange?: (text: string) => void;

    /**
     * The duration (in milliseconds) for the focus stick to blink.
     */
    focusStickBlinkingDuration?: number;

    /**
     * A callback function that is invoked when the OTP entry is filled.
     * It receives the filled OTP text as an argument.
     */
    onFilled?: (text: string) => void;

    /**
     * A callback function that is invoked when the OTP entry is focused.
     */
    onFocus?: () => void;

    /**
     * A callback function that is invoked when the OTP entry is blurred.
     */
    onBlur?: () => void;

    /**
     * A flag to determine whether the OTP entry should blur when it is filled.
     */
    blurOnFilled?: boolean;

    /**
     * A flag to determine whether the focus stick should be hidden.
     */
    hideStick?: boolean;

    /**
     * A flag to determine whether the OTP entry should be in secure text entry mode.
     */
    secureTextEntry?: boolean;

    /**
     * A flag to determine whether the OTP entry is disabled.
     */
    disabled?: boolean;

    /**
     * Additional props to be passed to the `TextInput` component.
     */
    textInputProps?: TextInputProps;

    /**
     * Additional props to be passed to the `Text` component that renders each digit.
     * Allows customizing text behavior beyond styling (which is handled by pinCodeTextStyle in theme).
     */
    textProps?: TextProps;

    /**
     * The type of characters allowed in the OTP entry.
     */
    type?: "alpha" | "numeric" | "alphanumeric";

    /**
     * The placeholder text to be displayed in the OTP entry.
     */
    placeholder?: string;
  }

  export interface OtpInputRef {
    /**
     * Clears the value of the OTP input.
     */
    clear: () => void;

    /**
     * Focus of the OTP input.
     */
    focus: () => void;

    /**
     * Sets the value of the OTP input.
     * @param value - The value to be set.
     */
    setValue: (value: string) => void;

    /**
     * Blur the OTP input.
     */
    blur: () => void;
  }

  export interface Theme {
    /**
     * Custom styles for the root `View`.
     */
    containerStyle?: ViewStyle;

    /**
     * @deprecated Use `containerStyle` instead
     */
    inputsContainerStyle?: ViewStyle;

    /**
     * Custom styles for the container(s) that wraps each individual digit in the OTP entry.
     */
    pinCodeContainerStyle?: ViewStyle;

    /**
     * Custom styles for the text within each individual digit in the OTP entry.
     */
    pinCodeTextStyle?: TextStyle;

    /**
     * Custom styles for the focus stick, which indicates the focused input field.
     */
    focusStickStyle?: ViewStyle;

    /**
     * Custom styles for the container(s) of the filled digit in the OTP entry.
     */
    filledPinCodeContainerStyle?: ViewStyle;

    /**
     * Custom styles for the container of the focused digit in the OTP entry.
     */
    focusedPinCodeContainerStyle?: ViewStyle;

    /**
     * Custom styles for the container(s) of the disabled digit in the OTP entry.
     */
    disabledPinCodeContainerStyle?: ViewStyle;

    /**
     * Custom styles for the placeholder text in the OTP entry.
     */
    placeholderTextStyle?: TextStyle;
  }
}
