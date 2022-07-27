'use strict';

const {Cli} = require(`./cli`);

const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
} = require(`../constants`);

const [commandUser, userArguments] = process.argv.slice(USER_ARGV_INDEX);

if (userArguments === 0 || !Cli[commandUser]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.ERROR);
}

Cli[commandUser].run(userArguments);
