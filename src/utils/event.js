import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { formatToShortDay } from './format';

dayjs.extend(isSameOrBefore);

export const calculateDuration = ({ startDate, endDate }) => {
  if (!startDate || !endDate) {
    return null;
  }

  return endDate - startDate;
};

export const calculateEventPrice = ({ price = 0, offers = [] } = {}) =>
  offers.reduce((acc, next) => {
    return +acc + +next.price;
  }, price);

export const calculateTotal = (events) => {
  return events.map(calculateEventPrice).reduce((acc, next) => +acc + +next, 0);
};

export const sortAsNumberByProp = (prop) => (a, b) => +a[prop] - +b[prop];

export const sortByStartDate = sortAsNumberByProp('startDate');

export const sortFromStartToEnd = (a, b) => {
  if (dayjs(a.startDate).isSame(dayjs(b.startDate), 'day')) {
    return +a.endDate - +b.endDate;
  }

  return +a.startDate - +b.startDate;
};

export const caclucateEventsCities = (events = []) => {
  const sorted = events.slice().sort(sortFromStartToEnd);

  if (sorted.length > 3) {
    return `${sorted[0].destination.name} — ... — ${
      sorted[sorted.length - 1].destination.name
    }`;
  }

  return sorted.map((event) => event.destination.name).join(' — ');
};

export const caclucateEventsDates = (events = []) => {
  const sorted = events.slice().sort(sortFromStartToEnd);

  if (!sorted.length) {
    return '';
  }

  if (sorted.length > 1) {
    return `${formatToShortDay(sorted[0].startDate)}  — ${formatToShortDay(
      sorted[sorted.length - 1].endDate,
    )}`;
  }

  return `${formatToShortDay(sorted[0].startDate)}  — ${formatToShortDay(
    sorted[0].endDate,
  )}`;
};

export const isEventInFuture = (date) => {
  return date === null ? false : dayjs().isSameOrBefore(date, 'D');
};

export const isEventInPast = (date) => {
  return date === null ? false : dayjs().isAfter(date, 'D');
};

export const isEventEverything = (startDate, endDate) => {
  return !startDate || !endDate
    ? false
    : dayjs().isAfter(startDate, 'D') && dayjs().isBefore(endDate, 'D');
};

export const isDatesEqual = (dateA, dateB) => {
  return dateA === null && dateB === null
    ? true
    : dayjs(dateA).isSame(dateB, 'D');
};

export const calculateFilterDisableState = (events) => {
  return {
    isFuture: events.some((event) => isEventInFuture(event.startDate)),
    isPast: events.some((event) => isEventInPast(event.endDate)),
  };
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortByDuration = (a, b) => {
  const weight = getWeightForNullDate(
    calculateDuration(a),
    calculateDuration(b),
  );

  if (weight !== null) {
    return weight;
  }

  return calculateDuration(a) - calculateDuration(b);
};

export const sortByPrice = (a, b) => {
  return calculateEventPrice(a) - calculateEventPrice(b);
};
