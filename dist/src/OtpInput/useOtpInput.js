"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOtpInput = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const useOtpInput = ({ onTextChange, onFilled, numberOfDigits = 6, disabled, autoFocus = true, }) => {
    const [text, setText] = (0, react_1.useState)("");
    const [hasCursor, setHasCursor] = (0, react_1.useState)(autoFocus);
    const inputRef = (0, react_1.useRef)(null);
    const focusedInputIndex = text.length;
    const handlePress = () => {
        // To fix bug when keyboard is not popping up after being dismissed
        if (!react_native_1.Keyboard.isVisible()) {
            react_native_1.Keyboard.dismiss();
        }
        inputRef.current?.focus();
    };
    const handleTextChange = (value) => {
        if (disabled)
            return;
        setText(value);
        onTextChange?.(value);
        if (value.length === numberOfDigits) {
            onFilled?.(value);
        }
    };
    const setTextWithRef = (value) => {
        const normalizedValue = value.length > numberOfDigits ? value.slice(0, numberOfDigits) : value;
        handleTextChange(normalizedValue);
    };
    const clear = () => {
        setText("");
    };
    const focus = () => {
        inputRef.current?.focus();
    };
    const handleFocus = () => {
        setHasCursor(true);
    };
    const handleBlur = () => {
        setHasCursor(false);
    };
    return {
        models: { text, inputRef, focusedInputIndex, hasCursor },
        actions: { handlePress, handleTextChange, clear, focus, handleFocus, handleBlur },
        forms: { setText, setTextWithRef },
    };
};
exports.useOtpInput = useOtpInput;
