"use strict";

const { Server } = require(`socket.io`);

const host =
  process.env.NODE_ENV === `development`
    ? `http://localhost:8080`
    : `https://rock-n-buyendsell.herokuapp.com`;

module.exports = (server) => {
  return new Server(server, {
    cors: {
      origin: [host],
      methods: `GET`,
    },
  });
};
