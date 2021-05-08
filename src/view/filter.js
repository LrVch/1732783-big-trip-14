import { FilterType } from '../constants';
import Abstract from './abstarct';

const createFilterTemplate = ({ isFuture, isPast } = {}, currentFilterType) => {
  return `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input
        id="filter-everything"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="everything"
        ${FilterType.EVERYTHING === currentFilterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input
      id="filter-future"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="future"
      ${isFuture ? '' : 'disabled'}
      ${FilterType.FUTURE === currentFilterType ? 'checked' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input
      id="filter-past"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="past"
      ${isPast ? '' : 'disabled'}
      ${FilterType.PAST === currentFilterType ? 'checked' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filter extends Abstract {
  constructor(filterState = {}, currentFilterType) {
    super();
    this._filterState = filterState;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filterState, this._currentFilterType);
  }

  _filterTypeChangeHandler(event) {
    this._callback.filterTypeChange(event.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    Array.from(this.getElement()['trip-filter']).forEach((radio) => {
      radio.addEventListener('click', this._filterTypeChangeHandler);
    });
  }
}
