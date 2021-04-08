import dayjs from 'dayjs';

import { EVENT_TYPES } from '../constants';
import { getRandomInteger } from '../utils';

export const CITIES = [
  'London',
  'Parise',
  'NY',
  'Mexico',
  'Viena',
  'Tokio',
  'Gumburg',
  'Rome',
  'Madrid',
  'Moscow',
  'Челябинск',
];

const LONG_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const SHORT_DESCRIPTIONS = [
  'Lorem ipsum dolor',
  'Fusce tristique felis',
  'Sed sed nisi sed augue convallis',
];

const MAX_DAYS_GAP = 7;

const getRandomInAray = (array) => getRandomInteger(0, array.length - 1);

const generateDescription = () => {
  const randomIndex = getRandomInAray(LONG_DESCRIPTIONS);

  return LONG_DESCRIPTIONS[randomIndex];
};

const generateOfferName = () => {
  const randomIndex = getRandomInAray(SHORT_DESCRIPTIONS);

  return SHORT_DESCRIPTIONS[randomIndex];
};

const generatePictures = () => {
  return Array(getRandomInteger(1, 7))
    .fill()
    .map(() => ({
      src: `http://picsum.photos/248/152?r=${Math.random()}`,
      desctiption: generateDescription(),
    }));
};

const getRandomType = () => EVENT_TYPES[getRandomInteger(0, 7)];

const generateDates = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);

  const date = dayjs()
    .add(daysGap, 'day')
    .add(getRandomInteger(1, 10), 'minute');
  return {
    startDate: date.toDate(),
    endDate: date
      .add(getRandomInteger(0, 7), 'day')
      .add(getRandomInteger(0, 11), 'h')
      .add(getRandomInteger(1, 59), 'minute')
      .toDate(),
  };
};

const generateDestination = (
  index = getRandomInteger(0, CITIES.length - 1),
) => {
  return {
    name: CITIES[index],
    description: generateDescription(),
    pictures: generatePictures(),
  };
};

export const generateDestinations = () => {
  return Array(10)
    .fill()
    .map((_, index) => generateDestination(index));
};

const generateOffer = (id) => ({
  id,
  name: generateOfferName(),
  price: getRandomInteger(10, 200),
});

const typesWithOffers = ['taxi', 'bus', 'train', 'ship', 'transport'];

const generateOffers = () => {
  const map = {};

  typesWithOffers.forEach((type, index) => {
    map[type] = Array(getRandomInteger(2, 6))
      .fill()
      .map((_, i) => generateOffer(`${index}-${i}`));
  });

  return map;
};

export const offers = generateOffers();

export const generateEvent = () => {
  const dates = generateDates();
  const type = getRandomType();

  return {
    type: getRandomType(),
    price: getRandomInteger(10, 500),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    startDate: dates.startDate,
    endDate: dates.endDate,
    destination: generateDestination(),
    offers: typesWithOffers.includes(type) ? offers[type] : undefined,
  };
};
