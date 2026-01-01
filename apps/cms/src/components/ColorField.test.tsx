import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ColorField } from "./ColorField";
import { FieldProps } from "firecms";

// Mock FieldProps
const mockSetValue = vi.fn();

const mockFieldProps: FieldProps<string> = {
  property: {
    name: "Test Color",
    dataType: "string",
    description: "This is a test description.",
  },
  value: "#ff0000",
  setValue: mockSetValue,
  showError: false,
  isSubmitting: false,
  disabled: false,
  autoFocus: false,
  includeDescription: true,
  error: undefined,
};

beforeEach(() => {
  mockSetValue.mockClear();
});

describe("ColorField", () => {
  it("renders correctly with initial value", () => {
    const { container, getByText } = render(
      <ColorField {...mockFieldProps} />,
    );
    const textInput = screen.getByRole("textbox");
    expect(textInput).toHaveValue("#ff0000");

    const colorInput = container.querySelector('input[type="color"]');
    expect(colorInput).toHaveValue("#ff0000");

    expect(getByText("Test Color")).toBeInTheDocument();
    expect(getByText("This is a test description.")).toBeInTheDocument();
  });

  it("calls setValue on color input change", () => {
    const { container } = render(<ColorField {...mockFieldProps} />);
    const colorInput = container.querySelector('input[type="color"]');
    fireEvent.change(colorInput!, { target: { value: "#00ff00" } });
    expect(mockSetValue).toHaveBeenCalledWith("#00ff00");
  });

  it("calls setValue on text input change with valid hex", () => {
    render(<ColorField {...mockFieldProps} />);
    const textInput = screen.getByRole("textbox");
    fireEvent.change(textInput, { target: { value: "#0000ff" } });
    expect(mockSetValue).toHaveBeenCalledWith("#0000ff");
  });

  it("does not call setValue on text input change with invalid hex", () => {
    render(<ColorField {...mockFieldProps} />);
    const textInput = screen.getByRole("textbox");
    fireEvent.change(textInput, { target: { value: "invalid-color" } });
    expect(mockSetValue).not.toHaveBeenCalled();
  });

  it("displays an error message when showError is true", () => {
    const { getByText } = render(
      <ColorField {...mockFieldProps} showError={true} error="Test error" />,
    );
    expect(getByText("Test error")).toBeInTheDocument();
  });
});
