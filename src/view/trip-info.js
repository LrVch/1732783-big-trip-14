import { createElement } from '../utils';

const createTripInfoTemplate = ({ cities = '', dates = '' } = {}) => {
  return `<div class="trip-info__main">
    <h1 class="trip-info__title">
      ${cities}
    </h1>

    <p class="trip-info__dates">${dates}</p>
  </div>`;
};

export default class TripInfo {
  constructor(info) {
    this._element = null;
    this._info = info;
  }

  getTemplate() {
    return createTripInfoTemplate(this._info);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
