import { createToken, Lexer } from "chevrotain";

export const Comma = createToken({
  name: "Comma",
  pattern: ",",
});

export const TableSeparator = createToken({
  name: "TableSeparator",
  pattern: ".",
});

export const KeyValueSeparator = createToken({
  name: "KeyValueSeparator",
  pattern: "=",
});

// table{Start,End} / arrayTable{Start,End} / array{Start,End}
export const LSquare = createToken({
  name: "LSquare",
  pattern: "[",
});

export const RSquare = createToken({
  name: "RSquare",
  pattern: "]",
});

export const CommentStart = createToken({
  name: "CommentStart",
  pattern: "#",
});

// string{Start,End}
export const Dq = createToken({
  name: "Dq",
  pattern: '"',
});

export const Sq = createToken({
  name: "Sq",
  pattern: "'",
});

export const InlineTableStart = createToken({
  name: "InlineTableStart",
  pattern: "{",
});

export const InlineTableEnd = createToken({
  name: "InlineTableEnd",
  pattern: "}",
});

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t]+/,
  group: Lexer.SKIPPED,
});

export const LineTerminator = createToken({
  name: "LineTerminator",
  pattern: /\n\r|\n|\r/,
  group: Lexer.SKIPPED,
});

export const TOKENS = [
  WhiteSpace,
  LineTerminator,
  CommentStart,
  Dq,
  Sq,
  LSquare,
  RSquare,
  InlineTableStart,
  InlineTableEnd,
  Comma,
  KeyValueSeparator,
  TableSeparator,
];

export const TOMLLexer = new Lexer(TOKENS, { positionTracking: "full" });
