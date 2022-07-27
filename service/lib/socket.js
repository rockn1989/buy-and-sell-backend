'use strict';

const {Server} = require(`socket.io`);

module.exports = (server) => {
  return new Server(server, {
    cors: {
      origin: [`http://localhost:8080`],
      methods: `GET`
    }
  });
};
