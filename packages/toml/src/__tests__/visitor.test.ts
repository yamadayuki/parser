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
  xtest("bool", () => {
    const { input, expected } = setup("bool");
    const parsed = parse(input);
    expect(parsed.lexerErrors.length).toBe(0);
    expect(parsed.parserErrors.length).toBe(0);
    const visitor = new TOMLVisitor();
    visitor.visit(parsed.toml);
    expect(visitor.result).toMatchObject(expected);
  });

  xtest("empty", () => {
    const { input, expected } = setup("empty");
    const parsed = parse(input);
    expect(parsed.lexerErrors.length).toBe(0);
    expect(parsed.parserErrors.length).toBe(0);
    const visitor = new TOMLVisitor();
    visitor.visit(parsed.toml);
    expect(visitor.result).toMatchObject(expected);
  });

  xtest("float", () => {
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
});
