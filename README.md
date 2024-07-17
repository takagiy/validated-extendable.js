# validated-extendable.js

Library that allows you to define classes extending zod schemas to avoid boilerplate code.

[![npm version](https://badge.fury.io/js/validated-extendable.svg)](https://badge.fury.io/js/validated-extendable)

## Installation

```bash
npm install validated-extendable zod
```

```bash
pnpm add validated-extendable zod
```

```bash
yarn add validated-extendable zod
```

## Usage

### Basic

```typescript
import { Validated } from "validated-extendable";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  age: z.number().nonnegative().int(),
});

/* You can define a class extending a zod schema */
class Person extends Validated(schema) {
  greet() {
    console.log(`Hello, I'm ${this.name}.`);
  }
}

/* A constructor typed based on the zod schema is created */
// const person = new Person({ age: 25 }); // => Compile error: Property 'name' is missing in type '{ age: number; }' but required in type '{ name: string; age: number; }'.

/* Constructor will validate the input using the zod schema! */
const person = new Person({ name: "John", age: 25 });
// const invalidPerson = new Person({ name: "John", age: -1 }); // => Throws an error

/* All properties are fully typed and accessible as usual */
console.log(person.name, person.age); // => John 25

/* You can get the original zod schema by accessing the 'schema' static property */
Person.schema.parse({ name: "John", age: 25 }); // => { name: 'John', age: 25 }
```

### Mutable

```typescript
import { ValidatedMutable } from "validated-extendable";
import { z } from "zod";

/* By default, all properties are readonly. You can use 'ValidatedMutable' instead of 'Validated' to make them mutable */
class Person extends ValidatedMutable(
  z.object({
    name: z.string().min(1),
    age: z.number().nonnegative().int(),
  })
) {
  greet() {
    console.log(`Hello, I'm ${this.name}.`);
  }
}

const person = new Person({ name: "John", age: 25 });

/* Mutation of the properties is also validated as constructor is */
person.name = "Jane";
// person.age = -1; // => Throws an error
```

### Primitive Types

```typescript
import { Validated } from "validated-extendable";
import { z } from "zod";

/* Both 'Validated' and 'ValidatedMutable' support primitive types (e.g. z.string(), z.number(), z.boolean(), ...) */
class Age extends Validated(z.number().nonnegative().int()) {
  isAdult() {
    /* You can access the primitive value with the 'value' property */
    return this.value >= 18;
  }
}

const age = new Age(25);
// const invalidAge = new Age(-1); // => Throws an error

console.log(age.value); // => 25
```

## Limitations

By default, the result type of the validation (other than primitive types) should not be a uninheritable type (e.g. tuple types and union types).

But you can use `wrapValue` option to wrap an uninheritable type with an object to make it inheritable (like primitive types are wrapped in above examples).

```typescript
import { Validated } from "validated-extendable";
import { z } from "zod";

/* The validation result type will be '{ success: true, message: string } | { success: false, error: string }' */
const schema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
]);

/* To extend the uninheritable type, you can use 'wrapValue' option */
class Result extends Validated(schema, { wrapValue: true }) {
  getError(): string | undefined {
    /* You can access the wrapped value with the 'value' property */
    return !this.value.success ? this.value.error : undefined;
  }
}

const failure = new Result({ success: false, error: "Oops!" });
console.log(failure.getError()); // => Oops!
```

Validation of setters provided by `ValidatedMutable` won't be called when you set a nested property.

```typescript
import { ValidatedMutable } from "validated-extendable";
import { z } from "zod";

const schema = z.object({
  foo: z.number().nonnegative().int(),
  bar: z.object({
    baz: z.number().nonnegative().int(),
  }),
});

class Foo extends ValidatedMutable(schema) {}

const x = new Foo({ foo: 1, bar: { baz: 2 } });

/* This will be validated */
// x.foo = -1; // => Throws an error

/* This will also be validated */
// x.bar = { baz: -1 }; // => Throws an error

/* This won't be validated */
x.bar.baz = -1; // => Throws no error!!!
```

```typescript
import { ValidatedMutable } from "validated-extendable";
import { z } from "zod";

const schema = z.object({
  foo: z.number().nonnegative().int(),
  bar: z.object({
    baz: z.number().nonnegative().int(),
  }),
});

class Foo2 extends ValidatedMutable(schema, { wrapValue: true }) {}

const x = new Foo2({ foo: 1, bar: { baz: 2 } });

/* This will be validated */
// x.value = { foo: 1, bar: { baz: -1 } }; // => Throws an error

/* This will also be validated */
// x.value.foo = -1; // => Throws an error

/* This will also be validated */
// x.value.bar = { baz: -1 }; // => Throws an error

/* This won't be validated */
x.value.bar.baz = -1; // => Throws no error!!!
```
