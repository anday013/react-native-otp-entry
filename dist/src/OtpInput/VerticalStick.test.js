"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const VerticalStick_1 = require("./VerticalStick");
describe("VerticalStick", () => {
    test("should set focusColor when passed", () => {
        (0, react_native_1.render)(<VerticalStick_1.VerticalStick focusColor="red"/>);
        const stick = react_native_1.screen.getByTestId("otp-input-stick");
        expect(stick).toHaveStyle({ backgroundColor: "red" });
    });
    test("should set focusColor to 'green' if not passed", () => {
        (0, react_native_1.render)(<VerticalStick_1.VerticalStick />);
        const stick = react_native_1.screen.getByTestId("otp-input-stick");
        expect(stick).toHaveStyle({ backgroundColor: "green" });
    });
});
