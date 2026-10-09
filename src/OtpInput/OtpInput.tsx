import * as React from "react";
import { forwardRef, useImperativeHandle } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { styles } from "./OtpInput.styles";
import { OtpInputProps, OtpInputRef } from "./OtpInput.types";
import { VerticalStick } from "./VerticalStick";
import { useOtpInput } from "./useOtpInput";

export const OtpInput = forwardRef<OtpInputRef, OtpInputProps>((props, ref) => {
  const {
    models: { text, inputRef, focusedInputIndex, isFocused, placeholder, selection },
    actions: {
      clear,
      handlePress,
      handleTextChange,
      focus,
      handleFocus,
      handleBlur,
      blur,
      handleCellLayout,
      handleInputLayout,
      handleInputPressIn,
      handleInputPressOut,
      handleSelectionChange,
    },
    forms: { setTextWithRef },
  } = useOtpInput(props);
  const {
    disabled,
    numberOfDigits = 6,
    autoFocus = true,
    hideStick,
    focusColor = "#A4D0A4",
    focusStickBlinkingDuration,
    secureTextEntry = false,
    theme = {},
    textInputProps,
    textProps,
    type = "numeric",
  } = props;
  const {
    containerStyle,
    inputsContainerStyle,
    pinCodeContainerStyle,
    pinCodeTextStyle,
    focusStickStyle,
    focusedPinCodeContainerStyle,
    filledPinCodeContainerStyle,
    disabledPinCodeContainerStyle,
    placeholderTextStyle,
  } = theme;

  useImperativeHandle(ref, () => ({ clear, focus, setValue: setTextWithRef, blur }));

  const generatePinCodeContainerStyle = (isFocusedContainer: boolean, char: string) => {
    const stylesArray = [styles.codeContainer, pinCodeContainerStyle];
    if (focusColor && isFocusedContainer) {
      stylesArray.push({ borderColor: focusColor });
    }

    if (focusedPinCodeContainerStyle && isFocusedContainer) {
      stylesArray.push(focusedPinCodeContainerStyle);
    }

    if (filledPinCodeContainerStyle && Boolean(char)) {
      stylesArray.push(filledPinCodeContainerStyle);
    }

    if (disabledPinCodeContainerStyle && disabled) {
      stylesArray.push(disabledPinCodeContainerStyle);
    }

    return stylesArray;
  };

  const placeholderStyle = {
    opacity: !!placeholder ? 0.5 : pinCodeTextStyle?.opacity || 1,
    ...(!!placeholder ? placeholderTextStyle : []),
  };

  return (
    <View style={[styles.container, containerStyle, inputsContainerStyle]}>
      {Array(numberOfDigits)
        .fill(0)
        .map((_, index) => {
          const isPlaceholderCell = !!placeholder && !text?.[index];
          const char = isPlaceholderCell ? placeholder?.[index] || " " : text[index];
          const isFocusedInput = index === focusedInputIndex && !disabled && Boolean(isFocused);

          return (
            <Pressable
              key={index}
              disabled={disabled}
              onPress={() => handlePress(index)}
              onLayout={(event) => handleCellLayout(index, event)}
              style={generatePinCodeContainerStyle(isFocusedInput, text[index])}
              testID={textInputProps?.testID ? `${textInputProps.testID}-${index}` : "otp-input"}
              nativeID={
                textInputProps?.nativeID ? `${textInputProps.nativeID}-${index}` : undefined
              }
            >
              {isFocusedInput && !text[index] && !hideStick ? (
                <VerticalStick
                  focusColor={focusColor}
                  style={focusStickStyle}
                  focusStickBlinkingDuration={focusStickBlinkingDuration}
                />
              ) : (
                <Text
                  {...textProps}
                  testID={textProps?.testID ? `${textProps.testID}-${index}` : undefined}
                  style={[
                    styles.codeText,
                    pinCodeTextStyle,
                    isPlaceholderCell ? placeholderStyle : {},
                    textProps?.style,
                  ]}
                >
                  {char && secureTextEntry ? "•" : char}
                </Text>
              )}
            </Pressable>
          );
        })}
      <TextInput
        value={text}
        maxLength={numberOfDigits}
        inputMode={type === "numeric" ? type : "text"}
        textContentType="oneTimeCode"
        ref={inputRef}
        autoFocus={autoFocus}
        secureTextEntry={secureTextEntry}
        autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
        aria-disabled={disabled}
        editable={!disabled}
        testID="otp-input-hidden"
        onFocus={handleFocus}
        onBlur={handleBlur}
        caretHidden={Platform.OS === "ios"}
        {...textInputProps}
        selection={selection}
        onChangeText={(value) => {
          handleTextChange(value);
          textInputProps?.onChangeText?.(value);
        }}
        onLayout={handleInputLayout}
        onPressIn={handleInputPressIn}
        onPressOut={handleInputPressOut}
        onSelectionChange={handleSelectionChange}
        style={[StyleSheet.absoluteFill, styles.hiddenInput, textInputProps?.style]}
      />
    </View>
  );
});
