import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: ["app/**/*.{ts,tsx}"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsConfig: "jest.tsconfig.json" }],
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
};

export default config;
