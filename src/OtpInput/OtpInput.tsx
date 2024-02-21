import { forwardRef, useImperativeHandle, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./OtpInput.styles";
import { OtpInputProps, OtpInputRef } from "./OtpInput.types";
import { VerticalStick } from "./VerticalStick";
import { useOtpInput } from "./useOtpInput";

export const OtpInput = forwardRef<OtpInputRef, OtpInputProps>((props, ref) => {
  const {
    models: { text, inputRef, focusedInputIndex },
    actions: { clear, handlePress, handleTextChange, focus },
    forms: { setTextWithRef },
  } = useOtpInput(props);
  const {
    numberOfDigits,
    autoFocus = true,
    hideStick,
    focusColor = "#A4D0A4",
    focusStickBlinkingDuration,
    secureTextEntry = false,
    theme = {},
    ...rest
  } = props;
  const {
    containerStyle,
    inputsContainerStyle,
    pinCodeContainerStyle,
    pinCodeTextStyle,
    focusStickStyle,
    focusedPinCodeContainerStyle,
    filledPinCodeContainerStyle,
  } = theme;

  const [hasCursor, setHasCursor] = useState(false);

  useImperativeHandle(ref, () => ({ clear, focus, setValue: setTextWithRef }));

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputsContainer, inputsContainerStyle]}>
        {Array(numberOfDigits)
          .fill(0)
          .map((_, index) => {
            const char = text[index];
            const isFocusedInput = index === focusedInputIndex;

            return (
              <Pressable
                key={`${char}-${index}`}
                onPress={handlePress}
                style={[
                  styles.codeContainer,
                  pinCodeContainerStyle,
                  focusColor && isFocusedInput ? { borderColor: focusColor } : {},
                  focusedPinCodeContainerStyle && isFocusedInput
                    ? { ...focusedPinCodeContainerStyle }
                    : {},
                  filledPinCodeContainerStyle && Boolean(char)
                    ? { ...filledPinCodeContainerStyle }
                    : {},
                ]}
                testID="otp-input"
              >
                {isFocusedInput && (hasCursor || !hideStick) ? (
                  <VerticalStick
                    focusColor={focusColor}
                    style={focusStickStyle}
                    focusStickBlinkingDuration={focusStickBlinkingDuration}
                  />
                ) : (
                  <Text style={[styles.codeText, pinCodeTextStyle]}>
                    {char && secureTextEntry ? "•" : char}
                  </Text>
                )}
              </Pressable>
            );
          })}
      </View>
      <TextInput
        value={text}
        onChangeText={handleTextChange}
        maxLength={numberOfDigits}
        inputMode="numeric"
        textContentType="oneTimeCode"
        ref={inputRef}
        autoFocus={autoFocus}
        style={styles.hiddenInput}
        secureTextEntry={secureTextEntry}
        autoComplete="one-time-code"
        testID="otp-input-hidden"
        onFocus={() => setHasCursor(true)}
        onBlur={() => setHasCursor(false)}
        {...rest}
      />
    </View>
  );
});
