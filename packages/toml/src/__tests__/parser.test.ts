/* eslint-disable @typescript-eslint/explicit-member-accessibility,no-console */
import { CstChildrenDictionary, CstNode, CstElement, IToken } from "chevrotain";
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

  visitAll(nodes: CstElement[]) {
    try {
      nodes.forEach(node => {
        this.visit(node as CstNode);
      });
    } catch (err) {
      console.log({ nodes, err });
    }
  }

  toml(ctx: CstChildrenDictionary) {
    this.visitAll(ctx.expression);
  }

  expression(ctx: CstChildrenDictionary) {
    if (ctx.keyValue) {
      this.visitAll(ctx.keyValue);
    } else {
      console.log(ctx);
    }
  }

  comment(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  value(ctx: CstChildrenDictionary) {
    if (ctx.boolean) {
      this.visitAll(ctx.boolean);
    } else {
      console.log(ctx);
    }
  }

  string(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  basicString(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  multilineBasicString(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  literalString(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  multilineLiteralString(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  integer(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  float(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  boolean(ctx: CstChildrenDictionary) {
    if (ctx.True) {
      this.paths.push((ctx.True[0] as IToken).image);
    } else if (ctx.False) {
      this.paths.push((ctx.False[0] as IToken).image);
    } else {
      console.log(ctx);
    }
  }

  datetime(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  arrayValues(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  array(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  simpleKey(ctx: CstChildrenDictionary) {
    if (ctx.UnquotedKey) {
      this.paths.push((ctx.UnquotedKey[0] as any).image);
    } else {
      console.log(ctx);
    }
  }

  dottedKey(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  key(ctx: CstChildrenDictionary) {
    if (ctx.simpleKey) {
      this.visitAll(ctx.simpleKey);
    } else {
      console.log(ctx);
    }
  }

  keyValue(ctx: CstChildrenDictionary) {
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

  stdTable(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  inlineTableKeyValues(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  inlineTable(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  arrayTable(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  table(ctx: CstChildrenDictionary) {
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
      console.log(lex.tokens);
      console.log(parser.errors);
      return toml;
    };

    test("bool", () => {
      const parsed = getFixture("bool");
      visitor.visit(parsed);

      expect(visitor.paths).toEqual(["t", "=", "true", "f", "=", "false"]);
    });
  });
});
