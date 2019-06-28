/* eslint-disable no-console */
import { readFileSync } from "fs";
import { resolve } from "path";
import { parse } from "../parser";
import { TOMLVisitor } from "../visitor";

export const getFixtureInput = (name: string) => {
  return readFileSync(resolve(__dirname, "__fixtures__", "valid", `${name}.toml`)).toString();
};

export const getExpectedObject = (name: string) => {
  return JSON.parse(readFileSync(resolve(__dirname, "__fixtures__", "valid", `${name}.json`)).toString());
};

export const setup = (name: string) => ({
  input: getFixtureInput(name),
  expected: getExpectedObject(name),
});

describe("visitor", () => {
  xtest("empty", () => {
    const { input, expected } = setup("empty");
    const parsed = parse(input);
    expect(parsed.lexerErrors.length).toBe(0);
    expect(parsed.parserErrors.length).toBe(0);
    const visitor = new TOMLVisitor();
    visitor.visit(parsed.toml);
    expect(visitor.result).toMatchObject(expected);
  });

  test("bool", () => {
    const { input, expected } = setup("bool");
    const parsed = parse(input);
    expect(parsed.lexerErrors.length).toBe(0);
    expect(parsed.parserErrors.length).toBe(0);
    const visitor = new TOMLVisitor();
    visitor.visit(parsed.toml);
    expect(visitor.result).toMatchObject(expected);
  });

  test("float", () => {
    const { input, expected } = setup("float");
    const parsed = parse(input);
    expect(parsed.lexerErrors.length).toBe(0);
    expect(parsed.parserErrors.length).toBe(0);
    const visitor = new TOMLVisitor();
    visitor.visit(parsed.toml);
    expect(visitor.result).toMatchObject(expected);
  });

  test("float-underscore", () => {
    const { input, expected } = setup("float-underscore");
    const parsed = parse(input);
    expect(parsed.lexerErrors.length).toBe(0);
    expect(parsed.parserErrors.length).toBe(0);
    const visitor = new TOMLVisitor();
    visitor.visit(parsed.toml);
    expect(visitor.result).toMatchObject(expected);
  });

  test("float-exponent", () => {
    const { input, expected } = setup("float-exponent");
    const parsed = parse(input);
    if (parsed.lexerErrors.length > 0) {
      console.log(parsed.lexerErrors);
    }
    expect(parsed.lexerErrors.length).toBe(0);
    if (parsed.parserErrors.length > 0) {
      console.log(parsed.parserErrors);
      console.log(parsed.tokens);
    }
    expect(parsed.parserErrors.length).toBe(0);
    const visitor = new TOMLVisitor();
    visitor.visit(parsed.toml);
    expect(visitor.result).toMatchObject(expected);
  });

  test("exponent-float-part", () => {
    const { input, expected } = setup("exponent-float-part");
    const parsed = parse(input);
    if (parsed.lexerErrors.length > 0) {
      console.log(parsed.lexerErrors);
    }
    expect(parsed.lexerErrors.length).toBe(0);
    if (parsed.parserErrors.length > 0) {
      console.log(parsed.parserErrors);
      console.log(parsed.tokens);
    }
    expect(parsed.parserErrors.length).toBe(0);
    const visitor = new TOMLVisitor();
    visitor.visit(parsed.toml);
    expect(visitor.result).toMatchObject(expected);
  });

  test("integer", () => {
    const { input, expected } = setup("integer");
    const parsed = parse(input);
    if (parsed.lexerErrors.length > 0) {
      console.log(parsed.lexerErrors);
    }
    expect(parsed.lexerErrors.length).toBe(0);
    if (parsed.parserErrors.length > 0) {
      console.log(parsed.parserErrors);
      console.log(parsed.tokens);
    }
    expect(parsed.parserErrors.length).toBe(0);
    const visitor = new TOMLVisitor();
    visitor.visit(parsed.toml);
    expect(visitor.result).toMatchObject(expected);
  });

  test("integer-underscore", () => {
    const { input, expected } = setup("integer-underscore");
    const parsed = parse(input);
    if (parsed.lexerErrors.length > 0) {
      console.log(parsed.lexerErrors);
    }
    expect(parsed.lexerErrors.length).toBe(0);
    if (parsed.parserErrors.length > 0) {
      console.log(parsed.parserErrors);
      console.log(parsed.tokens);
    }
    expect(parsed.parserErrors.length).toBe(0);
    const visitor = new TOMLVisitor();
    visitor.visit(parsed.toml);
    expect(visitor.result).toMatchObject(expected);
  });
});
