import Abstract from './abstarct';

const createTripCostTemplate = (total = 0) => {
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
  </p>`;
};

export default class TripCost extends Abstract {
  constructor(total) {
    super();
    this._total = total;
  }

  getTemplate() {
    return createTripCostTemplate(this._total);
  }
}
