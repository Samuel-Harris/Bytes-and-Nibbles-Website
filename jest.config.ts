import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: ["app/**/*.{ts,tsx}"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "jest.tsconfig.json" }],
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/app/$1",
  }
};

export default config;
