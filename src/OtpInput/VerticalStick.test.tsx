import { render, screen } from "@testing-library/react-native";
import { VerticalStick } from "./VerticalStick";

describe("VerticalStick", () => {
  test("should set focusColor when passed", () => {
    render(<VerticalStick focusColor="red" />);

    const stick = screen.getByTestId("otp-input-stick");

    expect(stick).toHaveStyle({ backgroundColor: "red" });
  });

  test("should set focusColor to 'green' if not passed", () => {
    render(<VerticalStick />);

    const stick = screen.getByTestId("otp-input-stick");

    expect(stick).toHaveStyle({ backgroundColor: "green" });
  });
});
