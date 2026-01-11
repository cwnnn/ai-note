import Ajv from "ajv";
import AppError from "./AppError.js";

const ajv = new Ajv();

export function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    throw new AppError(
      "Schema validation failed: " + ajv.errorsText(validate.errors),
      502
    );
  }

  return true;
}
