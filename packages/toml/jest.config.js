/* eslint-disable @typescript-eslint/no-var-requires */
const base = require("../../jest.config");
const packageJson = require("./package.json");

module.exports = {
  ...base,
  displayName: packageJson.name,
};
