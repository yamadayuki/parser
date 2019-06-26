import { CstParser, CstNode } from "chevrotain";
import { TOKENS, LSquare, RSquare } from "./lexer";

export class TOMLParser extends CstParser {
  public toml!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private comment!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private table!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;
  private keyValue!: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode;

  constructor() {
    super(TOKENS);

    const $ = this;

    $.RULE("toml", () => {
      $.OR([
        // { ALT: () => $.SUBRULE($.comment) },
        { ALT: () => $.SUBRULE($.table) },
        // { ALT: () => $.SUBRULE($.keyValue) },
      ]);
    });

    $.RULE("table", () => {
      let isArrayTable = false;
      $.CONSUME(LSquare); // [ table lsquare

      $.OPTION(() => {
        $.CONSUME1(LSquare); // [ table lsquare and the above is array table lsquare
        isArrayTable = true;
      });

      $.OPTION1({
        GATE: () => isArrayTable,
        DEF: () => {
          $.CONSUME1(RSquare); // ] table rsquare and the below is array table rsquare
        },
      });

      $.CONSUME(RSquare); // ]  table rsquare
    });

    this.performSelfAnalysis();
  }
}
