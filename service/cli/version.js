'use strict';

const path = require(`path`);
const chalk = require(`chalk`);
const packageJsonFile = require(path.resolve(`./package.json`));

module.exports = {
  name: `--version`,
  run: () => {
    return console.info(chalk.blue(packageJsonFile.version));
  }
};
