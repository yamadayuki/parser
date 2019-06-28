import { CstNode, CstParser } from "chevrotain";
import {
  BasicChar,
  Dq,
  LiteralChar,
  MultilineBasicChar,
  MultilineLiteralChar,
  Newline,
  Sq,
  ThreeDq,
  ThreeSq,
  TOKENS,
} from "./lexer";

export class TOMLParser extends CstParser {
  public toml!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private expression!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private basicString!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private multilineBasicString!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private literalString!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private multilineLiteralString!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;

  constructor() {
    super(TOKENS);

    const $ = this;

    $.RULE("toml", () => {
      $.MANY(() => {
        $.SUBRULE($.expression);
      });
    });

    $.RULE("expression", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(Comment);
          },
        },
        // {
        //   ALT: () => {
        //     $.SUBRULE($.keyValue);
        //     $.OPTION(() => {
        //       $.CONSUME(Comment);
        //     });
        //   },
        // },
        // {
        //   ALT: () => {
        //     $.SUBRULE($.table);
        //     $.OPTION(() => {
        //       $.CONSUME(Comment);
        //     });
        //   },
        // },
      ]);
    });

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

    $.RULE("basicString", () => {
      $.CONSUME(Dq);
      $.MANY(() => {
        $.CONSUME(BasicChar);
      });
      $.CONSUME1(Dq);
    });

    $.RULE("multilineBasicString", () => {
      $.CONSUME(ThreeDq);
      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              $.CONSUME(MultilineBasicChar);
            },
          },
          {
            ALT: () => {
              $.CONSUME(Newline);
            },
          },
        ]);
      });
      $.CONSUME1(ThreeDq);
    });

    $.RULE("literalString", () => {
      $.CONSUME(Sq);
      $.MANY(() => {
        $.CONSUME(LiteralChar);
      });
      $.CONSUME1(Sq);
    });

    $.RULE("multilineLiteralString", () => {
      $.CONSUME(ThreeSq);
      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              $.CONSUME(MultilineLiteralChar);
            },
          },
          {
            ALT: () => {
              $.CONSUME(Newline);
            },
          },
        ]);
      });
      $.CONSUME1(ThreeSq);
    });

    this.performSelfAnalysis();
  }
}
