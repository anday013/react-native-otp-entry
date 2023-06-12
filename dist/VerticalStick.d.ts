/// <reference types="react" />
import { ColorValue, ViewStyle } from "react-native";
interface VerticalStickProps {
    focusColor?: ColorValue;
    style?: ViewStyle;
    focusStickBlinkingDuration?: number;
}
export declare const VerticalStick: React.FC<VerticalStickProps>;
export {};
