import {
  buildCollection,
  buildProperty,
  AdditionalFieldDelegate,
} from "@firecms/core";
import { ColorField } from "../components/ColorField";

export interface ByteSeries {
  title: string;
  accentColour: string;
}

export const colorPreviewField: AdditionalFieldDelegate<ByteSeries> = {
  key: "accent_colour_preview",
  name: "Accent colour",
  Builder: ({ entity }) => {
    const color = entity.values.accentColour;
    return (
      <div
        className="w-6 h-6 rounded border border-gray-300 shadow-sm"
        style={{ backgroundColor: color }}
        title={`Accent color: ${color}`}
      />
    );
  },
  dependencies: ["accentColour"],
};

export const v1ByteSeriesCollection = buildCollection<ByteSeries>({
  id: "v1_byte_series",
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
