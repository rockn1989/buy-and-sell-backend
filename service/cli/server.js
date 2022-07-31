"use strict";

const express = require(`express`);
const { createServer } = require(`http`);
const socket = require(`../lib/socket`);
const sequelize = require(`../lib/sequelize`);

const chalk = require(`chalk`);
const { getLogger } = require(`../lib/logger`);
const routes = require(`../api`);
const { DEFAULT_PORT, HttpCode, ExitCode } = require(`../../constants`);

const logger = getLogger({ name: `api` });

const app = express();
//const httpServer = createServer(app);
//const io = socket(httpServer);

//app.locals.socketio = io;

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });

  next();
});

app.use((req, res, next) => {
  res.headers[`Access-Control-Allow-Origin`] = `*`;
  res.headers[`Access-Control-Allow-Method`] = `*`;
  next();
});

app.use(`/api`, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`Request error: ${err}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const port = parseInt(args, 10) || DEFAULT_PORT;

    try {
      logger.info(chalk.yellow(`Connection to DB...`));
      await sequelize.authenticate();
    } catch (err) {
      logger.info(chalk.red(`Error to connect with DB: ${err.message}`));
      process.exit(ExitCode.ERROR);
    }

    logger.info(chalk.green(`Connection to database established`));

    app
      .listen(process.env.PORT || DEFAULT_PORT, () => {
        logger.info(`Waiting to connect on port: ${port}`);
      })
      .on(`error`, ({ message }) => {
        logger.error(`Error create server: ${message}`);
      });
  },
};
