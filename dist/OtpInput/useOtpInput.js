"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOtpInput = void 0;
const react_1 = require("react");
const useOtpInput = ({ onTextChange }) => {
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
    return {
        models: { text, inputRef, focusedInputIndex },
        actions: { handlePress, handleTextChange, clear },
        forms: { setText },
    };
};
exports.useOtpInput = useOtpInput;
