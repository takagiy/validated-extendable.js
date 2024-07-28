import { Validated, ValidatedMutable } from "@/index";
import test from "ava";
import z from "zod";

class Person extends Validated(
  z.object({
    name: z.string().min(1),
    age: z.number().nonnegative().int(),
  }),
) {
  greet() {
    return `Hi, It's ${this.name}!`;
  }
}

class Person2 extends Validated(
  z.object({
    name: z.string().min(1),
    age: z.number().nonnegative().int(),
  }),
  {
    wrapValue: true,
  },
) {
  greet() {
    return `Hi, It's ${this.value.name}!`;
  }
}

test("validate", (t) => {
  const person = new Person({
    name: "John",
    age: 30,
  });
  t.is(person.name, "John");
  t.is(person.age, 30);
  t.is(person.greet(), "Hi, It's John!");

  const person2 = new Person2({
    name: "John",
    age: 30,
  });
  t.is(person2.value.name, "John");
  t.is(person2.value.age, 30);
  t.is(person2.greet(), "Hi, It's John!");
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
) {
  greet() {
    return `Hi, It's ${this.name}!`;
  }
}

class PersonMutable2 extends ValidatedMutable(
  z.object({
    name: z.string().min(1),
    age: z.number().nonnegative().int(),
  }),
  {
    wrapValue: true,
  },
) {
  greet() {
    return `Hi, It's ${this.value.name}!`;
  }
}

test("validate mutable", (t) => {
  const person = new PersonMutable({
    name: "John",
    age: 30,
  });
  t.is(person.name, "John");
  t.is(person.greet(), "Hi, It's John!");
  t.is(person.age, 30);
  person.name = "Jane";
  person.age = 31;
  t.is(person.name, "Jane");
  t.is(person.greet(), "Hi, It's Jane!");
  t.is(person.age, 31);
  const person2 = new PersonMutable2({
    name: "John",
    age: 30,
  });
  t.is(person2.value.name, "John");
  t.is(person2.greet(), "Hi, It's John!");
  t.is(person2.value.age, 30);
  person2.value.name = "Jane";
  person2.value.age = 31;
  t.is(person2.value.name, "Jane");
  t.is(person2.greet(), "Hi, It's Jane!");
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

class Status extends Validated(
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      message: z.string(),
    }),
    z.object({
      success: z.literal(false),
      error: z.string(),
    }),
  ]),
  { wrapValue: true },
) {
  getError() {
    return !this.value.success ? this.value.error : undefined;
  }
}

test("validate discriminated union", (t) => {
  const status = new Status({
    success: true,
    message: "ok",
  });
  t.is(status.value.success, true);
  status.value.success && t.is(status.value.message, "ok");
  const status2 = new Status({
    success: false,
    error: "ng",
  });
  t.is(status2.value.success, false);
  status2.value.success || t.is(status2.value.error, "ng");
});

class Foo extends ValidatedMutable(
  z.object({
    foo: z.number().nonnegative().int(),
    bar: z.object({
      baz: z.number().nonnegative().int(),
    }),
  }),
) {}

test("validate nested object mutation", (t) => {
  const foo = new Foo({
    foo: 1,
    bar: {
      baz: 2,
    },
  });
  t.is(foo.foo, 1);
  t.is(foo.bar.baz, 2);
  foo.foo = 3;
  foo.bar.baz = 4;
  t.is(foo.foo, 3);
  t.is(foo.bar.baz, 4);
});

test("validate nested object mutation error", (t) => {
  const foo = new Foo({
    foo: 1,
    bar: {
      baz: 2,
    },
  });
  t.throws(() => {
    foo.foo = -1;
  });
  t.throws(() => {
    foo.foo = 0.5;
  });
  t.throws(() => {
    foo.bar = { baz: -1 };
  });
  t.throws(() => {
    foo.bar = { baz: 0.5 };
  });
  foo.bar.baz = -1;
  t.is(foo.bar.baz, -1);
  foo.bar.baz = 0.5;
  t.is(foo.bar.baz, 0.5);
});

class Foo2 extends ValidatedMutable(
  z.object({
    foo: z.number().nonnegative().int(),
    bar: z.object({
      baz: z.number().nonnegative().int(),
    }),
  }),
  { wrapValue: true },
) {}

test("validate nested object mutation (wrapValue)", (t) => {
  const foo = new Foo2({
    foo: 1,
    bar: {
      baz: 2,
    },
  });
  t.is(foo.value.foo, 1);
  t.is(foo.value.bar.baz, 2);
  foo.value.foo = 3;
  foo.value.bar.baz = 4;
  t.is(foo.value.foo, 3);
  t.is(foo.value.bar.baz, 4);
});

