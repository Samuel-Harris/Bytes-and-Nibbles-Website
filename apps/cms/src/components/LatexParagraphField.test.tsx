import { render, fireEvent, screen, act } from "@testing-library/react";
import { vi } from "vitest";
import { LatexParagraphField } from "./LatexParagraphField";
import { FieldProps } from "firecms";
import { useMathJax } from "../hooks/useMathJax";

// Mock the useMathJax hook
vi.mock("../hooks/useMathJax");

const mockTypesetPromise = vi.fn();
const mockTypesetClear = vi.fn();
const mockTexReset = vi.fn();

const mockMathJax = {
  typesetPromise: mockTypesetPromise,
  typesetClear: mockTypesetClear,
  texReset: mockTexReset,
};

// Mock FieldProps
const mockSetValue = vi.fn();
const mockFieldProps: FieldProps<string> = {
  property: {
    name: "LaTeX Content",
    dataType: "string",
    description: "Enter your LaTeX here.",
  },
  value: "",
  setValue: mockSetValue,
  showError: false,
  error: undefined,
  isSubmitting: false,
  disabled: false,
};

describe("LatexParagraphField", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useMathJax as vi.Mock).mockReturnValue({
      loaded: true,
      mathJax: mockMathJax,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the text field and description", () => {
    render(<LatexParagraphField {...mockFieldProps} />);
    expect(screen.getByLabelText("LaTeX Content")).toBeInTheDocument();
    expect(screen.getByText("Enter your LaTeX here.")).toBeInTheDocument();
  });

  it("calls setValue on text input change", () => {
    render(<LatexParagraphField {...mockFieldProps} />);
    const textField = screen.getByLabelText("LaTeX Content");
    fireEvent.change(textField, { target: { value: "E=mc^2" } });
    expect(mockSetValue).toHaveBeenCalledWith("E=mc^2");
  });

  it("does not render the preview for an empty value", () => {
    render(<LatexParagraphField {...mockFieldProps} value="" />);
    expect(screen.queryByText("LaTeX Preview")).not.toBeInTheDocument();
  });

  it("renders the preview and calls MathJax for a valid value", async () => {
    mockTypesetPromise.mockResolvedValue(undefined);
    const props = { ...mockFieldProps, value: "a^2+b^2=c^2" };
    render(<LatexParagraphField {...props} />);

    expect(screen.getByText("LaTeX Preview")).toBeInTheDocument();
    expect(screen.getByText("$$a^2+b^2=c^2$$")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(mockTypesetPromise).toHaveBeenCalled();
  });

  it("displays a rendering error if MathJax fails", async () => {
    const error = new Error("Syntax Error");
    mockTypesetPromise.mockRejectedValue(error);

    const props = { ...mockFieldProps, value: "\\invalid" };
    render(<LatexParagraphField {...props} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(
      screen.getByText(`LaTeX syntax error ${error.message}`),
    ).toBeInTheDocument();
  });

  it("displays a field error when showError is true", () => {
    render(
      <LatexParagraphField
        {...mockFieldProps}
        showError={true}
        error="This field is required."
      />,
    );
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  });
});
