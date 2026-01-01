import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MarkdownParagraphField } from "./MarkdownParagraphField";
import { FieldProps } from "firecms";

// Mock FieldProps
const mockSetValue = vi.fn();
const mockFieldProps: FieldProps<string> = {
  property: {
    name: "Markdown Content",
    dataType: "string",
    description: "Enter your markdown here.",
  },
  value: "",
  setValue: mockSetValue,
  showError: false,
  error: undefined,
  isSubmitting: false,
  disabled: false,
  includeDescription: true,
};

describe("MarkdownParagraphField", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the text field, label, and description", () => {
    render(<MarkdownParagraphField {...mockFieldProps} />);
    expect(screen.getByLabelText("Markdown Content")).toBeInTheDocument();
    expect(screen.getByText("Enter your markdown here.")).toBeInTheDocument();
  });

  it("calls setValue on text input change", () => {
    render(<MarkdownParagraphField {...mockFieldProps} />);
    const textField = screen.getByLabelText("Markdown Content");
    fireEvent.change(textField, { target: { value: "# Hello" } });
    expect(mockSetValue).toHaveBeenCalledWith("# Hello");
  });

  it("does not render the preview for an empty value", () => {
    render(<MarkdownParagraphField {...mockFieldProps} value="" />);
    expect(screen.queryByText("Markdown preview")).not.toBeInTheDocument();
  });

  it("renders the markdown preview for a valid value", () => {
    const props = { ...mockFieldProps, value: "**bold text**" };
    render(<MarkdownParagraphField {...props} />);
    expect(screen.getByText("Markdown preview")).toBeInTheDocument();
    const boldText = screen.getByText("bold text");
    expect(boldText).toBeInTheDocument();
    expect(boldText.tagName).toBe("STRONG");
  });

  it("displays an error message when showError is true", () => {
    render(
      <MarkdownParagraphField
        {...mockFieldProps}
        showError={true}
        error="This field is required."
      />,
    );
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  });
});
