import { CstNode, CstParser, ILexingError, IRecognitionException, IToken } from "chevrotain";
import {
  BasicString,
  BinInteger,
  DecimalInteger,
  HexInteger,
  LiteralString,
  MultilineBasicString,
  MultilineLiteralString,
  OctInteger,
  ThreeDq,
  TOKENS,
  Float,
  SpecialFloat,
  True,
  False,
  OffsetDateTime,
  LocalDateTime,
  LocalDate,
  LocalTime,
  Comma,
  LSquare,
  RSquare,
  UnquotedKey,
  Dot,
  Eq,
  LCurly,
  RCurly,
  DoubleLSquare,
  DoubleRSquare,
  TOMLLexer,
} from "./lexer";

export class TOMLParser extends CstParser {
  public toml!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private expression!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private comment!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private string!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private basicString!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private multilineBasicString!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private literalString!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private multilineLiteralString!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private boolean!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private datetime!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private float!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private integer!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private value!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private arrayValues!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private array!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private simpleKey!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private dottedKey!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private key!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private keyValue!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private inlineTableKeyValues!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private stdTable!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private arrayTable!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private inlineTable!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private table!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;

  constructor() {
    super(TOKENS, {
      ignoredIssues: {
        key: {
          OR: true,
        },
      },
      nodeLocationTracking: "full",
    });

    const $ = this;

    $.RULE("toml", () => {
      $.OPTION(() => {
        $.SUBRULE($.expression);
        $.MANY(() => {
          $.SUBRULE1($.expression);
        });
      });
    });

    $.RULE("expression", () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.comment);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.keyValue);
            $.OPTION(() => {
              $.CONSUME1(Comment);
            });
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.table);
            $.OPTION1(() => {
              $.CONSUME2(Comment);
            });
          },
        },
      ]);
    });

    $.RULE("comment", () => {
      $.CONSUME(Comment);
    });

    // val = string / boolean / array / inline-table / date-time / float / integer
    $.RULE("value", () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.datetime);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.boolean);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.float);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.integer);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.array);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.inlineTable);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.string);
          },
        },
      ]);
    });

    /**
     * String
     *
     * string = ml-basic-string / basic-string / ml-literal-string / literal-string
     */
    $.RULE("string", () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.basicString);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.multilineBasicString);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.literalString);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.multilineLiteralString);
          },
        },
      ]);
    });

    // basic-string = quotation-mark *basic-char quotation-mark
    $.RULE("basicString", () => {
      $.CONSUME(BasicString);
    });

    // ml-basic-string = ml-basic-string-delim ml-basic-body ml-basic-string-delim
    $.RULE("multilineBasicString", () => {
      $.CONSUME(ThreeDq);
      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              $.CONSUME(MultilineBasicString);
            },
          },
        ]);
      });
      $.CONSUME1(ThreeDq);
    });

    // literal-string = apostrophe *literal-char apostrophe
    $.RULE("literalString", () => {
      $.CONSUME(LiteralString);
    });

    // ml-literal-string = ml-literal-string-delim ml-literal-body ml-literal-string-delim
    $.RULE("multilineLiteralString", () => {
      $.CONSUME(MultilineLiteralString);
    });

    /**
     * Integer
     *
     * integer = dec-int / hex-int / oct-int / bin-int
     */
    $.RULE("integer", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(DecimalInteger);
          },
        },
        {
          ALT: () => {
            $.CONSUME(HexInteger);
          },
        },
        {
          ALT: () => {
            $.CONSUME(OctInteger);
          },
        },
        {
          ALT: () => {
            $.CONSUME(BinInteger);
          },
        },
      ]);
    });

    /**
     * Float
     *
     * float = float-int-part ( exp / frac [ exp ] )
     * float =/ special-float
     */
    $.RULE("float", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(Float);
          },
        },
        {
          ALT: () => {
            $.CONSUME(SpecialFloat);
          },
        },
      ]);
    });

    /**
     * Boolean
     *
     * boolean = true / false
     */
    $.RULE("boolean", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(True);
          },
        },
        {
          ALT: () => {
            $.CONSUME(False);
          },
        },
      ]);
    });

    /**
     * Date and Time (as defined in RFC 3339)
     *
     * date-time      = offset-date-time / local-date-time / local-date / local-time
     */
    $.RULE("datetime", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(OffsetDateTime);
          },
        },
        {
          ALT: () => {
            $.CONSUME(LocalDateTime);
          },
        },
        {
          ALT: () => {
            $.CONSUME(LocalDate);
          },
        },
        {
          ALT: () => {
            $.CONSUME(LocalTime);
          },
        },
      ]);
    });

    $.RULE("arrayValues", () => {
      $.SUBRULE($.value);
      $.MANY(() => {
        $.CONSUME(Comma);
        $.SUBRULE($.arrayValues);
      });
    });

    $.RULE("array", () => {
      $.CONSUME(LSquare);
      $.OPTION1(() => {
        $.SUBRULE($.arrayValues);
      });
      $.CONSUME(RSquare);
    });

    $.RULE("simpleKey", () => {
      $.OR2([
        {
          ALT: () => {
            $.SUBRULE($.literalString);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.basicString);
          },
        },
        {
          ALT: () => {
            $.CONSUME(UnquotedKey);
          },
        },
      ]);
    });

    $.RULE("dottedKey", () => {
      $.SUBRULE1($.simpleKey);
      $.MANY(() => {
        $.CONSUME(Dot);
        $.SUBRULE2($.simpleKey);
      });
    });

    $.RULE("key", () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE1($.simpleKey);
          },
        },
        {
          ALT: () => {
            $.SUBRULE1($.dottedKey);
          },
        },
      ]);
    });

    $.RULE("keyValue", () => {
      $.SUBRULE($.key);
      $.CONSUME(Eq);
      $.SUBRULE($.value);
    });

    $.RULE("stdTable", () => {
      $.CONSUME(LSquare);
      $.SUBRULE($.key);
      $.CONSUME(RSquare);
    });

    $.RULE("inlineTableKeyValues", () => {
      $.SUBRULE($.key);
      $.CONSUME(Eq);
      $.SUBRULE($.value);
      $.MANY(() => {
        $.CONSUME(Comma);
        $.SUBRULE($.inlineTableKeyValues);
      });
    });

    $.RULE("inlineTable", () => {
      $.CONSUME(LCurly);
      $.OPTION(() => {
        $.SUBRULE($.inlineTableKeyValues);
      });
      $.CONSUME(RCurly);
    });

    $.RULE("arrayTable", () => {
      $.CONSUME(DoubleLSquare);
      $.SUBRULE($.key);
      $.CONSUME(DoubleRSquare);
    });

    $.RULE("table", () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.stdTable);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.arrayTable);
          },
        },
      ]);
    });

    this.performSelfAnalysis();
  }
}

export interface TOMLParsed {
  toml: CstNode;
  lexerErrors: ILexingError[];
  parserErrors: IRecognitionException[];
  tokens: IToken[];
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
    tokens: lex.tokens,
  };
}
