import {
  changeFirstLetteToUpperCase,
  formatToShortDay,
  formatToDateTime,
  formatToFullDateTime,
  formatToTime,
  formatToDuration,
  calculateDuration,
  // eslint-disable-next-line comma-dangle
  calculateEventPrice,
} from '../utils';
import Abstract from './abstarct';

const getOfferTemplate = ({ price = '0', name }) => {
  return `<li class="event__offer">
    <span class="event__offer-title">${name}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`;
};

const createEventTemplate = (event = {}) => {
  const {
    type,
    price,
    isFavorite,
    startDate,
    endDate,
    destination = {},
    offers = [],
  } = event;

  const resultPrice = calculateEventPrice({ price, offers });

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${formatToDateTime(startDate)}">
        ${formatToShortDay(startDate)}
      </time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">
        ${changeFirstLetteToUpperCase(type)}
        ${destination.name}
      </h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="
            ${formatToFullDateTime(startDate)}
          ">${formatToTime(startDate)}</time>
          &mdash;
          <time class="event__end-time" datetime="
          ${formatToFullDateTime(endDate)}
          ">${formatToTime(endDate)}</time>
        </p>
        <p class="event__duration">
          ${formatToDuration(calculateDuration(startDate, endDate))}
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span
        class="event__price-value">
        ${resultPrice || '0'}
        </span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offers.map(getOfferTemplate).join(' ')}
      </ul>
      <button class="
          event__favorite-btn
          ${isFavorite ? 'event__favorite-btn--active' : ''}
        "
        type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Event extends Abstract {
  constructor(event = {}) {
    super();
    this._event = event;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._addToFavoriteHandler = this._addToFavoriteHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  _editClickHandler() {
    this._callback.editClick();
  }

  _addToFavoriteHandler() {
    this._callback.addToFavorite();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._editClickHandler);
  }

  setAddToFavoriteHandler(callback) {
    this._callback.addToFavorite = callback;
    this.getElement()
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this._addToFavoriteHandler);
  }
}
