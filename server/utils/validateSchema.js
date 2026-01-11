import Ajv from "ajv";

const ajv = new Ajv();

export function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    throw new Error(
      "Schema validation failed: " + ajv.errorsText(validate.errors)
    );
  }

  return true;
}
