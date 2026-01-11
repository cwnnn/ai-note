export const tagNoteSchema = {
  type: "object",
  required: ["tags"],
  additionalProperties: false,
  properties: {
    tags: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
      },
      maxItems: 5,
    },
  },
};
