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

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateOfferName = () => {
  const descriptions = [
    'Lorem ipsum dolor',
    'Fusce tristique felis',
    'Sed sed nisi sed augue convallis',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
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
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

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

const generateDestination = (index) => {
  return {
    name: CITIES[index || getRandomInteger(0, 9)],
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
