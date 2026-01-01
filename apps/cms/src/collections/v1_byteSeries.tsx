import {
  buildCollection,
  buildProperty,
  AdditionalFieldDelegate,
} from "firecms";
import { ColorField } from "../components/ColorField";
import { ByteSeriesType } from "@bytes-and-nibbles/shared";

export const colorPreviewField: AdditionalFieldDelegate<ByteSeriesType> = {
  id: "accent_colour_preview",
  name: "Accent colour",
  Builder: ({ entity }) => {
    // Access the value safely
    const color = entity?.values?.accentColour;

    if (!color) {
      return <div style={{ fontSize: "12px", color: "#888" }}>No color</div>;
    }

    return (
      <div
        style={{
          backgroundColor: color,
          width: "24px",
          height: "24px",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
        title={`Accent color: ${color}`}
      />
    );
  },
  dependencies: ["accentColour"],
};

export const v1ByteSeriesCollection = buildCollection<ByteSeriesType>({
  name: "Byte series",
  singularName: "Byte series",
  path: "v1_byte_series",
  additionalFields: [colorPreviewField],
  properties: {
    title: buildProperty({
      dataType: "string",
      name: "Title",
      validation: {
        required: true,
        unique: true,
      },
    }),
    accentColour: buildProperty({
      dataType: "string",
      name: "Accent colour (hex)",
      description: "Choose the accent colour for this series",
      Field: ColorField,
      customProps: {
        defaultColor: "#000000",
      },
      validation: {
        required: true,
        matches: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      },
    }),
  },
});
