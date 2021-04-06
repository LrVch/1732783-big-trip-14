export const createTripInfoTemplate = ({ cities = '', dates = '' } = {}) => {
  return `<div class="trip-info__main">
    <h1 class="trip-info__title">
      ${cities}
    </h1>

    <p class="trip-info__dates">${dates}</p>
  </div>`;
};
