import { createToken, Lexer } from "chevrotain";
import { build } from "xregexp";

export const fragments: { [name: string]: RegExp } = {};

function REGISTER(name: string, pattern: string) {
  fragments[name] = build(pattern, fragments);
}

function MAKE_PATTERN(pattern: string, flags?: string) {
  return build(pattern, fragments, flags);
}

REGISTER("Whitespace", "[ \\t]");
REGISTER("Newline", "\\n|\\r\\n");
REGISTER("CommentSymbol", "#");
REGISTER("NonAscii", "[\\u{0080}-\\u{D7FF}|\\u{E000}-\\u{FFFF}]");
REGISTER("NonEol", "[\\u{0009}|\\u{0020}-\\u{007F}|\\u{0080}-\\u{D7FF}|\\u{E000}-\\u{FFFF}]");
REGISTER("Comment", "{{CommentSymbol}}{{NonEol}}*");
REGISTER("Alphabet", "[A-Z|a-z]");
REGISTER("DIGIT", "[0-9]");
REGISTER("HEXDIGIT", "[0-9a-fA-F]");
REGISTER("OCTALDIGIT", "[0-7]");
REGISTER("BINARYDIGIT", "[0-1]");
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
REGISTER("MlBasicUnescaped", "[\\u0020-\\u005B|\\u005D-\\u007E]|{{NonAscii}}");
REGISTER("DigitWithUnderscore", "{{DIGIT}}|_{{DIGIT}}");
REGISTER("UnsignedDecimalInteger", "{{DIGIT}}|[1-9]{{DigitWithUnderscore}}+");
REGISTER("HexWithUnderscore", "{{HEXDIGIT}}|_{{HEXDIGIT}}");
REGISTER("OctalWithUnderscore", "{{OCTALDIGIT}}|_{{OCTALDIGIT}}");
REGISTER("BinaryWithUnderscore", "{{BINARYDIGIT}}|_{{BINARYDIGIT}}");
REGISTER("DecimalInteger", "[+-]?{{UnsignedDecimalInteger}}");
REGISTER("ZeroPrefixableInteger", "{{DIGIT}}{{DigitWithUnderscore}}?");
REGISTER("FractionPart", "\\.{{ZeroPrefixableInteger}}+");
REGISTER("Exponential", "e{{ZeroPrefixableInteger}}+");
REGISTER("Year", "{{DIGIT}}{4}");
REGISTER("Month", "{{DIGIT}}{2}");
REGISTER("Day", "{{DIGIT}}{2}");
REGISTER("TimeDelimiter", "[tT ]");
REGISTER("Hour", "{{DIGIT}}{2}");
REGISTER("Minute", "{{DIGIT}}{2}");
REGISTER("Second", "{{DIGIT}}{2}");
REGISTER("SecondFraction", "\\.{{DIGIT}}+");
REGISTER("NumberOffset", "[+-]{{Hour}}:{{Minute}}");
REGISTER("Offset", "Z|{{NumberOffset}}");
REGISTER("PartialTime", "{{Hour}}:{{Minute}}:{{Second}}{{SecondFraction}}?");
REGISTER("FullDate", "{{Year}}-{{Month}}-{{Day}}");
REGISTER("FullTime", "{{PartialTime}}{{Offset}}");
REGISTER("WhitespaceCommentNewline", "({{Whitespace}}|{{Comment}}{{Newline}})+");

/**
 * Whitespace
 *
 * ws = *wschar
 * wschar =  %x20  ; Space
 * wschar =/ %x09  ; Horizontal tab
 */
