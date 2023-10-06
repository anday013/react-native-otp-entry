"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Presets = require("ts-jest/presets");
const config = {
    ...Presets.defaults,
    preset: "react-native",
    transform: {
        "^.+\\.jsx$": "babel-jest",
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.jest.json",
            },
        ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    modulePathIgnorePatterns: ["./dist/"],
    coverageReporters: ["json-summary", "html"],
    setupFilesAfterEnv: ["./jest.setupFilesAfterEnv.ts"],
};
exports.default = config;
