"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalStick = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
exports.VerticalStick = (0, react_1.memo)(({ focusColor, style, focusStickBlinkingDuration = 350 }) => {
    const opacityAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    (0, react_1.useEffect)(() => {
        react_native_1.Animated.loop(react_native_1.Animated.sequence([
            react_native_1.Animated.timing(opacityAnim, {
                toValue: 0,
                useNativeDriver: true,
                duration: focusStickBlinkingDuration,
            }),
            react_native_1.Animated.timing(opacityAnim, {
                toValue: 1,
                useNativeDriver: true,
                duration: focusStickBlinkingDuration,
            }),
        ]), {
            iterations: -1,
        }).start();
    }, []);
    return (<react_native_1.Animated.View style={{ opacity: opacityAnim }}>
        <react_native_1.View style={[
            styles.stick,
            focusColor ? { backgroundColor: focusColor } : {},
            style,
        ]}/>
      </react_native_1.Animated.View>);
});
const styles = react_native_1.StyleSheet.create({
    stick: {
        width: 2,
        height: 30,
        backgroundColor: "green",
    },
});
