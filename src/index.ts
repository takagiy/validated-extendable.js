import type { ZodSchema, ZodTypeDef, z } from "zod";

type IsPrimitive<T> = T extends object ? false : true;

export type ValidatedConstructor<
  Schema extends ZodSchema<unknown, ZodTypeDef, unknown>,
  WrapValue extends boolean,
> = {
  new (
    value: z.input<Schema>,
  ): Readonly<
    WrapValue extends true
      ? { value: Readonly<z.infer<Schema>> }
      : z.infer<Schema>
  >;
  schema: Schema;
};

export type ValidatedMutableConstructor<
  Schema extends ZodSchema<unknown, ZodTypeDef, unknown>,
  WrapValue extends boolean,
> = {
  new (
    value: z.input<Schema>,
  ): WrapValue extends true ? { value: z.infer<Schema> } : z.infer<Schema>;
  schema: Schema;
};

export const Validated = <
  Schema extends ZodSchema<unknown, ZodTypeDef, unknown>,
  Options extends { wrapValue: true } | null = null,
>(
  schema: Schema,
  options?: Options,
) => {
  const ctor = function Validated(value: z.input<typeof schema>) {
    const validatedValue = schema.parse(value);
    const wrapValue = !isObject(validatedValue) || options?.wrapValue;
    return wrapValue ? { value: validatedValue } : validatedValue;
  } as unknown as ValidatedConstructor<
    Schema,
    Options extends { wrapValue: true } ? true : IsPrimitive<z.infer<Schema>>
  >;
  ctor.schema = schema;
  return ctor;
};

export const ValidatedMutable = <
  Schema extends ZodSchema<unknown, ZodTypeDef, unknown>,
  Options extends { wrapValue: true } | null = null,
>(
  schema: Schema,
  options?: Options,
) => {
  const makeValidatedValueProxy = (validatedValue: object) => {
    return new Proxy(validatedValue, {
      set(object, propertyName, newValue) {
        const validatedNewValue = schema.parse({
          ...object,
          [propertyName]: newValue,
        }) as Record<string | symbol, unknown>;
        return Reflect.set(
          object,
          propertyName,
          validatedNewValue[propertyName],
        );
      },
    });
  };
  const ctor = function ValidatedMutable(value: z.input<typeof schema>) {
    const validatedValue = schema.parse(value);
    if (!isObject(validatedValue) || options?.wrapValue) {
      const validatedValueProxy = isObject(validatedValue)
        ? makeValidatedValueProxy(validatedValue)
        : validatedValue;
      return new Proxy(
        { value: validatedValueProxy },
        {
          set(object, propertyName, newValue) {
            if (propertyName !== "value") {
              return Reflect.set(object, propertyName, newValue);
            }
            const validatedNewValue = schema.parse(newValue);
            const validatedNewValueProxy = isObject(validatedNewValue)
              ? makeValidatedValueProxy(validatedNewValue)
              : validatedNewValue;
            return Reflect.set(object, "value", validatedNewValueProxy);
          },
        },
      );
    }
    return new Proxy(validatedValue, {
      set(object, propertyName, newValue) {
        const validatedNewValue = schema.parse({
          ...object,
          [propertyName]: newValue,
        }) as Record<string | symbol, unknown>;
        return Reflect.set(
          object,
          propertyName,
          validatedNewValue[propertyName],
        );
      },
    });
  } as unknown as ValidatedMutableConstructor<
    Schema,
    Options extends { wrapValue: true } ? true : IsPrimitive<z.infer<Schema>>
  >;
  ctor.schema = schema;
  return ctor;
};

const isObject = (value: unknown): value is object =>
  value !== null && (typeof value === "object" || typeof value === "function");
