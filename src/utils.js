import dayjs from 'dayjs';
import { DAY, ONE_HOUR } from './constants';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const firstLetteToUpperCase = (str) =>
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

  const daysRes = withDay ? (days < 10 ? '0' + days : days) + 'D ' : '';
  const hoursRes = (hours < 10 ? '0' + hours : hours) + 'H ';
  const minutesRes = (minutes < 10 ? '0' + minutes : minutes) + 'M';

  return `${daysRes}${hoursRes}${minutesRes}`;
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

export const caclucateEventsCities = (events) => {
  if (events.length > 3) {
    return `${events[0].destination.name} — ... — ${
      events[events.length - 1].destination.name
    }`;
  }

  return events.map((event) => event.destination.name).join(' — ');
};

export const caclucateEventsDates = (events) => {
  if (events.length > 1) {
    return `${formatToShortDay(events[0].startDate)}  — ${formatToShortDay(
      events[events.length - 1].endDate,
    )}`;
  }

  return `${formatToShortDay(events[0].startDate)}  — ${formatToShortDay(
    events[0].endDate,
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
