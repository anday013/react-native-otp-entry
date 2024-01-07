import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";
import { OtpInput } from "./OtpInput";
import { OtpInputProps, OtpInputRef } from "./OtpInput.types";

const renderOtpInput = (props?: Partial<OtpInputProps>) =>
  render(<OtpInput numberOfDigits={6} {...props} />);

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

    test('should not show values if "secureTextEntry" is true', () => {
      renderOtpInput({ secureTextEntry: true });

      const input = screen.getByTestId("otp-input-hidden");
      fireEvent.changeText(input, "123456");
      const inputs = screen.getAllByTestId("otp-input");

      inputs.forEach((input) => {
        expect(input).toHaveTextContent("•");
      });
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

    test("focusColor should not be overridden by theme", () => {
      renderOtpInput({
        focusColor: "#000",
        theme: { pinCodeContainerStyle: { borderColor: "#fff" } },
      });

      const inputs = screen.getAllByTestId("otp-input");

      expect(inputs[0]).toHaveStyle({ borderColor: "#000" });
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
});
