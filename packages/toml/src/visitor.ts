/* eslint-disable no-console */
import { CstChildrenDictionary, CstElement, CstNode, IToken } from "chevrotain";
import { TOMLParser } from "./parser";

const parser = new TOMLParser();
const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class TOMLVisitor extends BaseCstVisitor {
  public result: any;
  private stack: IToken[];
  private arrayLevel: number = 0;

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
    } else if (ctx.float) {
      this.visitAll(ctx.float);
    } else if (ctx.integer) {
      this.visitAll(ctx.integer);
    } else if (ctx.string) {
      this.visitAll(ctx.string);
    } else if (ctx.array) {
      this.visitAll(ctx.array);
    } else {
      console.log(ctx);
    }
  }

  public string(ctx: CstChildrenDictionary) {
    if (ctx.literalString) {
      this.visitAll(ctx.literalString);
    } else if (ctx.multilineLiteralString) {
      this.visitAll(ctx.multilineLiteralString);
    } else {
      console.log(ctx);
    }
  }

  public basicString(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public multilineBasicString(ctx: CstChildrenDictionary) {
    console.log(ctx);
  }

  public literalString(ctx: CstChildrenDictionary) {
    const currentKey = this.stack.pop();

    if (!currentKey) {
      new Error("Current key is not found");
      return;
    }

    if (ctx.LiteralString) {
      const token = ctx.LiteralString[0] as IToken;
      this.result[currentKey.image] = token.image.slice(1, -1);
    } else {
      console.log(ctx);
    }
  }

  public multilineLiteralString(ctx: CstChildrenDictionary) {
    const currentKey = this.stack.pop();

    if (!currentKey) {
      new Error("Current key is not found");
      return;
    }

    if (ctx.MultilineLiteralString) {
      const token = ctx.MultilineLiteralString[0] as IToken;
      this.result[currentKey.image] = token.image.slice(3, -3).trim();
    } else {
      console.log(ctx);
    }
  }

  public integer(ctx: CstChildrenDictionary) {
    const currentKey = this.stack.pop();

    if (!currentKey) {
      new Error("Current key is not found");
      return;
    }

    if (ctx.DecimalInteger) {
      const token = ctx.DecimalInteger[0] as IToken;
      const integerString = token.image.replace("_", "");
      let i: string | number = parseInt(integerString);
      if (integerString !== i.toString() && integerString !== `+${i.toString()}`) {
        // eslint-disable-next-line no-undef
        i = `${BigInt(integerString).toString()}n`;
      }
      this.result[currentKey.image] = i;
    } else {
      console.log(ctx);
    }
  }

  public float(ctx: CstChildrenDictionary) {
    const currentKey = this.stack.pop();

    if (!currentKey) {
      new Error("Current key is not found");
      return;
    }

    if (ctx.Float) {
      const token = ctx.Float[0] as IToken;
      const floatString = token.image.replace("_", "");
      const f = parseFloat(floatString);
      this.result[currentKey.image] = f;
    } else {
      console.log(ctx);
    }
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
    if (ctx.value) {
      this.visitAll(ctx.value);
    } else {
      console.log(ctx);
    }
  }

  public array(ctx: CstChildrenDictionary) {
    const currentKey = this.stack.pop();

    if (!currentKey) {
      new Error("Current key is not found");
      return;
    }

    const l = ctx.LSquare[0] as IToken;
    const r = ctx.RSquare[0] as IToken;

    if (!l || !r) {
      throw new Error(`unexpected lexing: LSquare: ${l}, RSquare: ${r}`);
    }

    if (ctx.arrayValues) {
      this.arrayLevel += 1;

      this.stack.push(currentKey);
      this.visitAll(ctx.arrayValues);
    } else {
      // This pattern is the empty array
    }

    this.arrayLevel -= 1;

    if (this.result[currentKey.image]) {
      this.result[currentKey.image] = [this.result[currentKey.image]];
    } else {
      this.result[currentKey.image] = [];
    }

    if (this.arrayLevel < 0) {
      this.stack.pop();
    }
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
