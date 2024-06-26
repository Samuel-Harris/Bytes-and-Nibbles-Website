import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: ["app/**/*.{ts,tsx}"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "jest.tsconfig.json" }],
    "^.+\\.css$": "jest-transform-css",
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1",
    'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
  },
};

export default config;
