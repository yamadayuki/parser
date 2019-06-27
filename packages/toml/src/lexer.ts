import { createToken, Lexer } from "chevrotain";
import { build } from "xregexp";

const fragments: { [name: string]: RegExp } = {};

function REGISTER(name: string, pattern: string) {
  fragments[name] = build(pattern, fragments);
}

function MAKE_PATTERN(pattern: string, flags?: string) {
  return build(pattern, fragments, flags);
}

export const Comma = createToken({
  name: "Comma",
  pattern: ",",
});

export const Period = createToken({
  name: "Period",
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

export const True = createToken({
  name: "True",
  pattern: "true",
});

export const False = createToken({
  name: "False",
  pattern: "false",
});

REGISTER("DatePart", "\\d{4}-\\d{2}-\\d{2}");
REGISTER("TimePart", "\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?");

export const DateValue = createToken({
  name: "DateValue",
  pattern: MAKE_PATTERN("{{DatePart}}|{{TimePart}}|{{DatePart}}[T ]{{TimePart}}(?:Z|[+-]\\d{2}:\\d{2})?"),
});

export const BareKey = createToken({
  name: "BareKey",
  pattern: /[0-9a-zA-Z_-]+/,
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
  Period,
  True,
  False,
  DateValue,
  BareKey,
];

export const TOMLLexer = new Lexer(TOKENS, { positionTracking: "full" });
