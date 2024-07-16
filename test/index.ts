import { Validated, ValidatedMutable } from "@/index";
import test from "ava";
import z from "zod";

class Person extends Validated(
  z.object({
    name: z.string().min(1),
    age: z.number().nonnegative().int(),
  }),
) {}

class Person2 extends Validated(
  z.object({
    name: z.string().min(1),
    age: z.number().nonnegative().int(),
  }),
  {
    wrapValue: true,
  },
) {}

test("validate", (t) => {
  const person = new Person({
    name: "John",
    age: 30,
  });
  t.is(person.name, "John");
  t.is(person.age, 30);

  const person2 = new Person2({
    name: "John",
    age: 30,
  });
  t.is(person2.value.name, "John");
  t.is(person2.value.age, 30);
});

test("validate error", (t) => {
  t.throws(() => {
    new Person({
      name: "John",
      age: -1,
    });
  });
  t.throws(() => {
    new Person({
      name: "John",
      age: 0.5,
    });
  });
  t.throws(() => {
    new Person({
      name: "",
      age: 30,
    });
  });
  t.throws(() => {
    new Person2({
      name: "John",
      age: -1,
    });
  });
  t.throws(() => {
    new Person2({
      name: "John",
      age: 0.5,
    });
  });
  t.throws(() => {
    new Person2({
      name: "",
      age: 30,
    });
  });
});

class PersonMutable extends ValidatedMutable(
  z.object({
    name: z.string().min(1),
    age: z.number().nonnegative().int(),
  }),
) {}

class PersonMutable2 extends ValidatedMutable(
  z.object({
    name: z.string().min(1),
    age: z.number().nonnegative().int(),
  }),
  {
    wrapValue: true,
  },
) {}

test("validate mutable", (t) => {
  const person = new PersonMutable({
    name: "John",
    age: 30,
  });
  t.is(person.name, "John");
  t.is(person.age, 30);
  person.name = "Jane";
  person.age = 31;
  t.is(person.name, "Jane");
  t.is(person.age, 31);
  const person2 = new PersonMutable2({
    name: "John",
    age: 30,
  });
  t.is(person2.value.name, "John");
  t.is(person2.value.age, 30);
  person2.value.name = "Jane";
  person2.value.age = 31;
  t.is(person2.value.name, "Jane");
  t.is(person2.value.age, 31);
});

test("validate mutable error (construct)", (t) => {
  t.throws(() => {
    new PersonMutable({
      name: "John",
      age: -1,
    });
  });
  t.throws(() => {
    new PersonMutable({
      name: "John",
      age: 0.5,
    });
  });
  t.throws(() => {
    new PersonMutable({
      name: "",
      age: 30,
    });
  });
  t.throws(() => {
    new PersonMutable2({
      name: "John",
      age: -1,
    });
  });
  t.throws(() => {
    new PersonMutable2({
      name: "John",
      age: 0.5,
    });
  });
  t.throws(() => {
    new PersonMutable2({
      name: "",
      age: 30,
    });
  });
});

test("validate mutable error (mutation)", (t) => {
  const person = new PersonMutable({
    name: "John",
    age: 30,
  });
  t.throws(() => {
    person.age = -1;
  });
  t.throws(() => {
    person.age = 0.5;
  });
  t.throws(() => {
    person.name = "";
  });
  const person2 = new PersonMutable2({
    name: "John",
    age: 30,
  });
  t.throws(() => {
    person2.value.age = -1;
  });
  t.throws(() => {
    person2.value.age = 0.5;
  });
  t.throws(() => {
    person2.value.name = "";
  });
});

class Age extends Validated(z.number().nonnegative().int()) {}

class Age2 extends Validated(z.number().nonnegative().int(), {
  wrapValue: true,
}) {}

test("validate primitive", (t) => {
  const age = new Age(30);
  t.is(age.value, 30);
  const age2 = new Age2(30);
  t.is(age2.value, 30);
});

test("validate primitive error", (t) => {
  t.throws(() => {
    new Age(-1);
  });
  t.throws(() => {
    new Age(0.5);
  });
  t.throws(() => {
    new Age2(-1);
  });
  t.throws(() => {
    new Age2(0.5);
  });
});

class AgeMutable extends ValidatedMutable(z.number().nonnegative().int()) {}

class AgeMutable2 extends ValidatedMutable(z.number().nonnegative().int(), {
  wrapValue: true,
}) {}

test("validate primitive mutable", (t) => {
  const age = new AgeMutable(30);
  t.is(age.value, 30);
  age.value = 31;
  t.is(age.value, 31);
  const age2 = new AgeMutable2(30);
  t.is(age2.value, 30);
  age2.value = 31;
  t.is(age2.value, 31);
});

test("validate primitive mutable error (construct)", (t) => {
  t.throws(() => {
    new AgeMutable(-1);
  });
  t.throws(() => {
    new AgeMutable(0.5);
  });
  t.throws(() => {
    new AgeMutable2(-1);
  });
  t.throws(() => {
    new AgeMutable2(0.5);
  });
});

test("validate primitive mutable error (mutation)", (t) => {
  const age = new AgeMutable(30);
  t.throws(() => {
    age.value = -1;
  });
  t.throws(() => {
    age.value = 0.5;
  });
  const age2 = new AgeMutable2(30);
  t.throws(() => {
    age2.value = -1;
  });
  t.throws(() => {
    age2.value = 0.5;
  });
});
