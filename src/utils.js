import dayjs from 'dayjs';
import { DAY, ONE_HOUR } from './constants';

export const PlaceToInsert = {
  BEFORE_END: 'beforeEnd',
  BEFORE_BEGIN: 'beforeBegin',
  AFTER_END: 'afterEnd',
  AFTER_BEGIN: 'afterBegin',
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const changeRirstLetteToUpperCase = (str) =>
  str.length ? str[0].toUpperCase() + str.slice(1) : '';

export const formatToShortDay = (date) =>
  date ? dayjs(date).format('D MMM') : '';

export const formatToDateTime = (date) =>
  date ? dayjs(date).format('YYYY-MM-DD') : '';

export const formatToFullDateTime = (date) =>
  date ? dayjs(date).format('YYYY-MM-DDTHH:MM') : '';

export const formatToTime = (date) => (date ? dayjs(date).format('hh:mm') : '');

export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return null;
  }

  return endDate - startDate;
};

export const getDateTimeParts = (duration) => {
  const milliseconds = parseInt((duration % 1000) / 100);
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const days = Math.round(duration / 60 / 1000 / 60 / 24);

  return {
    days,
    minutes,
    hours,
    seconds,
    milliseconds,
  };
};

export const getFormatedParts = (duration, withDay) => {
  const { days, hours, minutes } = getDateTimeParts(duration);

  const daysResult = withDay ? (days < 10 ? '0' + days : days) + 'D ' : '';
  const hoursResult = (hours < 10 ? '0' + hours : hours) + 'H ';
  const minutesResult = (minutes < 10 ? '0' + minutes : minutes) + 'M';

  return `${daysResult}${hoursResult}${minutesResult}`;
};

export const formatToDuration = (duration) => {
  if (!duration) {
    return '';
  }

  if (duration < ONE_HOUR) {
    return `${dayjs(duration).format('mm')}M`;
  } else {
    if (duration < DAY) {
      return getFormatedParts(duration);
    } else {
      return getFormatedParts(duration, true);
    }
  }
};

export const formatToPickedDateTime = (date) =>
  date ? dayjs(date).format('DD/MM/YY hh:mm') : '';

export const calculateEventPrice = ({ price = 0, offers = [] } = {}) =>
  offers.reduce((acc, next) => {
    return acc + next.price;
  }, 0) + price;

export const calculateTotal = (events) => {
  return events.map(calculateEventPrice).reduce((acc, next) => acc + next, 0);
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

  if (!sorted.len) {
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
  return date === null ? false : dayjs().isBefore(date, 'D');
};

export const isEventInPast = (date) => {
  return date === null ? false : dayjs().isAfter(date, 'D');
};

export const calculateFilterDisableState = (events) => {
  return {
    isFuture: events.some((event) => isEventInFuture(event.startDate)),
    isPast: events.some((event) => isEventInPast(event.endDate)),
  };
};

export const render = (container, element, place) => {
  switch (place) {
    case PlaceToInsert.AFTER_BEGIN:
      container.prepend(element);
      break;
    case PlaceToInsert.BEFORE_END:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');

  newElement.innerHTML = template;

  return newElement.firstChild;
};
