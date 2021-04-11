import { createElement } from '../utils';

const createTripCostTemplate = (total = 0) => {
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
  </p>`;
};

export default class TripCost {
  constructor(total) {
    this._element = null;
    this._total = total;
  }

  getTemplate() {
    return createTripCostTemplate(this._total);
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
