import * as React from "react";
import { memo, useEffect, useRef } from "react";
import { Animated, ColorValue, View, ViewStyle } from "react-native";
import { styles } from "./OtpInput.styles";

interface VerticalStickProps {
  focusColor?: ColorValue;
  style?: ViewStyle;
  focusStickBlinkingDuration?: number;
}

export const VerticalStick: React.FC<VerticalStickProps> = memo(
  ({ focusColor, style, focusStickBlinkingDuration = 350 }) => {
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            useNativeDriver: true,
            duration: focusStickBlinkingDuration,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            useNativeDriver: true,
            duration: focusStickBlinkingDuration,
          }),
        ]),
        {
          iterations: -1,
        }
      ).start();
    }, []);

    return (
      <Animated.View style={{ opacity: opacityAnim }}>
        <View
          style={[styles.stick, focusColor ? { backgroundColor: focusColor } : {}, style]}
          testID="otp-input-stick"
        />
      </Animated.View>
    );
  }
);
