/* eslint-disable no-console */
import { CstChildrenDictionary, CstElement, CstNode, IToken } from "chevrotain";
import { TOMLParser } from "./parser";

const parser = new TOMLParser();
const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class TOMLVisitor extends BaseCstVisitor {
  public result: any;
  private stack: IToken[];

  constructor() {
    super();
    this.result = {};
    this.validateVisitor();
    this.stack = [];
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
    const currentKey = this.stack.pop();

    if (!currentKey) {
      new Error("Current key is not found");
      return;
    }

    if (ctx.True) {
      this.result[currentKey.image] = true;
    } else if (ctx.False) {
      this.result[currentKey.image] = false;
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
      const key = ctx.UnquotedKey[0] as IToken;
      this.result[key.image] = null;
      this.stack.push(key);
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
