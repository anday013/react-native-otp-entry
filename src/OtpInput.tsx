import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  ColorValue,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { VerticalStick } from "./VerticalStick";

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

export interface OtpInputInstance {
  clear: () => void;
}

export const OtpInput = forwardRef<OtpInputInstance, OtpInputProps>(
  (
    {
      onTextChange,
      numberOfDigits,
      containerStyle,
      inputsContainerStyle,
      pinCodeContainerStyle,
      pinCodeTextStyle,
      focusColor = "#A4D0A4",
      focusStickBlinkingDuration,
      focusStickStyle,
    },
    ref
  ) => {
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
    useImperativeHandle(ref, () => ({ clear }));

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
                    focusColor && isFocusedInput
                      ? { borderColor: focusColor }
                      : {},
                    pinCodeContainerStyle,
                  ]}
                >
                  {isFocusedInput ? (
                    <VerticalStick
                      focusColor={focusColor}
                      style={focusStickStyle}
                      focusStickBlinkingDuration={focusStickBlinkingDuration}
                    />
                  ) : (
                    <Text style={[styles.codeText, pinCodeTextStyle]}>
                      {char}
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
          ref={inputRef}
          autoFocus
          style={styles.hiddenInput}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  inputsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  codeContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#DFDFDE",
    height: 60,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  codeText: {
    fontSize: 28,
    lineHeight: 38,
  },
  hiddenInput: {
    width: 1,
    height: 1,
    opacity: 0,
  },
});
