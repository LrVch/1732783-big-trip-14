export const EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const ONE_HOUR = 60 * 60 * 1000;
export const DAY = ONE_HOUR * 24;

export const SortType = {
  DEFAULT: 'default',
  DURATION: 'diration',
  PRICE: 'price',
};

export const PICKER_OPTIONS = {
  altInput: true,
  enableTime: true,
  dateFormat: 'd/m/y H:i',
  altFormat: 'd/m/y H:i',
  time_24hr: true,
};

export const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
