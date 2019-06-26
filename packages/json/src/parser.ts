import { CstNode, CstParser } from "chevrotain";
import {
  Colon,
  Comma,
  False,
  LCurly,
  LSquare,
  Null,
  NumberLiteral,
  RCurly,
  RSquare,
  StringLiteral,
  TOKENS,
  True,
} from "./lexer";

export class JSONParser extends CstParser {
  public json!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private object!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private array!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private objectItem!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private value!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;

  constructor() {
    super(TOKENS);

    const $ = this;

    $.RULE("json", () => {
      $.OR([
        {
          ALT: () => $.SUBRULE($.object),
        },
        {
          ALT: () => $.SUBRULE($.array),
        },
      ]);
    });

    $.RULE("object", () => {
      $.CONSUME(LCurly);
      $.OPTION(() => {
        $.SUBRULE($.objectItem);
        $.MANY(() => {
          $.CONSUME(Comma);
          $.SUBRULE2($.objectItem);
        });
      });
      $.CONSUME(RCurly);
    });

    $.RULE("objectItem", () => {
      $.CONSUME(StringLiteral);
      $.CONSUME(Colon);
      $.SUBRULE($.value);
    });

    $.RULE("array", () => {
      $.CONSUME(LSquare);
      $.OPTION(() => {
        $.SUBRULE($.value);
        $.MANY(() => {
          $.CONSUME(Comma);
          $.SUBRULE2($.value);
        });
      });
      $.CONSUME(RSquare);
    });

    $.RULE("value", () => {
      $.OR([
        { ALT: () => $.CONSUME(StringLiteral) },
        { ALT: () => $.CONSUME(NumberLiteral) },
        { ALT: () => $.SUBRULE($.object) },
        { ALT: () => $.SUBRULE($.array) },
        { ALT: () => $.CONSUME(True) },
        { ALT: () => $.CONSUME(False) },
        { ALT: () => $.CONSUME(Null) },
      ]);
    });

    this.performSelfAnalysis();
  }
}
