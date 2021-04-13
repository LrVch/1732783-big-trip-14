import dayjs from 'dayjs';
import { DAY, ONE_HOUR } from '../constants';

export const formatToShortDay = (date) =>
  date ? dayjs(date).format('D MMM') : '';

export const formatToDateTime = (date) =>
  date ? dayjs(date).format('YYYY-MM-DD') : '';

export const formatToFullDateTime = (date) =>
  date ? dayjs(date).format('YYYY-MM-DDTHH:MM') : '';

export const formatToTime = (date) => (date ? dayjs(date).format('hh:mm') : '');

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
