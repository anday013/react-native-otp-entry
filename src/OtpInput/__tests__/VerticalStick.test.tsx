import { render, screen } from "@testing-library/react-native";
import * as React from "react";
import { Animated } from "react-native";
import { VerticalStick } from "../VerticalStick";

describe("VerticalStick", () => {
  afterEach(() => jest.restoreAllMocks());

  test("should keep both blink animations out of the interaction queue", () => {
    const timing = jest.spyOn(Animated, "timing");
    render(<VerticalStick focusStickBlinkingDuration={500} />);

    expect(timing).toHaveBeenCalledTimes(2);
    [0, 1].forEach((toValue) => {
      expect(timing).toHaveBeenCalledWith(
        expect.any(Animated.Value),
        expect.objectContaining({
          toValue,
          duration: 500,
          useNativeDriver: true,
          isInteraction: false,
        })
      );
    });
  });

  test("should stop the previous loop on duration changes and stop on unmount", () => {
    const firstLoop = { start: jest.fn(), stop: jest.fn(), reset: jest.fn() };
    const secondLoop = { start: jest.fn(), stop: jest.fn(), reset: jest.fn() };
    const loop = jest
      .spyOn(Animated, "loop")
      .mockReturnValueOnce(firstLoop)
      .mockReturnValueOnce(secondLoop);
    const timing = jest.spyOn(Animated, "timing");
    const { rerender, unmount } = render(<VerticalStick focusStickBlinkingDuration={350} />);
    expect(firstLoop.start).toHaveBeenCalledTimes(1);

    rerender(<VerticalStick focusStickBlinkingDuration={350} focusColor="red" />);
    expect(loop).toHaveBeenCalledTimes(1);
    expect(firstLoop.stop).not.toHaveBeenCalled();

    rerender(<VerticalStick focusStickBlinkingDuration={700} />);
    expect(firstLoop.stop).toHaveBeenCalledTimes(1);
    expect(secondLoop.start).toHaveBeenCalledTimes(1);
    expect(timing).toHaveBeenLastCalledWith(
      expect.any(Animated.Value),
      expect.objectContaining({ duration: 700 })
    );

    unmount();
    expect(secondLoop.stop).toHaveBeenCalledTimes(1);
  });

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
