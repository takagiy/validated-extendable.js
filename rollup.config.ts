import resolve from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import { defineConfig } from "rollup";

export default defineConfig([
  {
    input: "src/index.ts",
    plugins: [
      swc({
        swc: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
            target: "es2015",
          },
          isModule: true,
        },
      }),
      resolve(),
    ],
    external: ["zod"],
    output: [
      {
        file: "dist/cjs/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/esm/index.js",
        format: "esm",
        sourcemap: true,
      },
    ],
  },
]);
