"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpInput = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const NUMBER_OF_DIGITS = 6;
exports.OtpInput = (0, react_1.forwardRef)((props, ref) => {
    const [text, setText] = (0, react_1.useState)("");
    const inputRef = (0, react_1.useRef)(null);
    const verticalStickIndex = text.length;
    const handlePress = () => {
        inputRef.current?.focus();
    };
    const handleTextChange = (value) => {
        setText(value);
        props.onTextChange(value);
    };
    const clear = () => {
        setText("");
    };
    (0, react_1.useImperativeHandle)(ref, () => ({ clear }));
    return (<react_native_1.View style={styles.container}>
        <react_native_1.View style={styles.inputsWrapper}>
          {Array(NUMBER_OF_DIGITS)
            .fill(0)
            .map((_, index) => {
            const char = text[index];
            return (<react_native_1.Pressable key={`${char}-${index}`} onPress={handlePress}>
                  <react_native_1.View style={styles.codeContainer}>
                    {index === verticalStickIndex ? (<react_native_1.View />) : (<react_native_1.Text style={styles.codeText}>{char}</react_native_1.Text>)}
                  </react_native_1.View>
                </react_native_1.Pressable>);
        })}
        </react_native_1.View>
        <react_native_1.TextInput value={text} onChangeText={handleTextChange} maxLength={NUMBER_OF_DIGITS} inputMode="numeric" ref={inputRef} autoFocus style={styles.hiddenInput}/>
      </react_native_1.View>);
});
const styles = react_native_1.StyleSheet.create({
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
