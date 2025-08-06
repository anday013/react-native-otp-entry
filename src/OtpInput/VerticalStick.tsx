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
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
      animationRef.current = Animated.loop(
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
      );
      
      animationRef.current.start();

      return () => {
        if (animationRef.current) {
          animationRef.current.stop();
          opacityAnim.setValue(1);
        }
      };
    }, [focusStickBlinkingDuration]);

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
