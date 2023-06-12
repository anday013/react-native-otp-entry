"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpInput = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const VerticalStick_1 = require("./VerticalStick");
exports.OtpInput = (0, react_1.forwardRef)(({ onTextChange, numberOfDigits, containerStyle, inputsContainerStyle, pinCodeContainerStyle, pinCodeTextStyle, focusColor = "#A4D0A4", focusStickBlinkingDuration, focusStickStyle, }, ref) => {
    const [text, setText] = (0, react_1.useState)("");
    const inputRef = (0, react_1.useRef)(null);
    const focusedInputIndex = text.length;
    const handlePress = () => {
        inputRef.current?.focus();
    };
    const handleTextChange = (value) => {
        setText(value);
        onTextChange?.(value);
    };
    const clear = () => {
        setText("");
    };
    (0, react_1.useImperativeHandle)(ref, () => ({ clear, setValue: setText }));
    return (<react_native_1.View style={[styles.container, containerStyle]}>
        <react_native_1.View style={[styles.inputsContainer, inputsContainerStyle]}>
          {Array(numberOfDigits)
            .fill(0)
            .map((_, index) => {
            const char = text[index];
            const isFocusedInput = index === focusedInputIndex;
            return (<react_native_1.Pressable key={`${char}-${index}`} onPress={handlePress} style={[
                    styles.codeContainer,
                    focusColor && isFocusedInput
                        ? { borderColor: focusColor }
                        : {},
                    pinCodeContainerStyle,
                ]}>
                  {isFocusedInput ? (<VerticalStick_1.VerticalStick focusColor={focusColor} style={focusStickStyle} focusStickBlinkingDuration={focusStickBlinkingDuration}/>) : (<react_native_1.Text style={[styles.codeText, pinCodeTextStyle]}>
                      {char}
                    </react_native_1.Text>)}
                </react_native_1.Pressable>);
        })}
        </react_native_1.View>
        <react_native_1.TextInput value={text} onChangeText={handleTextChange} maxLength={numberOfDigits} inputMode="numeric" ref={inputRef} autoFocus style={styles.hiddenInput}/>
      </react_native_1.View>);
});
const styles = react_native_1.StyleSheet.create({
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
