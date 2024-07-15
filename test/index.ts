import { Validated, ValidatedMutable } from "@/index";
import test from "ava";
import z from "zod";

class Person extends Validated(
  z.object({
    name: z.string().min(1),
    age: z.number().nonnegative().int(),
  }),
) {}

test("validate", (t) => {
  const person = new Person({
    name: "John",
    age: 30,
  });
  t.is(person.name, "John");
  t.is(person.age, 30);
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
});

class PersonMutable extends ValidatedMutable(
  z.object({
    name: z.string().min(1),
    age: z.number().nonnegative().int(),
  }),
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
});

class Age extends Validated(z.number().nonnegative().int()) {}

test("validate primitive", (t) => {
  const age = new Age(30);
  t.is(age.value, 30);
});

test("validate primitive error", (t) => {
  t.throws(() => {
    new Age(-1);
  });
  t.throws(() => {
    new Age(0.5);
  });
});

class AgeMutable extends ValidatedMutable(z.number().nonnegative().int()) {}

test("validate primitive mutable", (t) => {
  const age = new AgeMutable(30);
  t.is(age.value, 30);
  age.value = 31;
  t.is(age.value, 31);
});

test("validate primitive mutable error (construct)", (t) => {
  t.throws(() => {
    new AgeMutable(-1);
  });
  t.throws(() => {
    new AgeMutable(0.5);
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
});
