"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpInput = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const OtpInput_styles_1 = require("./OtpInput.styles");
const VerticalStick_1 = require("./VerticalStick");
const useOtpInput_1 = require("./useOtpInput");
exports.OtpInput = (0, react_1.forwardRef)((props, ref) => {
    const { models: { text, inputRef, focusedInputIndex }, actions: { clear, handlePress, handleTextChange, focus }, forms: { setTextWithRef }, } = (0, useOtpInput_1.useOtpInput)(props);
    const { numberOfDigits = 6, autoFocus = true, hideStick, focusColor = "#A4D0A4", focusStickBlinkingDuration, secureTextEntry = false, theme = {}, } = props;
    const { containerStyle, inputsContainerStyle, pinCodeContainerStyle, pinCodeTextStyle, focusStickStyle, focusedPinCodeContainerStyle, filledPinCodeContainerStyle, } = theme;
    (0, react_1.useImperativeHandle)(ref, () => ({ clear, focus, setValue: setTextWithRef }));
    const generatePinCodeContainerStyle = (isFocusedInput, char) => {
        const stylesArray = [OtpInput_styles_1.styles.codeContainer, pinCodeContainerStyle];
        if (focusColor && isFocusedInput) {
            stylesArray.push({ borderColor: focusColor });
        }
        if (focusedPinCodeContainerStyle && isFocusedInput) {
            stylesArray.push(focusedPinCodeContainerStyle);
        }
        if (filledPinCodeContainerStyle && Boolean(char)) {
            stylesArray.push(filledPinCodeContainerStyle);
        }
        return stylesArray;
    };
    return (<react_native_1.View style={[OtpInput_styles_1.styles.container, containerStyle]}>
      <react_native_1.View style={[OtpInput_styles_1.styles.inputsContainer, inputsContainerStyle]}>
        {Array(numberOfDigits)
            .fill(0)
            .map((_, index) => {
            const char = text[index];
            const isFocusedInput = index === focusedInputIndex;
            return (<react_native_1.Pressable key={`${char}-${index}`} onPress={handlePress} style={generatePinCodeContainerStyle(isFocusedInput, char)} testID="otp-input">
                {isFocusedInput && !hideStick ? (<VerticalStick_1.VerticalStick focusColor={focusColor} style={focusStickStyle} focusStickBlinkingDuration={focusStickBlinkingDuration}/>) : (<react_native_1.Text style={[OtpInput_styles_1.styles.codeText, pinCodeTextStyle]}>
                    {char && secureTextEntry ? "•" : char}
                  </react_native_1.Text>)}
              </react_native_1.Pressable>);
        })}
      </react_native_1.View>
      <react_native_1.TextInput value={text} onChangeText={handleTextChange} maxLength={numberOfDigits} inputMode="numeric" textContentType="oneTimeCode" ref={inputRef} autoFocus={autoFocus} style={OtpInput_styles_1.styles.hiddenInput} secureTextEntry={secureTextEntry} autoComplete="one-time-code" testID="otp-input-hidden"/>
    </react_native_1.View>);
});
