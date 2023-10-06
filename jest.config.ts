import type { Config } from "@jest/types";
import * as Presets from "ts-jest/presets";

const config: Config.InitialOptions = {
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

export default config;
