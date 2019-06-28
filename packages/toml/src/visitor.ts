/* eslint-disable no-console */
import { CstChildrenDictionary, CstElement, CstNode } from "chevrotain";
import { TOMLParser } from "./parser";

const parser = new TOMLParser();
const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class TOMLVisitor extends BaseCstVisitor {
  public result: any;

  constructor() {
    super();
    this.result = {};
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
    console.log(ctx);
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
    console.log(ctx);
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
    console.log(ctx);
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
