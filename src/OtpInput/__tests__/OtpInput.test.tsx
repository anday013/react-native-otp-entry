import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as React from "react";
import { Platform, TextInput } from "react-native";
import { OtpInput } from "../OtpInput";
import { OtpInputProps, OtpInputRef } from "../OtpInput.types";

const renderOtpInput = (props?: Partial<OtpInputProps>) => render(<OtpInput {...props} />);
const renderOtpInputWithExtraInput = (props?: Partial<OtpInputProps>) =>
  render(
    <>
      <OtpInput {...props} />
      <TextInput testID="other-input" />
    </>
  );

describe("OtpInput", () => {
  describe("UI", () => {
    test("should render correctly", () => {
      const tree = renderOtpInput().toJSON();

      expect(tree).toMatchSnapshot();
    });

    test("should render stick if hideStick is false", () => {
      renderOtpInput({ hideStick: false });

      const stick = screen.getByTestId("otp-input-stick");

      expect(stick).toBeTruthy();
    });

    test('should not render stick if "hideStick" is true', () => {
      renderOtpInput({ hideStick: true });

      const stick = screen.queryByTestId("otp-input-stick");

      expect(stick).toBeFalsy();
    });

    test('should not show values if "secureTextEntry" is true', () => {
      renderOtpInput({ secureTextEntry: true });

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123456");
      const inputs = screen.getAllByTestId("otp-input");

      inputs.forEach((input) => {
        expect(input).toHaveTextContent("•");
      });
    });

    test("should have 6 inputs by default", () => {
      renderOtpInput();

      const inputs = screen.getAllByTestId("otp-input");

      expect(inputs).toHaveLength(6);
    });

    test("should autoFocused by default", () => {
      renderOtpInput();

      const input = screen.getByTestId("otp-input-hidden");

      expect(input.props.autoFocus).toBe(true);
    });

    test('should not focus if "autoFocus" is false', () => {
      renderOtpInput({ autoFocus: false });

      const input = screen.getByTestId("otp-input-hidden");

      expect(input.props.autoFocus).toBe(false);
    });

    test("should keep hidden input absolutely positioned to avoid affecting OTP cell spacing", () => {
      renderOtpInput();

      const input = screen.getByTestId("otp-input-hidden");

      expect(input).toHaveStyle({
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      });
    });

    test("should not focus if disabled is true", () => {
      renderOtpInput({
        disabled: true,
        focusColor: "#444",
      });

      const inputs = screen.getAllByTestId("otp-input");

      expect(inputs[0]).not.toHaveStyle({ borderColor: "#444" });
    });

    test("it should not allow input if disabled is true", () => {
      renderOtpInput({ disabled: true });

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123456");

      const inputs = screen.getAllByTestId("otp-input");
      expect(inputs[0]).not.toHaveTextContent("1");
      inputs.forEach((i) => expect(i).toBeDisabled());

      const hiddenInput = screen.getByTestId("otp-input-hidden");
      expect(hiddenInput).toBeDisabled();
    });

    test("focusColor should not be overridden by theme", () => {
      renderOtpInput({
        focusColor: "#000",
        theme: { pinCodeContainerStyle: { borderColor: "#fff" } },
      });

      const inputs = screen.getAllByTestId("otp-input");

      expect(inputs[0]).toHaveStyle({ borderColor: "#000" });
    });

    test("should set focusColor to border of the last input if all inputs are filled and input is still focused", () => {
      renderOtpInput({ focusColor: "red", numberOfDigits: 6 });

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123456");

      const inputs = screen.getAllByTestId("otp-input");
      expect(inputs[5]).toHaveStyle({ borderColor: "red" });
    });

    test("focusedPinCodeContainerStyle should not be overridden by theme", () => {
      renderOtpInput({
        focusColor: "#000",
        theme: { focusedPinCodeContainerStyle: { borderColor: "#fff", backgroundColor: "green" } },
      });
      const inputs = screen.getAllByTestId("otp-input");
      expect(inputs[0]).toHaveStyle({ borderColor: "#fff", backgroundColor: "green" });
    });

    // Test if the number of rendered inputs is equal to the number of digits
    test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
      "should render the correct number of inputs: %i",
      (numberOfDigits) => {
        renderOtpInput({ numberOfDigits: numberOfDigits });

        const inputs = screen.getAllByTestId("otp-input");

        expect(inputs).toHaveLength(numberOfDigits);
      }
    );

    test("filledPinCodeContainerStyle should allow for new style when digit is present", () => {
      renderOtpInput({
        theme: { filledPinCodeContainerStyle: { borderBottomColor: "red" } },
      });

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "12");

      const inputs = screen.getAllByTestId("otp-input");
      expect(inputs[0]).toHaveStyle({ borderBottomColor: "red" });
      expect(inputs[1]).toHaveStyle({ borderBottomColor: "red" });
      expect(inputs[2]).not.toHaveStyle({ borderBottomColor: "red" });
    });

    test("disabledPinCodeContainerStyle should allow for new style when input is disabled", () => {
      renderOtpInput({
        disabled: true,
        theme: { disabledPinCodeContainerStyle: { borderBottomColor: "red" } },
      });

      const inputs = screen.getAllByTestId("otp-input");
      expect(inputs[0]).toHaveStyle({ borderBottomColor: "red" });
    });

    test.each(["-", "------", "--"])(
      "should apply filled styles only to entered digits with placeholder %s",
      (placeholder) => {
        const ref = React.createRef<OtpInputRef>();
        render(
          <OtpInput
            ref={ref}
            placeholder={placeholder}
            hideStick
            theme={{
              pinCodeContainerStyle: { backgroundColor: "grey" },
              filledPinCodeContainerStyle: { backgroundColor: "white" },
            }}
          />
        );
        const input = screen.getByTestId("otp-input-hidden");
        screen.getAllByTestId("otp-input").forEach((cell) => {
          expect(cell).toHaveStyle({ backgroundColor: "grey" });
        });

        fireEvent.changeText(input, "12");
        screen.getAllByTestId("otp-input").forEach((cell, index) => {
          expect(cell).toHaveStyle({ backgroundColor: index < 2 ? "white" : "grey" });
        });

        fireEvent.changeText(input, "1");
        expect(screen.getAllByTestId("otp-input")[1]).toHaveStyle({ backgroundColor: "grey" });

        act(() => ref.current?.clear());
        screen.getAllByTestId("otp-input").forEach((cell) => {
          expect(cell).toHaveStyle({ backgroundColor: "grey" });
        });
      }
    );

    test("should use input identifiers to distinguish cells across OTP instances", () => {
      render(
        <>
          <OtpInput
            numberOfDigits={2}
            autoFocus={false}
            textInputProps={{ testID: "first-code", nativeID: "first-code-native" }}
            textProps={{ testID: "first-digit", accessibilityLabel: "First code digit" }}
          />
          <OtpInput
            numberOfDigits={2}
            autoFocus={false}
            textInputProps={{ testID: "second-code", nativeID: "second-code-native" }}
          />
        </>
      );

      ["first", "second"].forEach((prefix) => {
        const input = screen.getByTestId(`${prefix}-code`);
        expect(input.props.nativeID).toBe(`${prefix}-code-native`);
        [0, 1].forEach((index) => {
          const cell = screen.getByTestId(`${prefix}-code-${index}`);
          expect(cell.props.nativeID).toBe(`${prefix}-code-native-${index}`);
        });
        fireEvent.changeText(input, "12");
        expect(screen.getByTestId(`${prefix}-code-0`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${prefix}-code-1`)).toHaveTextContent("2");
      });
      expect(screen.getByTestId("first-digit-0").props.accessibilityLabel).toBe("First code digit");
    });

    test("should pass textProps to Text component", () => {
      renderOtpInput({
        numberOfDigits: 3,
        textProps: {
          testID: "custom-text-id",
          numberOfLines: 1,
          accessibilityLabel: "OTP digit",
          allowFontScaling: false,
        },
      });

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123");

      ["1", "2", "3"].forEach((digit, index) => {
        const digitElement = screen.getByTestId(`custom-text-id-${index}`);
        expect(digitElement).toBeTruthy();
        expect(digitElement.props.numberOfLines).toBe(1);
        expect(digitElement.props.accessibilityLabel).toBe("OTP digit");
        expect(digitElement.props.allowFontScaling).toBe(false);
        expect(digitElement).toHaveTextContent(digit);
      });
    });

    test("should correctly merge textProps with theme styles", () => {
      renderOtpInput({
        numberOfDigits: 2,
        textProps: {
          testID: "custom-styled-text",
          style: { fontWeight: "bold" },
        },
        theme: {
          pinCodeTextStyle: { fontSize: 20, color: "blue" },
        },
      });

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "12");
      const textElement = screen.getByTestId("custom-styled-text-0");
      // Check that our custom style from textProps.style is applied
      const styles = textElement.props.style;
      const customStyleApplied = styles.some((style: any) => style.fontWeight === "bold");
      expect(customStyleApplied).toBe(true);
      // Check that theme styles are also applied
      const themeStyleApplied = styles.some(
        (style: any) => style.fontSize === 20 && style.color === "blue"
      );
      expect(themeStyleApplied).toBe(true);
    });

    test('autoComplete should be set "sms-otp" on Android', () => {
      Platform.OS = "android";
      renderOtpInput();

      const input = screen.getByTestId("otp-input-hidden");

      expect(input.props.autoComplete).toBe("sms-otp");
    });

    test('autoComplete should be set "one-time-code" on iOS', () => {
      Platform.OS = "ios";
      renderOtpInput();

      const input = screen.getByTestId("otp-input-hidden");

      expect(input.props.autoComplete).toBe("one-time-code");
    });

    test('inputMode should be set "numeric" if type is "numeric"', () => {
      renderOtpInput({ type: "numeric" });

      const input = screen.getByTestId("otp-input-hidden");

      expect(input.props.inputMode).toBe("numeric");
    });

    test.each(["alpha", "alphanumeric"])(
      'inputMode should be set "text" if type is "%s"',
      (type: any) => {
        renderOtpInput({ type });

        const input = screen.getByTestId("otp-input-hidden");

        expect(input.props.inputMode).toBe("text");
      }
    );

    describe("caretHidden", () => {
      test("should be true on iOS", () => {
        Platform.OS = "ios";
        renderOtpInput();

        const input = screen.getByTestId("otp-input-hidden");

        expect(input.props.caretHidden).toBe(true);
      });

      test("should be false on android", () => {
        Platform.OS = "android";
        renderOtpInput();

        const input = screen.getByTestId("otp-input-hidden");

        expect(input.props.caretHidden).toBe(false);
      });

      test("should be false on web", () => {
        Platform.OS = "web";
        renderOtpInput();

        const input = screen.getByTestId("otp-input-hidden");

        expect(input.props.caretHidden).toBe(false);
      });
    });
  });
  describe("Logic", () => {
    test("should split text on screen from the text written in the hidden input", () => {
      const otp = "123456";
      renderOtpInput();

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, otp);

      act(() => {
        expect(screen.getByText("1")).toBeTruthy();
        expect(screen.getByText("2")).toBeTruthy();
        expect(screen.getByText("3")).toBeTruthy();
        expect(screen.getByText("4")).toBeTruthy();
        expect(screen.getByText("5")).toBeTruthy();
        expect(screen.getByText("6")).toBeTruthy();
        expect(screen.queryByText(otp)).not.toBeTruthy();
      });
    });

    test("ref clear() should clear input", () => {
      const ref = React.createRef<OtpInputRef>();

      render(<OtpInput ref={ref} numberOfDigits={6} />);
      const otp = "1";

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, otp);

      act(() => {
        ref.current?.clear();
      });
      expect(screen.queryByText("1")).toBeFalsy();
    });

    test("ref setValue() should set input value", () => {
      const ref = React.createRef<OtpInputRef>();

      render(<OtpInput ref={ref} numberOfDigits={6} />);
      const otp = "1";

      act(() => {
        ref.current?.setValue(otp);
      });
      expect(screen.getByText("1")).toBeTruthy();
    });

    test('ref setValue() should set only the first "numberOfDigits" characters', () => {
      const ref = React.createRef<OtpInputRef>();

      render(<OtpInput ref={ref} numberOfDigits={4} />);
      const otp = "123456";

      act(() => {
        ref.current?.setValue(otp);
      });
      expect(screen.getByText("1")).toBeTruthy();
      expect(screen.getByText("2")).toBeTruthy();
      expect(screen.getByText("3")).toBeTruthy();
      expect(screen.getByText("4")).toBeTruthy();
      expect(screen.queryByText("5")).toBeFalsy();
      expect(screen.queryByText("6")).toBeFalsy();
    });
  });
  describe("Digit editing and paste selection", () => {
    test.each([false, true])(
      "should replace a selected middle digit (secure=%s)",
      (secureTextEntry) => {
        const onTextChange = jest.fn();
        const onFilled = jest.fn();
        renderOtpInput({ secureTextEntry, onTextChange, onFilled, focusColor: "red" });
        const input = screen.getByTestId("otp-input-hidden");
        fireEvent.changeText(input, "123456");
        fireEvent.press(screen.getAllByTestId("otp-input")[1]);

        expect(input.props.selection).toEqual({ start: 1, end: 2 });
        expect(screen.getAllByTestId("otp-input")[1]).toHaveStyle({ borderColor: "red" });
        expect(screen.getAllByTestId("otp-input")[5]).not.toHaveStyle({ borderColor: "red" });
        expect(screen.getAllByTestId("otp-input")[1]).toHaveTextContent(
          secureTextEntry ? "•" : "2"
        );

        fireEvent.changeText(input, "193456");
        expect(input.props.value).toBe("193456");
        expect(input.props.selection).toEqual({ start: 2, end: 2 });
        expect(onTextChange).toHaveBeenLastCalledWith("193456");
        expect(onFilled).toHaveBeenLastCalledWith("193456");
      }
    );

    test("should position empty-cell taps at the end without creating holes", () => {
      renderOtpInput();
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "12");
      fireEvent.press(screen.getAllByTestId("otp-input")[5]);
      expect(input.props.selection).toEqual({ start: 2, end: 2 });
      fireEvent.changeText(input, "123");
      expect(input.props.value).toBe("123");
      expect(input.props.selection).toEqual({ start: 3, end: 3 });
    });

    test.each(["before", "after"])(
      "should delete all digits after a partial paste with a stale selection event %s text change",
      (eventOrder) => {
        const onTextChange = jest.fn();
        renderOtpInput({ onTextChange });
        const input = screen.getByTestId("otp-input-hidden");
        fireEvent.changeText(input, "123");
        const staleEvent = { nativeEvent: { selection: { start: 3, end: 3 } } };
        if (eventOrder === "before") fireEvent(input, "selectionChange", staleEvent);
        // Native maxLength clips the pasted "987654" to the remaining three slots.
        fireEvent.changeText(input, "123987");
        if (eventOrder === "after") fireEvent(input, "selectionChange", staleEvent);
        expect(input.props.selection).toEqual({ start: 6, end: 6 });

        // Emulate native Backspace using the selection actually passed to TextInput.
        for (let remaining = 5; remaining >= 0; remaining--) {
          const { value, selection } = input.props;
          fireEvent.changeText(
            input,
            value.slice(0, selection.start - 1) + value.slice(selection.end)
          );
          expect(input.props.value).toBe("123987".slice(0, remaining));
          expect(input.props.selection).toEqual({ start: remaining, end: remaining });
        }
        expect(onTextChange).toHaveBeenLastCalledWith("");
      }
    );

    test("should delete a selected middle digit and handle repeated digits", () => {
      renderOtpInput();
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "111111");
      fireEvent.press(screen.getAllByTestId("otp-input")[2]);
      fireEvent.changeText(input, "11111");
      expect(input.props.selection).toEqual({ start: 2, end: 2 });
      fireEvent.changeText(input, "1111");
      expect(input.props.selection).toEqual({ start: 1, end: 1 });
    });

    test("should preserve the suffix when pasting into a selected digit", () => {
      renderOtpInput();
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "1234");
      fireEvent.press(screen.getAllByTestId("otp-input")[1]);
      fireEvent.changeText(input, "198734");
      expect(input.props.value).toBe("198734");
      expect(input.props.selection).toEqual({ start: 4, end: 4 });
    });

    test("should map native overlay taps using measured cell bounds, including RTL layouts", () => {
      const onPressIn = jest.fn();
      const onPressOut = jest.fn();
      const onLayout = jest.fn();
      renderOtpInput({ textInputProps: { onPressIn, onPressOut, onLayout } });
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123456");
      screen.getAllByTestId("otp-input").forEach((cell, index) => {
        fireEvent(cell, "layout", {
          nativeEvent: {
            layout: { x: (5 - index) * 50, y: 10, width: 40, height: 60 },
          },
        });
      });
      fireEvent(input, "layout", {
        nativeEvent: { layout: { x: 5, y: 5, width: 300, height: 80 } },
      });
      fireEvent(input, "pressIn", { nativeEvent: { timestamp: 1000 } });
      fireEvent(input, "pressOut", {
        nativeEvent: { timestamp: 1100, locationX: 210, locationY: 20 },
      });
      expect(input.props.selection).toEqual({ start: 1, end: 2 });
      expect(onPressIn).toHaveBeenCalledTimes(1);
      expect(onPressOut).toHaveBeenCalledTimes(1);
      expect(onLayout).toHaveBeenCalledTimes(1);

      // A tap in the gap must not select another cell.
      fireEvent(input, "pressIn", { nativeEvent: { timestamp: 2000 } });
      fireEvent(input, "pressOut", {
        nativeEvent: { timestamp: 2100, locationX: 240, locationY: 20 },
      });
      expect(input.props.selection).toEqual({ start: 1, end: 2 });

      // A long press must not replace the native context-menu selection with a cell tap.
      fireEvent(input, "pressIn", { nativeEvent: { timestamp: 3000 } });
      fireEvent(input, "selectionChange", { nativeEvent: { selection: { start: 0, end: 6 } } });
      fireEvent(input, "pressOut", {
        nativeEvent: { timestamp: 3700, locationX: 10, locationY: 20 },
      });
      expect(input.props.selection).toEqual({ start: 0, end: 6 });
      expect(input.props.contextMenuHidden).not.toBe(true);
    });

    test("should retain native selection and additional TextInput callbacks", () => {
      const onChangeText = jest.fn();
      const onSelectionChange = jest.fn();
      renderOtpInput({ textInputProps: { onChangeText, onSelectionChange } });
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "1234");
      fireEvent(input, "selectionChange", { nativeEvent: { selection: { start: 4, end: 4 } } });
      const event = { nativeEvent: { selection: { start: 1, end: 1 } } };
      fireEvent(input, "selectionChange", event);
      expect(input.props.selection).toEqual({ start: 1, end: 1 });
      fireEvent.changeText(input, "1934");
      expect(input.props.value).toBe("1934");
      expect(onChangeText).toHaveBeenLastCalledWith("1934");
      expect(onSelectionChange).toHaveBeenLastCalledWith(event);
    });

    test("should reset the selection for clear and programmatic setValue", () => {
      const ref = React.createRef<OtpInputRef>();
      render(<OtpInput ref={ref} />);
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123456");
      fireEvent.press(screen.getAllByTestId("otp-input")[1]);
      act(() => ref.current?.setValue("987654321"));
      expect(input.props.value).toBe("987654");
      expect(input.props.selection).toEqual({ start: 6, end: 6 });
      act(() => ref.current?.clear());
      expect(input.props.selection).toEqual({ start: 0, end: 0 });
      fireEvent.changeText(input, "1");
      expect(input.props.selection).toEqual({ start: 1, end: 1 });
    });

    test("should reject invalid input without losing the selected digit", () => {
      renderOtpInput({ type: "numeric" });
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123456");
      fireEvent.press(screen.getAllByTestId("otp-input")[1]);
      fireEvent.changeText(input, "1a3456");
      fireEvent(input, "selectionChange", { nativeEvent: { selection: { start: 2, end: 2 } } });
      expect(input.props.value).toBe("123456");
      expect(input.props.selection).toEqual({ start: 1, end: 2 });
    });

    test("should allow moving the caret back after typing one character", () => {
      renderOtpInput();
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123");
      fireEvent.changeText(input, "1234");
      fireEvent(input, "selectionChange", { nativeEvent: { selection: { start: 3, end: 3 } } });
      expect(input.props.selection).toEqual({ start: 3, end: 3 });
    });

    test("should allow an intentional native selection after pasting", () => {
      renderOtpInput();
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123");
      fireEvent.changeText(input, "123987");
      fireEvent(input, "pressIn", { nativeEvent: { timestamp: 1000 } });
      fireEvent(input, "selectionChange", { nativeEvent: { selection: { start: 3, end: 3 } } });
      expect(input.props.selection).toEqual({ start: 3, end: 3 });
    });

    test("should keep an explicitly controlled selection under the caller's control", () => {
      const { rerender } = render(
        <OtpInput textInputProps={{ selection: { start: 0, end: 0 } }} />
      );
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123456");
      rerender(<OtpInput textInputProps={{ selection: { start: 1, end: 2 } }} />);
      fireEvent.changeText(input, "193456");
      expect(input.props.value).toBe("193456");
      expect(input.props.selection).toEqual({ start: 1, end: 2 });
    });

    test("should not edit or select digits when disabled", () => {
      const { rerender } = render(<OtpInput />);
      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123456");
      rerender(<OtpInput disabled />);
      fireEvent.press(screen.getAllByTestId("otp-input")[1]);
      fireEvent.changeText(input, "193456");
      expect(input.props.value).toBe("123456");
      expect(input.props.selection).toEqual({ start: 6, end: 6 });
    });
  });

  describe("Placeholder", () => {
    test("should cover the whole input if placeholder is set with one char", async () => {
      renderOtpInput({ placeholder: "0", hideStick: true });

      const inputs = screen.getAllByTestId("otp-input");
      await Promise.all(
        inputs.map(async (input) => {
          await waitFor(() => expect(input).toHaveTextContent("0"));
        })
      );
    });

    test("should show placeholder if text is empty", async () => {
      renderOtpInput({ placeholder: "000000", hideStick: true });

      const inputs = screen.getAllByTestId("otp-input");
      await Promise.all(
        inputs.map(async (input) => {
          await waitFor(() => expect(input).toHaveTextContent("0"));
        })
      );
    });

    test("should show values for filled part", async () => {
      renderOtpInput({ placeholder: "000000", hideStick: true });
      const otp = "0124";

      const hiddenInput = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(hiddenInput, otp);

      const inputs = screen.getAllByTestId("otp-input");
      await Promise.all(
        inputs.map(async (input, index) => {
          await waitFor(() =>
            expect(input).toHaveTextContent(index < otp.length ? otp[index].toString() : "0")
          );
        })
      );
    });

    test("should hide placeholder if text is not empty", () => {
      renderOtpInput({ placeholder: "000000" });

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123456");

      const placeholder = screen.queryByText("000000");

      expect(placeholder).toBeFalsy();
    });

    test("should hide placeholder if input is focused", () => {
      renderOtpInput({ placeholder: "000000", hideStick: true });

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.press(input);

      const placeholder = screen.queryByText("000000");

      expect(placeholder).toBeFalsy();
    });

    test("should show placeholder if input is blurred and text is empty", async () => {
      renderOtpInputWithExtraInput({ placeholder: "000000", hideStick: true });

      const input = screen.getByTestId("otp-input-hidden");
      const otherInput = screen.getByTestId("other-input");
      fireEvent.press(input);
      fireEvent.changeText(input, "");
      fireEvent.press(otherInput);

      const inputs = screen.getAllByTestId("otp-input");
      await Promise.all(
        inputs.map(async (input) => {
          await waitFor(() => expect(input).toHaveTextContent("0"));
        })
      );
    });

    test("should hide placeholder if input is blurred and text is not empty", () => {
      renderOtpInputWithExtraInput({ placeholder: "000000", hideStick: true });

      const input = screen.getByTestId("otp-input-hidden");
      const otherInput = screen.getByTestId("other-input");
      fireEvent.press(input);
      fireEvent.changeText(input, "123456");
      fireEvent.press(otherInput);

      const placeholder = screen.queryByText("000000");

      expect(placeholder).toBeFalsy();
    });

    test('should leave empty spaces if "placeholder" is shorter than "numberOfDigits"', async () => {
      renderOtpInput({ placeholder: "123", hideStick: true });

      const inputs = screen.getAllByTestId("otp-input");
      expect(inputs[0]).toHaveTextContent("1");
      expect(inputs[1]).toHaveTextContent("2");
      expect(inputs[2]).toHaveTextContent("3");
      expect(inputs[3]).toHaveTextContent("");
      expect(inputs[4]).toHaveTextContent("");
      expect(inputs[5]).toHaveTextContent("");
    });
  });
});
