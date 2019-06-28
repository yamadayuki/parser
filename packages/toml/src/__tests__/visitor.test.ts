import { readFileSync } from "fs";
import { resolve } from "path";
import { parse } from "../parser";

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
  test("bool", () => {
    const { input } = setup("bool");
    const parsed = parse(input);
    expect(parsed.lexerErrors.length).toBe(0);
    expect(parsed.parserErrors.length).toBe(0);
  });
});
