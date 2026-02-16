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
    "^react-markdown$": "<rootDir>/__mocks__/react-markdown.js",
    "^remark-gfm$": "<rootDir>/__mocks__/remark-gfm.js",
    "^react-syntax-highlighter$":
      "<rootDir>/__mocks__/react-syntax-highlighter.js",
    "^react-syntax-highlighter/dist/esm/styles/prism$":
      "<rootDir>/__mocks__/react-syntax-highlighter-style.js",
  },
};

export default config;
