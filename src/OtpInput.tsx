import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const NUMBER_OF_DIGITS = 6;

export interface OtpInputProps {
  onTextChange: (text: string) => void;
}

export interface OtpInputInstance {
  clear: () => void;
}

export const OtpInput = forwardRef<OtpInputInstance, OtpInputProps>(
  (props, ref) => {
    const [text, setText] = useState("");
    const inputRef = useRef(null);
    const verticalStickIndex = text.length;

    const handlePress = () => {
      inputRef.current?.focus();
    };

    const handleTextChange = (value: string) => {
      setText(value);
      props.onTextChange(value);
    };

    const clear = () => {
      setText("");
    };
    useImperativeHandle(ref, () => ({ clear }));

    return (
      <View style={styles.container}>
        <View style={styles.inputsWrapper}>
          {Array(NUMBER_OF_DIGITS)
            .fill(0)
            .map((_, index) => {
              const char = text[index];

              return (
                <Pressable key={`${char}-${index}`} onPress={handlePress}>
                  <View style={styles.codeContainer}>
                    {index === verticalStickIndex ? (
                      <View />
                    ) : (
                      <Text style={styles.codeText}>{char}</Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
        </View>
        <TextInput
          value={text}
          onChangeText={handleTextChange}
          maxLength={NUMBER_OF_DIGITS}
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
  inputsWrapper: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  codeContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "grey",
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