test("validate nested object mutation error (wrapValue)", (t) => {
  const foo = new Foo2({
    foo: 1,
    bar: {
      baz: 2,
    },
  });
  t.throws(() => {
    foo.value = { foo: 1, bar: { baz: -1 } };
  });
  t.throws(() => {
    foo.value.foo = -1;
  });
  t.throws(() => {
    foo.value.foo = 0.5;
  });
  t.throws(() => {
    foo.value.bar = { baz: -1 };
  });
  t.throws(() => {
    foo.value.bar = { baz: 0.5 };
  });
  foo.value.bar.baz = -1;
  t.is(foo.value.bar.baz, -1);
  foo.value.bar.baz = 0.5;
  t.is(foo.value.bar.baz, 0.5);
});

class Article extends ValidatedMutable(
  z.object({
    title: z.string().min(1),
    postedAt: z.instanceof(Date),
  }),
) {}

test("validate instanceof", (t) => {
  const article = new Article({
    title: "Hello",
    postedAt: new Date("2021-01-01"),
  });
  t.is(article.title, "Hello");
  t.is(article.postedAt.getFullYear(), 2021);
  t.is(article.postedAt.getMonth(), 0);
  t.is(article.postedAt.getDate(), 1);
});

class TransformedProperty extends ValidatedMutable(
  z.object({
    foo: z
      .string()
      .startsWith("foo:")
      .transform((v) => v.slice(4)),
    bar: z.string().min(1),
  }),
) {}

class TransformedProperty2 extends ValidatedMutable(
  z.object({
    foo: z
      .string()
      .startsWith("foo:")
      .transform((v) => v.slice(4)),
    bar: z.string().min(1),
  }),
  { wrapValue: true },
) {}

test("validate transformed property", (t) => {
  const transformed = new TransformedProperty({
    foo: "foo:foo",
    bar: "bar",
  });
  t.is(transformed.foo, "foo");
  transformed.foo = "foo:bar";
  transformed.bar = "baz";
  t.is(transformed.foo, "bar");
  t.is(transformed.bar, "baz");
  transformed.bar = "qux";
  transformed.foo = "foo:baz";
  t.is(transformed.bar, "qux");
  t.is(transformed.foo, "baz");

  const transformed2 = new TransformedProperty2({
    foo: "foo:foo",
    bar: "bar",
  });
  t.is(transformed2.value.foo, "foo");
  transformed2.value.foo = "foo:bar";
  transformed2.value.bar = "baz";
  t.is(transformed2.value.foo, "bar");
  t.is(transformed2.value.bar, "baz");
  transformed2.value.bar = "qux";
  transformed2.value.foo = "foo:baz";
  t.is(transformed2.value.bar, "qux");
  transformed2.value = { foo: "foo:qux", bar: "quux" };
  t.is(transformed2.value.foo, "qux");
  t.is(transformed2.value.bar, "quux");
  transformed2.value = { foo: "foo:baz", bar: "qux" };
  transformed2.value.bar = "BAR";
  t.is(transformed2.value.foo, "baz");
  t.is(transformed2.value.bar, "BAR");
  transformed2.value = { foo: "foo:FOO", bar: "BARBAR" };
  transformed2.value.foo = "foo:FOOFOO";
  t.is(transformed2.value.foo, "FOOFOO");
  t.is(transformed2.value.bar, "BARBAR");
});

test("validate transformed property error (construct)", (t) => {
  t.throws(() => {
    new TransformedProperty({
      foo: "foo",
      bar: "bar",
    });
  });
  t.throws(() => {
    new TransformedProperty({
      foo: "foo:foo",
      bar: "",
    });
  });
  t.throws(() => {
    new TransformedProperty2({
      foo: "foo",
      bar: "bar",
    });
  });
  t.throws(() => {
    new TransformedProperty2({
      foo: "foo:foo",
      bar: "",
    });
  });
});

test("validate transformed property error (mutation)", (t) => {
  const transformed = new TransformedProperty({
    foo: "foo:foo",
    bar: "bar",
  });
  t.throws(() => {
    transformed.foo = "foo";
  });
  t.throws(() => {
    transformed.bar = "";
  });

  const transformed2 = new TransformedProperty2({
    foo: "foo:foo",
    bar: "bar",
  });
  t.throws(() => {
    transformed2.value.foo = "foo";
  });
  t.throws(() => {
    transformed2.value.bar = "";
  });
});
