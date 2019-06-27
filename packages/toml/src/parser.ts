import { CstParser, CstNode } from "chevrotain";
import { TOKENS, LSquare, RSquare, BareKey, Period, KeyValueSeparator, True, False, DateValue } from "./lexer";

export class TOMLParser extends CstParser {
  public toml!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private table!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private tableName!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private bareTableName!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private keyValue!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private value!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;

  constructor() {
    super(TOKENS);

    const $ = this;

    $.RULE("toml", () => {
      $.MANY(() => {
        $.OR([
          // { ALT: () => { $.SUBRULE($.comment) } },
          {
            ALT: () => {
              $.SUBRULE($.table);
            },
          },
          {
            ALT: () => {
              $.SUBRULE($.keyValue);
            },
          },
        ]);
      });
    });

    $.RULE("table", () => {
      let isArrayTable = false;
      $.CONSUME(LSquare); // [ table lsquare

      $.OPTION(() => {
        $.CONSUME1(LSquare); // [ table lsquare and the above is array table lsquare
        isArrayTable = true;
      });

      $.SUBRULE($.tableName); // tableName

      $.OPTION1({
        GATE: () => isArrayTable,
        DEF: () => {
          $.CONSUME1(RSquare); // ] table rsquare and the below is array table rsquare
        },
      });

      $.CONSUME(RSquare); // ]  table rsquare
    });

    $.RULE("tableName", () => {
      $.SUBRULE($.bareTableName);
      $.MANY(() => {
        $.CONSUME(Period);
        $.SUBRULE1($.bareTableName);
      });
    });

    $.RULE("bareTableName", () => {
      $.CONSUME(BareKey);
    });

    $.RULE("keyValue", () => {
      $.CONSUME(BareKey);
      $.CONSUME(KeyValueSeparator);
      $.SUBRULE($.value);
    });

    $.RULE("value", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(DateValue);
          },
        },
        {
          ALT: () => {
            $.OR1([
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
          },
        },
      ]);
    });

    this.performSelfAnalysis();
  }
}
