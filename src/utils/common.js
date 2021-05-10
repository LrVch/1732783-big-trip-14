export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const changeFirstLetteToUpperCase = (str) =>
  str.length ? str[0].toUpperCase() + str.slice(1) : '';

export const requiredValidator = (name) => (value) => {
  if (!value) {
    return `${name} is required`;
  }
};

export const priceValidator = (value) => {
  if (value <= 0) {
    return 'Price must be a positive number';
  }
};
