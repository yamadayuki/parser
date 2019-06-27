/* eslint-disable no-console */
import { CstChildrenDictionary, CstNode } from "chevrotain";
import { readFileSync } from "fs";
import { resolve } from "path";
import { TOMLLexer } from "../lexer";
import { TOMLParser } from "../parser";

const parser = new TOMLParser();
const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class TOMLVisitor extends BaseCstVisitor {
  public paths: string[];

  constructor() {
    super();
    this.paths = [];
    this.validateVisitor();
  }

  public toml(ctx: CstChildrenDictionary) {
    Object.values(ctx).forEach(arr =>
      arr.forEach(el => {
        this.visit(el as CstNode);
      })
    );
  }

  public table(ctx: any) {
    console.log(ctx);
  }

  public tableName(ctx: any) {
    console.log(ctx);
  }

  public bareTableName(ctx: any) {
    console.log(ctx);
  }

  public keyValue(ctx: any) {
    this.paths.push(ctx.BareKey[0].image);
    this.paths.push(ctx.KeyValueSeparator[0].image);
    Object.values(ctx.value).forEach(el => {
      this.visit(el as CstNode);
    });
  }

  public value(ctx: any) {
    if (ctx.True && ctx.True.length > 0) {
      this.paths.push(ctx.True[0].image);
    }
    if (ctx.False && ctx.False.length > 0) {
      this.paths.push(ctx.False[0].image);
    }
  }
}

const visitor = new TOMLVisitor();

describe("TOMLParser", () => {
  describe("valid", () => {
    const getFixture = (name: string) => {
      const input = readFileSync(resolve(__dirname, "__fixtures__", "valid", `${name}.toml`)).toString();
      const lex = TOMLLexer.tokenize(input);
      parser.input = lex.tokens;
      return parser.toml();
    };

    test("bool", () => {
      const parsed = getFixture("bool");
      visitor.visit(parsed);

      expect(visitor.paths).toEqual(["t", "=", "true", "f", "=", "false"]);
    });
  });
});
