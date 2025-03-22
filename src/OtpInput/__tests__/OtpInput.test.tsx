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
