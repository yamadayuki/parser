/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");
const { createSyntaxDiagramsCode } = require("chevrotain");
const { TOMLParser } = require(path.resolve(`${__dirname}/../lib/parser`));

const parser = new TOMLParser();
const serializedGrammar = parser.getSerializedGastProductions();
const htmlText = createSyntaxDiagramsCode(serializedGrammar);
const outPath = path.resolve(__dirname, "./");
fs.writeFileSync(`${outPath}/generated_diagrams.html`, htmlText);
