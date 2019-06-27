import { createToken, Lexer } from "chevrotain";
import { build } from "xregexp";

const fragments: { [name: string]: RegExp } = {};

function REGISTER(name: string, pattern: string) {
  fragments[name] = build(pattern, fragments);
}

function MAKE_PATTERN(pattern: string, flags?: string) {
  return build(pattern, fragments, flags);
}

REGISTER("Alphabet", "[A-Z|a-z]");
REGISTER("DIGIT", "[0-9]");
REGISTER("HEXDIGIT", "[0-9a-fA-F]");

/**
 * Whitespace
 *
 * ws = *wschar
 * wschar =  %x20  ; Space
 * wschar =/ %x09  ; Horizontal tab
 */
const Whitespace = createToken({
  name: "Whitespace",
  pattern: /[ \t]/, // Space / Horizontal tab
  group: Lexer.SKIPPED,
});

/**
 * Newline
 *
 * newline =  %x0A     ; LF
 * newline =/ %x0D.0A  ; CRLF
 */
export const Newline = createToken({
  name: "Newline",
  pattern: /\n|\r\n/, // LF / CRLF
});

/**
 * Comment
 *
 * comment-start-symbol = %x23 ; #
 * non-ascii = %x80-D7FF / %xE000-10FFFF
 * non-eol = %x09 / %x20-7F / non-ascii
 *
 * comment = comment-start-symbol *non-eol
 */

REGISTER("CommentSymbol", "#");
REGISTER("NonAscii", "[\\u{0080}-\\u{D7FF}|\\u{E000}-\\u{FFFF}]");
REGISTER("NonEol", "[\\u{0009}|\\u{0020}-\\u{007F}|\\u{0080}-\\u{D7FF}|\\u{E000}-\\u{FFFF}]");

const Comment = createToken({
  name: "Comment",
  pattern: MAKE_PATTERN("{{CommentSymbol}}{{NonEol}}*"),
});

/**
 * String
 *
 * string = ml-basic-string / basic-string / ml-literal-string / literal-string
 */

/**
 * Basic String
 *
 * basic-string = quotation-mark *basic-char quotation-mark
 *
 * quotation-mark = %x22            ; "
 *
 * basic-char = basic-unescaped / escaped
 * basic-unescaped = %x20-21 / %x23-5B / %x5D-7E / non-ascii
 * escaped = escape escape-seq-char
 *
 * escape = %x5C                   ; \
 * escape-seq-char =  %x22         ; "    quotation mark  U+0022
 * escape-seq-char =/ %x5C         ; \    reverse solidus U+005C
 * escape-seq-char =/ %x62         ; b    backspace       U+0008
 * escape-seq-char =/ %x66         ; f    form feed       U+000C
 * escape-seq-char =/ %x6E         ; n    line feed       U+000A
 * escape-seq-char =/ %x72         ; r    carriage return U+000D
 * escape-seq-char =/ %x74         ; t    tab             U+0009
 * escape-seq-char =/ %x75 4HEXDIG ; uXXXX                U+XXXX
 * escape-seq-char =/ %x55 8HEXDIG ; UXXXXXXXX            U+XXXXXXXX
 */

REGISTER(
  "BasicUnescaped",
  "[\\u{0020}-\\u{0021}|\\u{0023}-\\u{005B}|\\u{005D}-\\u{007E}|\\u{0080}-\\u{D7FF}|\\u{E000}-\\u{FFFF}]"
);
REGISTER("Escape", "\\\\"); // \
REGISTER("EscapeSequenceChars", '["\\\\bfnrt|\\u{0000}-\\u{FFFF}]');
REGISTER("Escaped", "{{Escape}}{{EscapeSequenceChars}}");
REGISTER(
  "BasicChar",
  '[\\u0020-\\u0021]|[\\u0023-\\u005b]|[\\u005d-\\u007e]|[\\u0080-\\ud7ff]|[\\ue000-\\uffff]|\\\\["\\\\bfnrt|\\u0000-\\uffff]'
);

export const QuotationMark = createToken({
  name: "QuotationMark",
  pattern: '"',
});

export const BasicChar = createToken({
  name: "BasicChar",
  pattern: MAKE_PATTERN("{{BasicChar}}"),
});

/**
 * Multiline Basic String
 *
 * ml-basic-string = ml-basic-string-delim ml-basic-body ml-basic-string-delim
 *
 * ml-basic-string-delim = 3quotation-mark
 *
 * ml-basic-body = *( ml-basic-char / newline / ( escape ws newline ) )
 * ml-basic-char = ml-basic-unescaped / escaped
 * ml-basic-unescaped = %x20-5B / %x5D-7E / non-ascii
 */

REGISTER("MlBasicUnescaped", "[\\u0020-\\u005B|\\u005D-\\u007E]|{{NonAscii}}");

export const ThreeQuotationMark = createToken({
  name: "ThreeQuotationMark",
  pattern: '"""',
});

export const MultilineBasicChar = createToken({
  name: "MultilineBasicChar",
  pattern: MAKE_PATTERN("{{MlBasicUnescaped}}|{{Escaped}}"),
});

/**
 * Literal String
 *
 * literal-string = apostrophe *literal-char apostrophe
 *
 * apostrophe = %x27 ; ' apostrophe
 *
 * literal-char = %x09 / %x20-26 / %x28-7E / non-ascii
 */

export const Apostrophe = createToken({
  name: "Apostrophe",
  pattern: "'",
});

export const LiteralChar = createToken({
  name: "LiteralChar",
  pattern: MAKE_PATTERN("[\\u0009|\\u0020-\\u0026|\\u0028-\\u007E]|{{NonAscii}}"),
});

/**
 * Multiline Literal String
 *
 * ml-literal-string = ml-literal-string-delim ml-literal-body ml-literal-string-delim
 *
 * ml-literal-string-delim = 3apostrophe
 *
 * ml-literal-body = *( ml-literal-char / newline )
 * ml-literal-char = %x09 / %x20-7E / non-ascii
 */

export const ThreeApostrophe = createToken({
  name: "ThreeApostrophe",
  pattern: "'''",
});

export const MultilineLiteralChar = createToken({
  name: "MultilineLiteralChar",
  pattern: MAKE_PATTERN("[\\u0009|\\u0020-\\u007E]|{{NonAscii}}"),
});

export const TOKENS = [
  Apostrophe,
  ThreeApostrophe,
  QuotationMark,
  ThreeQuotationMark,
  LiteralChar,
  MultilineLiteralChar,
  BasicChar,
  MultilineBasicChar,
  Comment,
  Whitespace,
  Newline,
];

export const TOMLLexer = new Lexer(TOKENS, { positionTracking: "full" });
