'use strict';

const fs = require(`fs/promises`);

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const content = await fs.readFile(`mocks.json`, `utf8`);
    data = JSON.parse(content);
  } catch (err) {
    return err;
  }

  return data;
};

module.exports = getMockData;
