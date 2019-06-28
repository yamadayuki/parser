import { TOMLLexer } from "./lexer";
import { TOMLParser } from "./parser";
import { CstNode, ILexingError, IRecognitionException } from "chevrotain";

export * from "./lexer";
export * from "./parser";

interface TOMLParsed {
  toml: CstNode;
  lexerErrors: ILexingError[];
  parserErrors: IRecognitionException[];
}

export function parse(text: string): TOMLParsed {
  const parser = new TOMLParser();

  const lex = TOMLLexer.tokenize(text);
  parser.input = lex.tokens;
  const toml = parser.toml();

  return {
    toml,
    lexerErrors: lex.errors,
    parserErrors: parser.errors,
  };
}

export function toJSON(parsed: TOMLParsed) {
  // eslint-disable-next-line no-console
  console.log(parsed);
}