const Whitespace = createToken({
  name: "Whitespace",
  pattern: MAKE_PATTERN("{{Whitespace}}"),
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
  pattern: MAKE_PATTERN("{{Newline}}"),
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

const Comment = createToken({
  name: "Comment",
  pattern: MAKE_PATTERN("{{Comment}}"),
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

export const Dq = createToken({
  name: "Dq",
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

export const ThreeDq = createToken({
  name: "ThreeDq",
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

export const Sq = createToken({
  name: "Sq",
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

export const ThreeSq = createToken({
  name: "ThreeSq",
  pattern: "'''",
});

export const MultilineLiteralChar = createToken({
  name: "MultilineLiteralChar",
  pattern: MAKE_PATTERN("[\\u0009|\\u0020-\\u007E]|{{NonAscii}}"),
});

/**
 * Integer
 *
 * integer = dec-int / hex-int / oct-int / bin-int
 *
 * minus = %x2D                       ; -
 * plus = %x2B                        ; +
 * underscore = %x5F                  ; _
 * digit1-9 = %x31-39                 ; 1-9
 * digit0-7 = %x30-37                 ; 0-7
 * digit0-1 = %x30-31                 ; 0-1
 *
 * hex-prefix = %x30.78               ; 0x
 * oct-prefix = %x30.6f               ; 0o
 * bin-prefix = %x30.62               ; 0b
 *
 * dec-int = [ minus / plus ] unsigned-dec-int
 * unsigned-dec-int = DIGIT / digit1-9 1*( DIGIT / underscore DIGIT )
 *
 * hex-int = hex-prefix HEXDIG *( HEXDIG / underscore HEXDIG )
 * oct-int = oct-prefix digit0-7 *( digit0-7 / underscore digit0-7 )
 * bin-int = bin-prefix digit0-1 *( digit0-1 / underscore digit0-1 )
 */

export const DecimalInteger = createToken({
  name: "DecimalInteger",
  pattern: MAKE_PATTERN("{{DecimalInteger}}"),
});

export const HexInteger = createToken({
  name: "HexInteger",
  pattern: MAKE_PATTERN("\\b0x{{HEXDIGIT}}{{HexWithUnderscore}}*\\b"),
});

export const OctInteger = createToken({
  name: "OctInteger",
  pattern: MAKE_PATTERN("\\b0o{{OCTALDIGIT}}{{OctalWithUnderscore}}*\\b"),
});

export const BinInteger = createToken({
  name: "BinInteger",
  pattern: MAKE_PATTERN("\\b0b{{BINARYDIGIT}}{{BinaryWithUnderscore}}*\\b"),
});

/**
 * Float
 *
 * float = float-int-part ( exp / frac [ exp ] )
 * float =/ special-float
 *
 * float-int-part = dec-int
 * frac = decimal-point zero-prefixable-int
 * decimal-point = %x2E               ; .
 * zero-prefixable-int = DIGIT *( DIGIT / underscore DIGIT )
 *
 * exp = "e" float-int-part
 *
 * special-float = [ minus / plus ] ( inf / nan )
 * inf = %x69.6e.66  ; inf
 * nan = %x6e.61.6e  ; nan
 */

export const Float = createToken({
  name: "Float",
  pattern: MAKE_PATTERN(
    "{{DecimalInteger}}{{FractionPart}}|{{DecimalInteger}}{{Exponential}}|{{DecimalInteger}}{{FractionPart}}{{Exponential}}"
  ),
});

export const SpecialFloat = createToken({
  name: "SpecialFloat",
  pattern: MAKE_PATTERN("[+-]?(inf|nan)"),
});

/**
 * Boolean
 *
 * boolean = true / false
 *
 * true    = %x74.72.75.65     ; true
 * false   = %x66.61.6C.73.65  ; false
 */

export const True = createToken({
  name: "True",
  pattern: "true",
});

export const False = createToken({
  name: "False",
  pattern: "false",
});

/**
 * Date and Time (as defined in RFC 3339)
 *
 * date-time      = offset-date-time / local-date-time / local-date / local-time
 *
 * date-fullyear  = 4DIGIT
 * date-month     = 2DIGIT  ; 01-12
 * date-mday      = 2DIGIT  ; 01-28, 01-29, 01-30, 01-31 based on month/year
 * time-delim     = "T" / %x20 ; T, t, or space
 * time-hour      = 2DIGIT  ; 00-23
 * time-minute    = 2DIGIT  ; 00-59
 * time-second    = 2DIGIT  ; 00-58, 00-59, 00-60 based on leap second rules
 * time-secfrac   = "." 1*DIGIT
 * time-numoffset = ( "+" / "-" ) time-hour ":" time-minute
 * time-offset    = "Z" / time-numoffset
 *
 * partial-time   = time-hour ":" time-minute ":" time-second [ time-secfrac ]
 * full-date      = date-fullyear "-" date-month "-" date-mday
 * full-time      = partial-time time-offset
 *
 * Offset Date-Time
 *
 * offset-date-time = full-date time-delim full-time
 *
 * Local Date-Time
 *
 * local-date-time = full-date time-delim partial-time
 *
 * Local Date
 *
 * local-date = full-date
 *
 * Local Time
 *
 * local-time = partial-time
 */

export const OffsetDateTime = createToken({
  name: "OffsetDateTime",
  pattern: MAKE_PATTERN("{{FullDate}}{{TimeDelimiter}}{{FullTime}}"),
});

export const LocalDateTime = createToken({
  name: "LocalDateTime",
  pattern: MAKE_PATTERN("{{FullDate}}{{TimeDelimiter}}{{PartialTime}}"),
});

export const LocalDate = createToken({
  name: "LocalDate",
  pattern: MAKE_PATTERN("{{FullDate}}"),
});

export const LocalTime = createToken({
  name: "LocalTime",
  pattern: MAKE_PATTERN("{{PartialTime}}"),
});

/**
 * Array
 *
 * array = array-open [ array-values ] ws-comment-newline array-close
 *
 * array-open =  %x5B ; [
 * array-close = %x5D ; ]
 *
 * array-values =  ws-comment-newline val ws array-sep array-values
 * array-values =/ ws-comment-newline val ws [ array-sep ]
 *
 * array-sep = %x2C  ; , Comma
 *
 * ws-comment-newline = *( wschar / [ comment ] newline )
 */

export const LSquare = createToken({
  name: "LSquare",
  pattern: "[",
});

export const RSquare = createToken({
  name: "RSquare",
  pattern: "]",
});

export const Comma = createToken({
  name: "Comma",
  pattern: ",",
});

export const WhitespaceCommentNewline = createToken({
  name: "WhitespaceCommentNewline",
  pattern: MAKE_PATTERN("{{WhitespaceCommentNewline}}"),
  group: Lexer.SKIPPED,
});

/**
 * Key-Value pairs
 *
 * keyval = key keyval-sep val
 *
 * key = simple-key / dotted-key
 * simple-key = quoted-key / unquoted-key
 *
 * unquoted-key = 1*( ALPHA / DIGIT / %x2D / %x5F ) ; A-Z / a-z / 0-9 / - / _
 * quoted-key = basic-string / literal-string
 * dotted-key = simple-key 1*( dot-sep simple-key )
 *
 * dot-sep   = ws %x2E ws  ; . Period
 * keyval-sep = ws %x3D ws ; =
 */

export const UnquotedKey = createToken({
  name: "UnquotedKey",
  pattern: MAKE_PATTERN("[a-zA-Z0-9_-]+"),
});

export const Dot = createToken({
  name: "Dot",
  pattern: ".",
});

export const Eq = createToken({
  name: "Eq",
  pattern: "=",
});

/**
 * Table
 *
 * table = std-table / array-table
 */

/**
 * Standard Table
 *
 * std-table = std-table-open key std-table-close
 *
 * std-table-open  = %x5B ws     ; [ Left square bracket
 * std-table-close = ws %x5D     ; ] Right square bracket
 */

/**
 * Inline Table
 *
 * inline-table = inline-table-open [ inline-table-keyvals ] inline-table-close
 *
 * inline-table-open  = %x7B ws     ; {
 * inline-table-close = ws %x7D     ; }
 * inline-table-sep   = ws %x2C ws  ; , Comma
 *
 * inline-table-keyvals = key keyval-sep val [ inline-table-sep inline-table-keyvals ]
 */

export const LCurly = createToken({
  name: "LCurly",
  pattern: "{",
});

export const RCurly = createToken({
  name: "RCurly",
  pattern: "}",
});

/**
 * Array Table
 *
 * array-table = array-table-open key array-table-close
 *
 * array-table-open  = %x5B.5B ws  ; [[ Double left square bracket
 * array-table-close = ws %x5D.5D  ; ]] Double right square bracket
 */

export const DoubleLSquare = createToken({
  name: "DoubleLSquare",
  pattern: "[[",
});

export const DoubleRSquare = createToken({
  name: "DoubleRSquare",
  pattern: "]]",
});

export const TOKENS = [
  LSquare,
  RSquare,
  Comma,
  Eq,
  LCurly,
  RCurly,
  DoubleLSquare,
  DoubleRSquare,
  Whitespace,
  Newline,
  Comment,

  // Boolean
  True,
  False,

  // Date and Time
  OffsetDateTime,
  LocalDateTime,
  LocalDate,
  LocalTime,

  // Float
  Float,
  SpecialFloat,

  // Integer
  DecimalInteger,
  HexInteger,
  OctInteger,
  BinInteger,

  // Key
  UnquotedKey,
  Dot,

  // String
  Sq,
  ThreeSq,
  Dq,
  ThreeDq,
  LiteralChar,
  MultilineLiteralChar,
  BasicChar,
  MultilineBasicChar,
];

export const TOMLLexer = new Lexer(TOKENS, { positionTracking: "full" });
