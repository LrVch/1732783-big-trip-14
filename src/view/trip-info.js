import Abstract from './abstarct';

const createTripInfoTemplate = ({ cities = '', dates = '' } = {}) => {
  return `<div class="trip-info__main">
    <h1 class="trip-info__title">
      ${cities}
    </h1>

    <p class="trip-info__dates">${dates}</p>
  </div>`;
};

export default class TripInfo extends Abstract {
  constructor(info) {
    super();
    this._info = info;
  }

  getTemplate() {
    return createTripInfoTemplate(this._info);
  }
}
