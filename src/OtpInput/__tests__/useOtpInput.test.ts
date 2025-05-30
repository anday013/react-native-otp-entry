import { act, renderHook } from "@testing-library/react-native";
import * as React from "react";
import { Keyboard } from "react-native";
import { OtpInputProps } from "../OtpInput.types";
import { useOtpInput } from "../useOtpInput";

const renderUseOtInput = (props?: Partial<OtpInputProps>) =>
  renderHook(() => useOtpInput({ numberOfDigits: 6, ...props }));

describe("useOtpInput", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
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

  test("blur() should blur input", () => {
    jest.spyOn(React, "useRef").mockReturnValueOnce({ current: { blur: jest.fn() } } as any);

    const { result } = renderUseOtInput();
    result.current.actions.blur();

    act(() => {
      expect(result.current.models.inputRef.current?.blur).toHaveBeenCalled();
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

  test("handleTextChange() should call setText() and onTextChange() with value when type is alpha and value has only letters", () => {
    const value = "abcdef";
    const mockOnTextChange = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "alpha" });
    result.current.actions.handleTextChange(value);

    act(() => {
      expect(result.current.forms.setText).toHaveBeenCalledWith(value);
      expect(mockOnTextChange).toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should call setText() and onTextChange() with value when type is numeric and value has only numbers", () => {
    const value = "123456";
    const mockOnTextChange = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "numeric" });
    result.current.actions.handleTextChange(value);

    act(() => {
      expect(result.current.forms.setText).toHaveBeenCalledWith(value);
      expect(mockOnTextChange).toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should call setText() and onTextChange() with value when type is alphanumeric and value has letters and numbers", () => {
    const value = "abc123";
    const mockOnTextChange = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "alphanumeric" });
    result.current.actions.handleTextChange(value);

    act(() => {
      expect(result.current.forms.setText).toHaveBeenCalledWith(value);
      expect(mockOnTextChange).toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should NOT call setText() and onTextChange() with value when type is alpha and value has numbers", () => {
    const value = "abc123";
    const mockOnTextChange = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "alpha" });
    result.current.actions.handleTextChange(value);

    act(() => {
      expect(result.current.forms.setText).not.toHaveBeenCalledWith(value);
      expect(mockOnTextChange).not.toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should NOT call setText() and onTextChange() with value when type is numeric and value has letters", () => {
    const value = "abc123";
    const mockOnTextChange = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "numeric" });
    result.current.actions.handleTextChange(value);

    act(() => {
      expect(result.current.forms.setText).not.toHaveBeenCalledWith(value);
      expect(mockOnTextChange).not.toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should NOT call setText() and onTextChange() with value when type is alphanumeric and value has special characters", () => {
    const value = "a1/*-+";
    const mockOnTextChange = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "alphanumeric" });
    result.current.actions.handleTextChange(value);

    act(() => {
      expect(result.current.forms.setText).not.toHaveBeenCalledWith(value);
      expect(mockOnTextChange).not.toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should not proceed if the input is disabled", () => {
    const value = "123456";
    const mockOnTextChange = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => ["", jest.fn()]);

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, disabled: true });
    result.current.actions.handleTextChange(value);

    act(() => {
      expect(result.current.forms.setText).not.toHaveBeenCalled();
      expect(mockOnTextChange).not.toHaveBeenCalled();
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

  test("handleFocus() should set hasCurrentFocus to true", () => {
    const mockSetState = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => [false, mockSetState]);
    const { result } = renderUseOtInput();
    result.current.actions.handleFocus();

    act(() => {
      expect(mockSetState).toHaveBeenCalledWith(true);
    });
  });

  test("handleBlur() should set hasCurrentFocus to false", () => {
    const mockSetState = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => [true, mockSetState]);
    const { result } = renderUseOtInput();
    result.current.actions.handleBlur();

    act(() => {
      expect(mockSetState).toHaveBeenCalledWith(false);
    });
  });

  test("handleFocus() should run user provided callback", () => {
    const mockOnFocus = jest.fn();

    const { result } = renderUseOtInput({
      onFocus: mockOnFocus,
    });
    result.current.actions.handleFocus();

    act(() => {
      expect(mockOnFocus).toBeCalled();
    });
  });

  test("handleBlur() should run user provided callback", () => {
    const mockOnBlur = jest.fn();

    const { result } = renderUseOtInput({
      onBlur: mockOnBlur,
    });
    result.current.actions.handleBlur();

    act(() => {
      expect(mockOnBlur).toBeCalled();
    });
  });

  test("should blur the input when filled if blurOnFilled is 'true'", () => {
    jest.spyOn(React, "useRef").mockReturnValue({ current: { blur: jest.fn() } } as any);

    const { result } = renderUseOtInput({ blurOnFilled: true });
    result.current.actions.handleTextChange("123456");

    act(() => {
      expect(result.current.models.inputRef.current?.blur).toHaveBeenCalled();
    });
  });

  test("should NOT blur the input when filled if blurOnFilled is 'true'", () => {
    jest.spyOn(React, "useRef").mockReturnValue({ current: { blur: jest.fn() } } as any);

    const { result } = renderUseOtInput();
    result.current.actions.handleTextChange("123456");

    act(() => {
      expect(result.current.models.inputRef.current?.blur).not.toHaveBeenCalled();
    });
  });

  describe("Placeholder", () => {
    test("should be populated to numberOfDigits if has only single char", () => {
      const { result } = renderUseOtInput({ placeholder: "2", numberOfDigits: 5 });
      expect(result.current.models.placeholder).toBe("22222");
    });

    test("should not be populated if more than one", () => {
      const { result } = renderUseOtInput({ placeholder: "22", numberOfDigits: 3 });
      expect(result.current.models.placeholder).toBe("22");
    });
  });
});
