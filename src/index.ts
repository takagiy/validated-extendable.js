import type { ZodSchema, ZodTypeDef, z } from "zod";

export type ValidatedConstructor<
  Schema extends ZodSchema<unknown, ZodTypeDef, unknown>,
> = {
  new (
    value: z.input<Schema>,
  ): Readonly<
    z.infer<Schema> extends object
      ? z.infer<Schema>
      : { value: z.infer<Schema> }
  >;
  schema: Schema;
};

export type ValidatedMutableConstructor<
  Schema extends ZodSchema<unknown, ZodTypeDef, unknown>,
> = {
  new (
    value: z.input<Schema>,
  ): z.infer<Schema> extends object
    ? z.infer<Schema>
    : { value: z.infer<Schema> };
  schema: Schema;
};

export const Validated = <
  Schema extends ZodSchema<unknown, ZodTypeDef, unknown>,
>(
  schema: Schema,
) => {
  const ctor = function Validated(value: z.input<typeof schema>) {
    const validatedValue = schema.parse(value);
    return isObject(validatedValue)
      ? validatedValue
      : { value: validatedValue };
  } as unknown as ValidatedConstructor<Schema>;
  ctor.schema = schema;
  return ctor;
};

export const ValidatedMutable = <
  Schema extends ZodSchema<unknown, ZodTypeDef, unknown>,
>(
  schema: Schema,
) => {
  return function ValidatedMutable(value: z.input<typeof schema>) {
    const validatedValue = schema.parse(value);
    const _isObject = isObject(validatedValue);
    const object = _isObject ? validatedValue : { value: validatedValue };
    return new Proxy(object, {
      set(object, propertyName, newValue) {
        if (!(propertyName in object)) {
          throw new Error(`Property ${String(propertyName)} does not exist`);
        }
        const validatedNewValue = _isObject
          ? (
              schema.parse({
                ...object,
                [propertyName]: newValue,
              }) as Record<string | symbol, unknown>
            )[propertyName]
          : schema.parse(newValue);
        return Reflect.set(object, propertyName, validatedNewValue);
      },
    });
  } as unknown as ValidatedMutableConstructor<Schema>;
};

const isObject = (value: unknown): value is object =>
  value !== null && (typeof value === "object" || typeof value === "function");
