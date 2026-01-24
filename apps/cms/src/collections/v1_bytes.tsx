import {
  EntityReference,
  EntityOnPreSaveProps,
  UploadedFileContext,
  buildCollection,
  buildProperty,
} from "@firecms/core";
import { MarkdownParagraphField } from "../components/MarkdownParagraphField";
import { LatexParagraphField } from "../components/LatexParagraphField";
import {
  ByteType as SharedByteType,
  SUBSECTION_BODY_ELEMENT_TYPES,
  SECTION_BODY_ELEMENT_TYPES,
} from "@bytes-and-nibbles/shared";

// FireCMS-specific Byte interface that extends shared types with FireCMS EntityReference
interface ByteType extends Omit<SharedByteType, "series"> {
  series: EntityReference; // FireCMS-specific entity reference
}

// Markdown paragraph (object with paragraph field)
const paragraphProperty = buildProperty({
  dataType: "string",
  name: "Paragraph",
  Field: MarkdownParagraphField,
  markdown: true,
  validation: {
    required: true,
  },
});

// LaTeX paragraph
const latexParagraphProperty = buildProperty({
  dataType: "string",
  name: "LaTeX content",
  Field: LatexParagraphField,
  validation: {
    required: true,
  },
});

const captionedImageProperty = buildProperty({
  dataType: "map",
  name: "Captioned image",
  properties: {
    image: buildProperty({
      dataType: "string",
      name: "Image",
      storage: {
        storagePath: "images/bytes/bodyImages",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
        fileName: (context: UploadedFileContext) => {
          return context.file.name;
        },
      },
      validation: {
        required: true,
      },
    }),
    caption: buildProperty({
      dataType: "string",
      name: "Caption",
      markdown: true,
      validation: {
        required: true,
      },
    }),
  },
});

// Collapsible group - contains base content types only (no nesting)
const collapsibleGroupProperty = buildProperty({
  dataType: "map",
  name: "Collapsible group",
  properties: {
    title: buildProperty({
      dataType: "string",
      name: "Title (optional)",
    }),
    body: buildProperty({
      dataType: "array",
      name: "Content",
      validation: { required: true, min: 1 },
      oneOf: {
        typeField: "type",
        valueField: "value",
        properties: {
          [SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH]: paragraphProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH]:
            latexParagraphProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE]:
            captionedImageProperty,
        },
      },
    }),
  },
});

const subsectionProperty = buildProperty({
  dataType: "map",
  name: "Subsection",
  properties: {
    title: buildProperty({
      dataType: "string",
      name: "Subheading",
      validation: { required: true },
    }),
    body: buildProperty({
      dataType: "array",
      name: "Subsection body",
      validation: { required: true },
      oneOf: {
        typeField: "type",
        valueField: "value",
        properties: {
          [SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH]: paragraphProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH]:
            latexParagraphProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE]:
            captionedImageProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP]:
            collapsibleGroupProperty,
        },
      },
    }),
    isCollapsible: buildProperty({
      dataType: "boolean",
      name: "Is collapsible?",
      defaultValue: false,
    }),
  },
});

export const byteCollection = buildCollection<ByteType>({
  id: "v1_bytes",
  name: "Bytes",
  singularName: "Byte",
  path: "v1_bytes",
  properties: {
    title: buildProperty({
      dataType: "string",
      name: "Title",
      validation: {
        required: true,
        unique: true,
      },
    }),
    subtitle: buildProperty({
      dataType: "string",
      name: "Subtitle",
      validation: {
        required: true,
      },
    }),
    series: buildProperty({
      dataType: "reference",
      path: "v1_byte_series",
      name: "Series",
      validation: {
        required: true,
      },
    }),
    slug: buildProperty({
      dataType: "string",
      name: "Slug",
      validation: {
        required: true,
        unique: true,
        min: 5,
        matches: "^[a-z][a-z0-9-]*[a-z0-9]+$",
      },
    }),
    thumbnail: buildProperty({
      dataType: "string",
      name: "Thumbnail",
      storage: {
        storagePath: "images/bytes/thumbnails",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
        fileName: (context: UploadedFileContext) => {
          return context.file.name;
        },
      },
      validation: {
        required: true,
      },
    }),
    coverPhoto: buildProperty({
      dataType: "string",
      name: "Cover photo",
      storage: {
        storagePath: "images/bytes/coverPhotos",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
        fileName: (context: UploadedFileContext) => {
          return context.file.name;
        },
      },
      validation: {
        required: true,
      },
    }),
    isPublished: buildProperty({
      dataType: "boolean",
      name: "Is published?",
      validation: {
        required: true,
      },
    }),
    publishDate: buildProperty({
      dataType: "date",
      name: "Publish date",
      autoValue: "on_create",
    }),
    lastModifiedDate: buildProperty({
      dataType: "date",
      name: "Last modified date",
      autoValue: "on_update",
    }),
    sections: buildProperty({
      dataType: "array",
      name: "Sections",
      validation: {
        required: true,
        min: 1,
      },
      of: {
        dataType: "map",
        properties: {
          title: buildProperty({
            dataType: "string",
            name: "Heading",
            validation: {
              required: true,
            },
          }),
          isCollapsible: buildProperty({
            dataType: "boolean",
            name: "Is collapsible?",
            defaultValue: false,
          }),
          body: buildProperty({
            dataType: "array",
            name: "Section body",
            validation: {
              required: true,
            },
            oneOf: {
              typeField: "type",
              valueField: "value",
              properties: {
                [SECTION_BODY_ELEMENT_TYPES.SUBSECTION]: subsectionProperty,
                [SECTION_BODY_ELEMENT_TYPES.PARAGRAPH]: paragraphProperty,
                [SECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH]:
                  latexParagraphProperty,
                [SECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE]:
                  captionedImageProperty,
                [SECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP]:
                  collapsibleGroupProperty,
              },
            },
          }),
        },
      },
    }),
  },
  callbacks: {
    onPreSave: async ({ values, previousValues }: EntityOnPreSaveProps) => {
      if (
        values.isPublished === true &&
        previousValues?.isPublished === false
      ) {
        values.publishDate = new Date();
      }

      return values;
    },
  },
});
