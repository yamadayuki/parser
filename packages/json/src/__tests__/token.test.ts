import { Lexer, ILexerConfig } from "chevrotain";
import {
  True,
  False,
  Null,
  LCurly,
  RCurly,
  LSquare,
  RSquare,
  Comma,
  Colon,
  StringLiteral,
  NumberLiteral,
  WhiteSpace,
} from "../token";

const lexerOption: ILexerConfig = { positionTracking: "onlyOffset" };

describe("token", () => {
  test("true", () => {
    const trueLexer = new Lexer([True], lexerOption);
    expect(trueLexer.tokenize("true").tokens).toMatchSnapshot();
  });

  test("false", () => {
    const falseLexer = new Lexer([False], lexerOption);
    expect(falseLexer.tokenize("false").tokens).toMatchSnapshot();
  });

  test("null", () => {
    const nullLexer = new Lexer([Null], lexerOption);
    expect(nullLexer.tokenize("null").tokens).toMatchSnapshot();
  });

  test("LCurly", () => {
    const lCurlyLexer = new Lexer([LCurly], lexerOption);
    expect(lCurlyLexer.tokenize("{").tokens).toMatchSnapshot();
  });

  test("RCurly", () => {
    const rCurlyLexer = new Lexer([RCurly], lexerOption);
    expect(rCurlyLexer.tokenize("}").tokens).toMatchSnapshot();
  });

  test("LSquare", () => {
    const lSquareLexer = new Lexer([LSquare], lexerOption);
    expect(lSquareLexer.tokenize("[").tokens).toMatchSnapshot();
  });

  test("RSquare", () => {
    const rSquareLexer = new Lexer([RSquare], lexerOption);
    expect(rSquareLexer.tokenize("]").tokens).toMatchSnapshot();
  });

  test("Comma", () => {
    const commaLexer = new Lexer([Comma], lexerOption);
    expect(commaLexer.tokenize(",").tokens).toMatchSnapshot();
  });

  test("Colon", () => {
    const colonLexer = new Lexer([Colon], lexerOption);
    expect(colonLexer.tokenize(":").tokens).toMatchSnapshot();
  });

  test("StringLiteral", () => {
    const stringLiteralLexer = new Lexer([StringLiteral], lexerOption);
    expect(stringLiteralLexer.tokenize('"foo"').tokens).toMatchSnapshot();
  });

  test("NumberLiteral", () => {
    const numberLiteralLexer = new Lexer([NumberLiteral], lexerOption);
    expect(numberLiteralLexer.tokenize("123").tokens).toMatchSnapshot();
  });

  test("WhiteSpace", () => {
    const whiteSpaceLexer = new Lexer([WhiteSpace], lexerOption);
    expect(whiteSpaceLexer.tokenize("\t").tokens).toMatchSnapshot();
  });
});
