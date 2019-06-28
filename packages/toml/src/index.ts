import { TOMLLexer } from "./lexer";
import { TOMLParser } from "./parser";

export * from "./lexer";
export * from "./parser";

export function parse(text: string) {
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
