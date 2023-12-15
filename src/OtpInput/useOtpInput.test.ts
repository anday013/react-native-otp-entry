import { act, renderHook } from "@testing-library/react-native";
import * as React from "react";
import { Keyboard } from "react-native";
import { OtpInputProps } from "./OtpInput.types";
import { useOtpInput } from "./useOtpInput";

const renderUseOtInput = (props?: Partial<OtpInputProps>) =>
  renderHook(() => useOtpInput({ numberOfDigits: 6, ...props }));

describe("useOtpInput", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return models as defined", () => {
    const {
      result: {
        current: {
          models: { text, focusedInputIndex, inputRef },
        },
      },
    } = renderUseOtInput();

    expect(text).toBe("");
    expect(focusedInputIndex).toBe(0);
    expect(inputRef.current).toBeNull();
  });

  test("clear() should clear text", () => {
    jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);
    const { result } = renderUseOtInput();
    result.current.actions.clear();

    act(() => {
      expect(result.current.forms.setText).toHaveBeenCalledWith("");
    });
  });

  test("focus() should focus on input", () => {
    jest.spyOn(React, "useRef").mockReturnValue({ current: { focus: jest.fn() } } as any);

    const { result } = renderUseOtInput();
    result.current.actions.focus();

    act(() => {
      expect(result.current.models.inputRef.current?.focus).toHaveBeenCalled();
    });
  });

  test("setTextWithRef() should only call setText the first 'numberOfDigits' characters", () => {
    jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);
    const { result } = renderUseOtInput();
    result.current.forms.setTextWithRef("123456789");

    act(() => {
      expect(result.current.forms.setText).toHaveBeenCalledWith("123456");
    });
  });

  test("handlePress() should dismiss Keyboard if it's visible", () => {
    jest.spyOn(Keyboard, "dismiss");
    jest.spyOn(Keyboard, "isVisible").mockReturnValue(false);

    const { result } = renderUseOtInput();

    result.current.actions.handlePress();

    act(() => {
      expect(Keyboard.dismiss).toHaveBeenCalled();
    });
  });

  test("handlePress() should NOT dismiss Keyboard if it's NOT visible", () => {
    jest.spyOn(Keyboard, "dismiss");
    jest.spyOn(Keyboard, "isVisible").mockReturnValue(true);

    const { result } = renderUseOtInput();
    result.current.actions.handlePress();

    act(() => {
      expect(Keyboard.dismiss).not.toHaveBeenCalled();
    });
  });

  test("handlePress() should focus on input", () => {
    jest.spyOn(React, "useRef").mockReturnValue({ current: { focus: jest.fn() } } as any);

    const { result } = renderUseOtInput();
    result.current.actions.handlePress();

    act(() => {
      expect(result.current.models.inputRef.current?.focus).toHaveBeenCalled();
    });
  });

  test("handleTextChange() should call setText() and onTextChange() with value", () => {
    const value = "123456";
    const mockOnTextChange = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange });
    result.current.actions.handleTextChange(value);

    act(() => {
      expect(result.current.forms.setText).toHaveBeenCalledWith(value);
      expect(mockOnTextChange).toHaveBeenCalledWith(value);
    });
  });

  test("onFilled() should be called when the input filled", () => {
    const value = "123456";
    const mockOnFilled = jest.fn();
    const { result } = renderUseOtInput({ onFilled: mockOnFilled });
    result.current.actions.handleTextChange(value);

    act(() => {
      expect(mockOnFilled).toHaveBeenCalledWith(value);
    });
  });

  test("onFilled() should NOT be called when the input is NOT filled", () => {
    const value = "12345";
    const mockOnFilled = jest.fn();
    const { result } = renderUseOtInput({ onFilled: mockOnFilled });
    result.current.actions.handleTextChange(value);

    act(() => {
      expect(mockOnFilled).not.toHaveBeenCalled();
    });
  });
});
