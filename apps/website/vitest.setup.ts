import "@testing-library/jest-dom/vitest";

vi.mock("react-syntax-highlighter/dist/esm/styles/prism", () => ({
  vscDarkPlus: {},
}));
