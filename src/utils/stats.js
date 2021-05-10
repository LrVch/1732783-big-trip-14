import { calculateDuration } from './event';
import { formatToDuration } from './format';

const transformMapToArray = (map) => {
  return Object.keys(map).map((key) => ({
    type: key,
    value: map[key],
  }));
};

export const sortByValueDesc = (arr) =>
  arr.slice().sort((a, b) => b.value - a.value);

export const getMoneySpendByType = (events) => {
  return events.reduce((acc, next) => {
    const type = next.type;
    return {
      ...acc,
      [type]: (acc[type] || 0) + next.price,
    };
  }, {});
};

export const getCountByType = (events) => {
  return events.reduce((acc, next) => {
    const type = next.type;
    return {
      ...acc,
      [type]: (acc[type] || 0) + 1,
    };
  }, {});
};

export const getTimeSpendByType = (events) => {
  return events.reduce((acc, next) => {
    const type = next.type;
    return {
      ...acc,
      [type]: (acc[type] || 0) + calculateDuration(next),
    };
  }, {});
};

export const formaTimeSpendtToDuration = (map) => {
  return Object.keys(map).reduce((acc, next) => {
    return {
      ...acc,
      [next]: formatToDuration(map[next]),
    };
  }, {});
};

export const getMoneySpendByTypeAsArray = (events) =>
  transformMapToArray(getMoneySpendByType(events));

export const getCountByTypeAsArray = (events) =>
  transformMapToArray(getCountByType(events));

export const getTimeSpendByTypeAsArray = (events) =>
  transformMapToArray(getTimeSpendByType(events));
