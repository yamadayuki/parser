import { parse } from "..";

describe("parse", () => {
  test("returns the result of parsing json string", () => {
    const result = parse('{ "foo": 1 }');
    expect(result.lexerErrors).toEqual([]);
    expect(result.parserErrors).toEqual([]);
    expect(result.json).toMatchSnapshot();
  });
});
