import { act, renderHook } from "@testing-library/react-native";
import { Keyboard } from "react-native";
import { OtpInputProps } from "../OtpInput.types";
import { useOtpInput } from "../useOtpInput";

const renderUseOtInput = (props?: Partial<OtpInputProps>) =>
  renderHook(() => useOtpInput({ numberOfDigits: 6, ...props }));

describe("useOtpInput", () => {
  afterEach(() => {
    jest.restoreAllMocks();
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
    const { result } = renderUseOtInput();
    act(() => result.current.forms.setTextWithRef("123"));
    act(() => result.current.actions.clear());

    act(() => {
      expect(result.current.models.text).toBe("");
    });
  });

  test("focus() should focus on input", () => {
    const { result } = renderUseOtInput();
    Object.assign(result.current.models.inputRef, { current: { focus: jest.fn() } });
    act(() => result.current.actions.focus());

    act(() => {
      expect(result.current.models.inputRef.current?.focus).toHaveBeenCalled();
    });
  });

  test("blur() should blur input", () => {
    const { result } = renderUseOtInput();
    Object.assign(result.current.models.inputRef, { current: { blur: jest.fn() } });
    act(() => result.current.actions.blur());

    act(() => {
      expect(result.current.models.inputRef.current?.blur).toHaveBeenCalled();
    });
  });

  test("setTextWithRef() should only call setText the first 'numberOfDigits' characters", () => {
    const { result } = renderUseOtInput();
    act(() => result.current.forms.setTextWithRef("123456789"));

    act(() => {
      expect(result.current.models.text).toBe("123456");
    });
  });

  test("handlePress() should dismiss Keyboard if it's not visible", () => {
    jest.spyOn(Keyboard, "dismiss");
    jest.spyOn(Keyboard, "isVisible").mockReturnValue(false);

    const { result } = renderUseOtInput();

    act(() => result.current.actions.handlePress());

    act(() => {
      expect(Keyboard.dismiss).toHaveBeenCalled();
    });
  });

  test("handlePress() should NOT dismiss Keyboard if it's visible", () => {
    jest.spyOn(Keyboard, "dismiss");
    jest.spyOn(Keyboard, "isVisible").mockReturnValue(true);

    const { result } = renderUseOtInput();
    act(() => result.current.actions.handlePress());

    act(() => {
      expect(Keyboard.dismiss).not.toHaveBeenCalled();
    });
  });

  test("handlePress() should focus on input", () => {
    const { result } = renderUseOtInput();
    Object.assign(result.current.models.inputRef, { current: { focus: jest.fn() } });
    act(() => result.current.actions.handlePress());

    act(() => {
      expect(result.current.models.inputRef.current?.focus).toHaveBeenCalled();
    });
  });

  test("handleTextChange() should call setText() and onTextChange() with value", () => {
    const value = "123456";
    const mockOnTextChange = jest.fn();

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange });
    act(() => result.current.actions.handleTextChange(value));

    act(() => {
      expect(result.current.models.text).toBe(value);
      expect(mockOnTextChange).toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should call setText() and onTextChange() with value when type is alpha and value has only letters", () => {
    const value = "abcdef";
    const mockOnTextChange = jest.fn();

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "alpha" });
    act(() => result.current.actions.handleTextChange(value));

    act(() => {
      expect(result.current.models.text).toBe(value);
      expect(mockOnTextChange).toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should call setText() and onTextChange() with value when type is numeric and value has only numbers", () => {
    const value = "123456";
    const mockOnTextChange = jest.fn();

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "numeric" });
    act(() => result.current.actions.handleTextChange(value));

    act(() => {
      expect(result.current.models.text).toBe(value);
      expect(mockOnTextChange).toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should call setText() and onTextChange() with value when type is alphanumeric and value has letters and numbers", () => {
    const value = "abc123";
    const mockOnTextChange = jest.fn();

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "alphanumeric" });
    act(() => result.current.actions.handleTextChange(value));

    act(() => {
      expect(result.current.models.text).toBe(value);
      expect(mockOnTextChange).toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should NOT call setText() and onTextChange() with value when type is alpha and value has numbers", () => {
    const value = "abc123";
    const mockOnTextChange = jest.fn();

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "alpha" });
    act(() => result.current.actions.handleTextChange(value));

    act(() => {
      expect(result.current.models.text).not.toBe(value);
      expect(mockOnTextChange).not.toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should NOT call setText() and onTextChange() with value when type is numeric and value has letters", () => {
    const value = "abc123";
    const mockOnTextChange = jest.fn();

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "numeric" });
    act(() => result.current.actions.handleTextChange(value));

    act(() => {
      expect(result.current.models.text).not.toBe(value);
      expect(mockOnTextChange).not.toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should NOT call setText() and onTextChange() with value when type is alphanumeric and value has special characters", () => {
    const value = "a1/*-+";
    const mockOnTextChange = jest.fn();

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, type: "alphanumeric" });
    act(() => result.current.actions.handleTextChange(value));

    act(() => {
      expect(result.current.models.text).not.toBe(value);
      expect(mockOnTextChange).not.toHaveBeenCalledWith(value);
    });
  });

  test("handleTextChange() should not proceed if the input is disabled", () => {
    const value = "123456";
    const mockOnTextChange = jest.fn();

    const { result } = renderUseOtInput({ onTextChange: mockOnTextChange, disabled: true });
    act(() => result.current.actions.handleTextChange(value));

    act(() => {
      expect(result.current.models.text).toBe("");
      expect(mockOnTextChange).not.toHaveBeenCalled();
    });
  });

  test("onFilled() should be called when the input filled", () => {
    const value = "123456";
    const mockOnFilled = jest.fn();
    const { result } = renderUseOtInput({ onFilled: mockOnFilled });
    act(() => result.current.actions.handleTextChange(value));

    act(() => {
      expect(mockOnFilled).toHaveBeenCalledWith(value);
    });
  });

  test("onFilled() should NOT be called when the input is NOT filled", () => {
    const value = "12345";
    const mockOnFilled = jest.fn();
    const { result } = renderUseOtInput({ onFilled: mockOnFilled });
    act(() => result.current.actions.handleTextChange(value));

    act(() => {
      expect(mockOnFilled).not.toHaveBeenCalled();
    });
  });

  test("handleFocus() should set hasCurrentFocus to true", () => {
    const { result } = renderUseOtInput({ autoFocus: false });
    act(() => result.current.actions.handleFocus());

    act(() => {
      expect(result.current.models.isFocused).toBe(true);
    });
  });

  test("handleBlur() should set hasCurrentFocus to false", () => {
    const { result } = renderUseOtInput();
    act(() => result.current.actions.handleBlur());

    act(() => {
      expect(result.current.models.isFocused).toBe(false);
    });
  });

  test("handleFocus() should run user provided callback", () => {
    const mockOnFocus = jest.fn();

    const { result } = renderUseOtInput({
      onFocus: mockOnFocus,
    });
    act(() => result.current.actions.handleFocus());

    act(() => {
      expect(mockOnFocus).toBeCalled();
    });
  });

  test("handleBlur() should run user provided callback", () => {
    const mockOnBlur = jest.fn();

    const { result } = renderUseOtInput({
      onBlur: mockOnBlur,
    });
    act(() => result.current.actions.handleBlur());

    act(() => {
      expect(mockOnBlur).toBeCalled();
    });
  });

  test("should blur the input when filled if blurOnFilled is 'true'", () => {
    const { result } = renderUseOtInput({ blurOnFilled: true });
    Object.assign(result.current.models.inputRef, { current: { blur: jest.fn() } });
    act(() => result.current.actions.handleTextChange("123456"));

    act(() => {
      expect(result.current.models.inputRef.current?.blur).toHaveBeenCalled();
    });
  });

  test("should NOT blur the input when blurOnFilled is omitted", () => {
    const { result } = renderUseOtInput();
    Object.assign(result.current.models.inputRef, { current: { blur: jest.fn() } });
    act(() => result.current.actions.handleTextChange("123456"));

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
