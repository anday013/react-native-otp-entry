# react-native-otp-entry

[![npm version](https://badge.fury.io/js/react-native-otp-entry.svg?&kill_cache=1)](https://badge.fury.io/js/react-native-otp-entry)
[![npm](https://img.shields.io/npm/dm/react-native-otp-entry.svg?&kill_cache=1)]()
[![cov](https://anday013.github.io/react-native-otp-entry/badges/coverage.svg?&kill_cache=1)](https://github.com/anday013/react-native-otp-entry/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?&kill_cache=1)](https://github.com/your-username/react-native-otp-entry/blob/main/LICENSE)

`react-native-otp-entry` is a simple and highly customizable React Native component for entering OTP (One-Time Password) on iOS, Android, and Web. It provides an intuitive and user-friendly interface for inputting one-time passwords in your React Native applications.

![Demo](otp_demo.gif)

## Features

- Simple and easy-to-use OTP input component.
- Highly customizable appearance and styling.
- Supports autofill
- Effortlessly integrates with **React Native**, **Expo**, and **React Native Web** platforms.
- Fully typed with TypeScript.
- Fully covered with unit tests.
- Paste functionality.

## Demo

Try out React Native OTP Entry in action on Snack Expo:

[![Snack Expo App](https://img.shields.io/badge/Snack-fff.svg?style=for-the-badge&logo=EXPO&labelColor=000&logoColor=FFF)](https://snack.expo.dev/@anday013/demo-react-native-otp-entry)

or https://snack.expo.dev/@anday013/demo-react-native-otp-entry

## Installation

Install `react-native-otp-entry` using npm or yarn:

```bash
npm install react-native-otp-entry

# or

yarn add react-native-otp-entry
```

## Usage

1. Import the `OtpInput` component from `react-native-otp-entry`:

   ```javascript
   import { OtpInput } from "react-native-otp-entry";
   ```

2. Render the `OtpInput` component in your screen/component:

   ```jsx
   <OtpInput numberOfDigits={6} onTextChange={(text) => console.log(text)} />
   ```

3. Customize the styling as per your requirements:

   ```javascript
   <OtpInput
     numberOfDigits={6}
     focusColor="green"
     focusStickBlinkingDuration={500}
     onTextChange={(text) => console.log(text)}
     onFilled={(text) => console.log(`OTP is ${text}`)}
     theme={{
       containerStyle: styles.container,
       inputsContainerStyle: styles.inputsContainer,
       pinCodeContainerStyle: styles.pinCodeContainer,
       pinCodeTextStyle: styles.pinCodeText,
       focusStickStyle: styles.focusStick,
       focusedPinCodeContainerStyle: styles.activePinCodeContainer,
     }}
   />
   ```

## Props

The `react-native-otp-entry` component accepts the following props:

| Prop                         | Type                   | Description                                                                                                    |
| ---------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| `numberOfDigits`             | number                 | The number of digits to be displayed in the OTP entry.                                                         |
| `autoFocus`                  | boolean                | Default: true. Set autofocus.                                                                                  |
| `focusColor`                 | ColorValue             | The color of the input field border and stick when it is focused.                                              |
| `onTextChange`               | (text: string) => void | A callback function is invoked when the OTP text changes. It receives the updated text as an argument.         |
| `onFilled`                   | (text: string) => void | A callback function is invoked when the OTP input is fully filled. It receives a full otp code as an argument. |
| `hideStick`                  | boolean                | Hide cursor of the focused input.                                                                              |
| `theme`                      | Theme                  | Custom styles for each element.                                                                                |
| `focusStickBlinkingDuration` | number                 | The duration (in milliseconds) for the focus stick to blink.                                                   |
| `disabled`                   | boolean                | Default: false. Disable the input                                                                              |
| `textInputProps`             | TextInputProps         | Extra props passed to underlying hidden TextInput (see: https://reactnative.dev/docs/textinput)                |

| Theme                           | Type      | Description                                                                        |
| ------------------------------- | --------- | ---------------------------------------------------------------------------------- |
| `containerStyle`                | ViewStyle | Custom styles for the root `View`.                                                 |
| `inputsContainerStyle`          | ViewStyle | Custom styles for the container that holds the input fields.                       |
| `pinCodeContainerStyle`         | ViewStyle | Custom styles for the container that wraps each individual digit in the OTP entry. |
| `pinCodeTextStyle`              | TextStyle | Custom styles for the text within each individual digit in the OTP entry.          |
| `focusStickStyle`               | ViewStyle | Custom styles for the focus stick, which indicates the focused input field.        |
| `focusedPinCodeContainerStyle`  | ViewStyle | Custom styles for the input field when it is focused.                              |
| `filledPinCodeContainerStyle`   | ViewStyle | Custom styles for the input field when it has a value.                             |
| `disabledPinCodeContainerStyle` | ViewStyle | Custom styles for the input field when it is disabled.                             |

Note: The `ViewStyle` and `TextStyle` types are imported from `react-native` and represent the style objects used in React Native for views and text, respectively.

## Ref

The `react-native-otp-entry` component exposes these functions with `ref`:

| Prop       | Type                     | Description                        |
| ---------- | ------------------------ | ---------------------------------- |
| `clear`    | () => void;              | Clears the value of the OTP input. |
| `focus`    | () => void;              | Focus of the OTP input.            |
| `setValue` | (value: string) => void; | Sets the value of the OTP input.   |

## License

This project is licensed under the [MIT License](https://github.com/your-username/react-native-otp-entry/blob/main/LICENSE).

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

If you find a bug or have any feature requests, please open an issue :)
