'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [array[i], array[randomPosition]] = [
      array[randomPosition],
      array[i]
    ];
  }

  return array;
};

const getRandomPictureName = () => {
  const randomIndex = getRandomInt(1, 16);
  const pictureName = randomIndex >= 10 ? `item${randomIndex}.jpg` : `item0${randomIndex}.jpg`;
  return pictureName;
};

const getRandomDate = () => {

  const dateNow = new Date();
  const dateOld = new Date().setMonth(new Date().getMonth() - 3);
  const randomDate = new Date(getRandomInt(dateOld, +dateNow));

  const month = randomDate.getMonth() < 10 ? `0${randomDate.getMonth()}` : randomDate.getMonth();
  const date = randomDate.getDate() < 10 ? `0${randomDate.getDate()}` : randomDate.getDate();

  return `${randomDate.getFullYear()}-${month}-${date}`;
};

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

module.exports = {
  getRandomInt,
  shuffle,
  getRandomPictureName,
  getRandomDate,
  getRandomSubarray
};
