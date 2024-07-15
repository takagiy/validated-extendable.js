# validated-extendable.js

Library allows you to define classes extending zod schemas to avoid boilerplate code.

[![npm version](https://badge.fury.io/js/validated-extendable.svg)](https://badge.fury.io/js/validated-extendable)

## Installation

```bash
npm install validated-extendable
```

```bash
pnpm add validated-extendable
```

```bash
yarn add validated-extendable
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

/* Constructor will validate the input using the zod schema! */
const person = new Person({ name: "John", age: 25 });
// const invalidPerson = new Person({ name: "John", age: -1 }); // => Throws an error

/* You can access the properties as usual */
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
