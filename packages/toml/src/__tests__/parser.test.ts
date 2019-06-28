/* eslint-disable @typescript-eslint/explicit-member-accessibility,no-console */
import { readFileSync } from "fs";
import { resolve } from "path";
import { TOMLLexer } from "../lexer";
import { TOMLParser } from "../parser";
import { CstElement, CstNode, CstChildrenDictionary, IToken } from "chevrotain";

const parser = new TOMLParser();
const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class TOMLVisitor extends BaseCstVisitor {
  public paths: string[];

  constructor() {
    super();
    this.paths = [];
    this.validateVisitor();
  }

  public visitAll(nodes: CstElement[]) {
    try {
      nodes.forEach(node => {
        this.visit(node as CstNode);
      });
    } catch (err) {
      console.log({ nodes, err });
    }
  }

  public toml(ctx: CstChildrenDictionary) {
    this.visitAll(ctx.expression);
  }

  public expression(ctx: CstChildrenDictionary) {
    if (ctx.keyValue) {
      this.visitAll(ctx.keyValue);
    } else {
      console.log(ctx);
    }
  }

  public comment(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public value(ctx: CstChildrenDictionary) {
    if (ctx.boolean) {
      this.visitAll(ctx.boolean);
    } else {
      console.log(ctx);
    }
  }

  public string(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public basicString(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public multilineBasicString(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public literalString(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public multilineLiteralString(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public integer(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public float(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public boolean(ctx: CstChildrenDictionary) {
    if (ctx.True) {
      this.paths.push((ctx.True[0] as IToken).image);
    } else if (ctx.False) {
      this.paths.push((ctx.False[0] as IToken).image);
    } else {
      console.log(ctx);
    }
  }

  public datetime(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public arrayValues(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public array(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public simpleKey(ctx: CstChildrenDictionary) {
    if (ctx.UnquotedKey) {
      this.paths.push((ctx.UnquotedKey[0] as any).image);
    } else {
      console.log(ctx);
    }
  }

  public dottedKey(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public key(ctx: CstChildrenDictionary) {
    if (ctx.simpleKey) {
      this.visitAll(ctx.simpleKey);
    } else {
      console.log(ctx);
    }
  }

  public keyValue(ctx: CstChildrenDictionary) {
    if (ctx.key) {
      this.visitAll(ctx.key);
    }
    if (ctx.Eq) {
      this.paths.push((ctx.Eq[0] as any).image);
    }
    if (ctx.value) {
      this.visitAll(ctx.value);
    }
  }

  public stdTable(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public inlineTableKeyValues(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public inlineTable(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public arrayTable(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public table(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }
}

const visitor = new TOMLVisitor();

describe("TOMLParser", () => {
  describe("valid", () => {
    const getFixture = (name: string) => {
      const input = readFileSync(resolve(__dirname, "__fixtures__", "valid", `${name}.toml`)).toString();
      const lex = TOMLLexer.tokenize(input);
      parser.input = lex.tokens;
      const toml = parser.toml();
      return toml;
    };

    test("bool", () => {
      const parsed = getFixture("bool");
      visitor.visit(parsed);

      expect(visitor.paths).toEqual(["t", "=", "true", "f", "=", "false"]);
    });
  });
});
