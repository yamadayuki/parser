import { JSONLexer } from "./lexer";
import { JSONParser } from "./parser";

export * from "./lexer";
export * from "./parser";

export function parse(text: string) {
  const parser = new JSONParser();

  const lex = JSONLexer.tokenize(text);
  parser.input = lex.tokens;
  const json = parser.json();

  return {
    json,
    lexerErrors: lex.errors,
    parserErrors: parser.errors,
  };
}
