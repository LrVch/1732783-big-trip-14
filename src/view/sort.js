import Abstract from './abstarct';
import { SortType } from '../constants';

const createSortTemplate = (currentSortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input
        id="sort-day"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="${SortType.DEFAULT}"
        ${currentSortType === SortType.DEFAULT ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input
        id="sort-event"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-event"
        disabled>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input
        id="sort-time"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="${SortType.DURATION}"
        ${currentSortType === SortType.DURATION ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input
        id="sort-price"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="${SortType.PRICE}"
        ${currentSortType === SortType.PRICE ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input
        id="sort-offer"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-offer"
        disabled>
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`;
};

export default class Sort extends Abstract {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortChangeHandler(event) {
    this._callback.sortChange(event.target.value);
  }

  setSortChangeHandler(callback) {
    this._callback.sortChange = callback;

    Array.from(this.getElement()['trip-sort']).forEach((radio) => {
      radio.addEventListener('click', this._sortChangeHandler);
    });
  }

  enable() {
    Array.from(this.getElement()['trip-sort']).forEach((radio) => {
      radio.removeAttribute('disabled');
    });
  }

  disable() {
    Array.from(this.getElement()['trip-sort']).forEach((radio) => {
      radio.setAttribute('disabled', true);
    });
  }
}
