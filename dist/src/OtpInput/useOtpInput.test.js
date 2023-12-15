"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const React = require("react");
const react_native_2 = require("react-native");
const useOtpInput_1 = require("./useOtpInput");
const renderUseOtInput = (props) => (0, react_native_1.renderHook)(() => (0, useOtpInput_1.useOtpInput)({ numberOfDigits: 6, ...props }));
describe("useOtpInput", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("should return models as defined", () => {
        const { result: { current: { models: { text, focusedInputIndex, inputRef }, }, }, } = renderUseOtInput();
        expect(text).toBe("");
        expect(focusedInputIndex).toBe(0);
        expect(inputRef.current).toBeNull();
    });
    test("clear() should clear text", () => {
        jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);
        const { result } = renderUseOtInput();
        result.current.actions.clear();
        (0, react_native_1.act)(() => {
            expect(result.current.forms.setText).toHaveBeenCalledWith("");
        });
    });
    test("focus() should focus on input", () => {
        jest.spyOn(React, "useRef").mockReturnValue({ current: { focus: jest.fn() } });
        const { result } = renderUseOtInput();
        result.current.actions.focus();
        (0, react_native_1.act)(() => {
            expect(result.current.models.inputRef.current?.focus).toHaveBeenCalled();
        });
    });
    test("setTextWithRef() should only call setText the first 'numberOfDigits' characters", () => {
        jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);
        const { result } = renderUseOtInput();
        result.current.forms.setTextWithRef("123456789");
        (0, react_native_1.act)(() => {
            expect(result.current.forms.setText).toHaveBeenCalledWith("123456");
        });
    });
    test("handlePress() should dismiss Keyboard if it's visible", () => {
        jest.spyOn(react_native_2.Keyboard, "dismiss");
        jest.spyOn(react_native_2.Keyboard, "isVisible").mockReturnValue(false);
        const { result } = renderUseOtInput();
        result.current.actions.handlePress();
        (0, react_native_1.act)(() => {
            expect(react_native_2.Keyboard.dismiss).toHaveBeenCalled();
        });
    });
    test("handlePress() should NOT dismiss Keyboard if it's NOT visible", () => {
        jest.spyOn(react_native_2.Keyboard, "dismiss");
        jest.spyOn(react_native_2.Keyboard, "isVisible").mockReturnValue(true);
        const { result } = renderUseOtInput();
        result.current.actions.handlePress();
        (0, react_native_1.act)(() => {
            expect(react_native_2.Keyboard.dismiss).not.toHaveBeenCalled();
        });
    });
    test("handlePress() should focus on input", () => {
        jest.spyOn(React, "useRef").mockReturnValue({ current: { focus: jest.fn() } });
        const { result } = renderUseOtInput();
        result.current.actions.handlePress();
        (0, react_native_1.act)(() => {
            expect(result.current.models.inputRef.current?.focus).toHaveBeenCalled();
        });
    });
    test("handleTextChange() should call setText() and onTextChange() with value", () => {
        const value = "123456";
        const mockOnTextChange = jest.fn();
        jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);
        const { result } = renderUseOtInput({ onTextChange: mockOnTextChange });
        result.current.actions.handleTextChange(value);
        (0, react_native_1.act)(() => {
            expect(result.current.forms.setText).toHaveBeenCalledWith(value);
            expect(mockOnTextChange).toHaveBeenCalledWith(value);
        });
    });
    test("onFilled() should be called when the input filled", () => {
        const value = "123456";
        const mockOnFilled = jest.fn();
        const { result } = renderUseOtInput({ onFilled: mockOnFilled });
        result.current.actions.handleTextChange(value);
        (0, react_native_1.act)(() => {
            expect(mockOnFilled).toHaveBeenCalledWith(value);
        });
    });
    test("onFilled() should NOT be called when the input is NOT filled", () => {
        const value = "12345";
        const mockOnFilled = jest.fn();
        const { result } = renderUseOtInput({ onFilled: mockOnFilled });
        result.current.actions.handleTextChange(value);
        (0, react_native_1.act)(() => {
            expect(mockOnFilled).not.toHaveBeenCalled();
        });
    });
});
