import { ILexerConfig, Lexer } from "chevrotain";
import {
  Comma,
  KeyValueSeparator,
  TableSeparator,
  CommentStart,
  Dq,
  Sq,
  InlineTableStart,
  InlineTableEnd,
  TOMLLexer,
  LSquare,
  RSquare,
} from "../lexer";

const lexerOption: ILexerConfig = { positionTracking: "onlyOffset" };

describe("token", () => {
  test("Comma", () => {
    const text = ",";

    const lexer = new Lexer([Comma], lexerOption);
    expect(lexer.tokenize(text).tokens).toMatchSnapshot();
  });

  test("TableSeparator", () => {
    const text = ".";

    const lexer = new Lexer([TableSeparator], lexerOption);
    expect(lexer.tokenize(text).tokens).toMatchSnapshot();
  });

  test("KeyValueSeparator", () => {
    const text = "=";

    const lexer = new Lexer([KeyValueSeparator], lexerOption);
    expect(lexer.tokenize(text).tokens).toMatchSnapshot();
  });

  test("LSquare", () => {
    const text = "[";

    const lexer = new Lexer([LSquare], lexerOption);
    expect(lexer.tokenize(text).tokens).toMatchSnapshot();
  });

  test("RSquare", () => {
    const text = "]";

    const lexer = new Lexer([RSquare], lexerOption);
    expect(lexer.tokenize(text).tokens).toMatchSnapshot();
  });

  test("CommentStart", () => {
    const text = "#";

    const lexer = new Lexer([CommentStart], lexerOption);
    expect(lexer.tokenize(text).tokens).toMatchSnapshot();
  });

  test("Dq", () => {
    const text = '"';

    const lexer = new Lexer([Dq], lexerOption);
    expect(lexer.tokenize(text).tokens).toMatchSnapshot();
  });

  test("Sq", () => {
    const text = "'";

    const lexer = new Lexer([Sq], lexerOption);
    expect(lexer.tokenize(text).tokens).toMatchSnapshot();
  });

  test("InlineTableStart", () => {
    const text = "{";

    const lexer = new Lexer([InlineTableStart], lexerOption);
    expect(lexer.tokenize(text).tokens).toMatchSnapshot();
  });

  test("InlineTableEnd", () => {
    const text = "}";

    const lexer = new Lexer([InlineTableEnd], lexerOption);
    expect(lexer.tokenize(text).tokens).toMatchSnapshot();
  });

  test("TOMLLexer", () => {
    const input = `
plain = 1
with.dot = 2
"double.quoted" = 3

[table]
plain = 1
with.dot = 2
"double.quoted" = 3
`;
    expect(TOMLLexer.tokenize(input).tokens).toMatchSnapshot();
  });
});
