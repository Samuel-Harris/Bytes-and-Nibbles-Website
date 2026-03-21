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

const isFinishedProperty = buildProperty({
  dataType: "boolean",
  name: "Is finished?",
  defaultValue: false,
});

const areSubsectionBodyElementsFinished = (elements: unknown): boolean => {
  if (!Array.isArray(elements)) {
    return false;
  }

  return elements.every((element) => {
    if (typeof element !== "object" || element === null) {
      return false;
    }

    const typedElement = element as { type?: string; value?: unknown };
    const value = typedElement.value as
      | {
          isFinished?: boolean;
          body?: unknown;
        }
      | undefined;

    switch (typedElement.type) {
      case SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH:
      case SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH:
      case SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE:
        return value?.isFinished === true;
      case SUBSECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP:
        return (
          value?.isFinished === true &&
          areSubsectionBodyElementsFinished(value.body)
        );
      default:
        return false;
    }
  });
};

const areSectionElementsFinished = (sections: unknown): boolean => {
  if (!Array.isArray(sections)) {
    return false;
  }

  return sections.every((section) => {
    if (typeof section !== "object" || section === null) {
      return false;
    }

    const typedSection = section as {
      isFinished?: boolean;
      body?: unknown;
    };

    if (typedSection.isFinished !== true || !Array.isArray(typedSection.body)) {
      return false;
    }

    return typedSection.body.every((element) => {
      if (typeof element !== "object" || element === null) {
        return false;
      }

      const typedElement = element as { type?: string; value?: unknown };
      const value = typedElement.value as
        | {
            isFinished?: boolean;
            body?: unknown;
          }
        | undefined;

      switch (typedElement.type) {
        case SECTION_BODY_ELEMENT_TYPES.PARAGRAPH:
        case SECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH:
        case SECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE:
          return value?.isFinished === true;
        case SECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP:
          return (
            value?.isFinished === true &&
            areSubsectionBodyElementsFinished(value.body)
          );
        case SECTION_BODY_ELEMENT_TYPES.SUBSECTION:
          return (
            value?.isFinished === true &&
            areSubsectionBodyElementsFinished(value.body)
          );
        default:
          return false;
      }
    });
  });
};

// Markdown paragraph
const paragraphProperty = buildProperty({
  dataType: "map",
  name: "Paragraph",
  properties: {
    paragraph: buildProperty({
      dataType: "string",
      name: "Paragraph",
      Field: MarkdownParagraphField,
      markdown: true,
      validation: {
        required: true,
      },
    }),
    isFinished: isFinishedProperty,
  },
});

// LaTeX paragraph
const latexParagraphProperty = buildProperty({
  dataType: "map",
  name: "LaTeX content",
  properties: {
    latexContent: buildProperty({
      dataType: "string",
      name: "LaTeX content",
      Field: LatexParagraphField,
      validation: {
        required: true,
      },
    }),
    isFinished: isFinishedProperty,
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
    isFinished: isFinishedProperty,
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
    isFinished: isFinishedProperty,
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
    isFinished: isFinishedProperty,
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
      defaultValue: false,
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
          isFinished: isFinishedProperty,
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
      const isPublishingNow =
        values.isPublished === true && previousValues?.isPublished !== true;

      if (isPublishingNow && !areSectionElementsFinished(values.sections)) {
        throw new Error(
          "Cannot publish: all sections and nested elements must be marked as finished."
        );
      }

      if (isPublishingNow) {
        values.publishDate = new Date();
      }

      return values;
    },
  },
});
