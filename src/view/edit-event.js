import he from 'he';

import Smart from './smart';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

import { PICKER_OPTIONS } from '../constants';
import { requiredValidator, priceValidator } from '../utils/common';

const getDestinationTypeItem = (eventType) => (type) => {
  return `<div class="event__type-item">
    <input
      id="event-type-${type}"
      class="event__type-input  visually-hidden"
      type="radio"
      name="event-type"
      ${type === eventType ? 'checked' : ''}
      value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${type}</label>
  </div>`;
};

const getEventOffers = (availableOffers = [], offerIdsMap, isDisabled) => {
  return availableOffers
    .map(
      ({ id, name, price }) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
          ${isDisabled ? 'disabled' : ''}
          id="event-offer-${id}"
          type="checkbox"
          name="event-offer-luggage"
          ${offerIdsMap[id] ? 'checked' : ''}
          value="${id}"
        >
        <label class="event__offer-label" for="event-offer-${id}">
          <span class="event__offer-title">${name}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`,
    )
    .join('');
};

const getTypeImage = (type) =>
  type
    ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">`
    : '';

const getDestinationOptions = (destinations) =>
  destinations.map(({ name }) => `<option value="${name}"></option>`).join('');

const getOffersTitle = (isShow) =>
  isShow
    ? '<h3 class="event__section-title event__section-title--offers">Offers</h3>'
    : '';

const getOffersSection = (
  availableOffers = [],
  offerIdsMap,
  type,
  isDisabled,
) => {
  const isAwailableOffers = (availableOffers[type] || []).length;
  return isAwailableOffers
    ? `<section class="event__section  event__section--offers">
    ${getOffersTitle(availableOffers[type])}

    <div class="event__available-offers">
      ${getEventOffers(availableOffers[type] || [], offerIdsMap, isDisabled)}
    </div>
  </section>`
    : '';
};

const getEventCloseButton = (isEdit) =>
  isEdit
    ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    : '';

const getImage = ({ src }) =>
  `<img class="event__photo" src="${src}" alt="Event photo">`;

const getDestination = (destination) => {
  if (!destination) {
    return '';
  }

  const { description = '', pictures = [] } = destination;

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map(getImage).join('')}
      </div>
    </div>
  </section>`;
};

export const createEditEventTemplate = (
  types = [],
  destinations = [],
  availableOffers = {},
  data = {},
) => {
  const {
    type = '',
    price = '',
    startDate,
    endDate,
    currentDestination,
    offerIdsMap,
    id,
    isDisabled,
    isSaving,
    isDeleting,
  } = data;

  const isEdit = !!id;

  const destinationName = currentDestination ? currentDestination.name : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            ${getTypeImage(type)}
          </label>
          <input
            ${isDisabled ? 'disabled' : ''}
            class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${types.map(getDestinationTypeItem(type)).join(' ')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input
            ${isDisabled ? 'disabled' : ''}
            class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
            value="${he.encode(destinationName)}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${getDestinationOptions(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            ${isDisabled ? 'disabled' : ''}
            class="event__input  event__input--time event__input-start-date" id="event-start-time-1" type="text" name="event-start-time"
            value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            ${isDisabled ? 'disabled' : ''}
            class="event__input  event__input--time event__input-end-date" id="event-end-time-1" type="text" name="event-end-time"
            value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            ${isDisabled ? 'disabled' : ''}
            class="event__input  event__input--price"
            id="event-price-1"
            type="text"
            name="event-price"
            value="${he.encode(price + '')}">
        </div>

        <button
          class="event__save-btn  btn  btn--blue"
          type="submit"
          ${isDisabled ? 'disabled' : ''}
        >
          ${isSaving ? 'Saving...' : 'Save'}
          </button>
        <button
          class="event__reset-btn"
          type=${isEdit ? 'button' : 'reset'}
          ${isDisabled ? 'disabled' : ''}
        >
          ${isEdit ? (isDeleting ? 'Deleting...' : 'Delete') : 'Cancel'}
        </button>
        ${getEventCloseButton(isEdit)}
      </header>

      <section class="event__details">
        ${getOffersSection(availableOffers, offerIdsMap, type, isDisabled)}

        ${getDestination(currentDestination)}
      </section>
      <div class="event__errors">
      </div>
    </form>
  </li>`;
};
export default class EditEvent extends Smart {
  constructor(eventTypes, destinations, offers, event = {}) {
    super();
    this._data = EditEvent.parseEventToData(event, destinations);
    this._eventTypes = eventTypes;
    this._destinations = destinations;
    this._offers = offers;

    this._startDatePicker = null;
    this._endDatePicker = null;

    this._submitHandler = this._submitHandler.bind(this);
    this._cancelHandler = this._cancelHandler.bind(this);
    this._deleteHandler = this._deleteHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._handleBlur = this._handleBlur.bind(this);

    this._setInnerHandlers();
    this._setDatepickers();
    this._touched = {};
  }

  updateData(...args) {
    super.updateData(...args);

    const [, , type] = args;

    this._touched[type] = true;

    this._validate();
  }

  _validate() {
    const validState = this._getValidFormState(this._data);

    if (validState.isValid) {
      this._hideErrorMessage();
    } else {
      this._showErrorMessage(validState.messages.join(', '));
    }

    return validState;
  }

  _markAllAsTouched() {
    const config = this._getValidateConfig();

    Object.keys(config).forEach((field) => {
      this._touched[field] = true;
    });
  }

  _showErrorMessage(message) {
    if (message) {
      const errorElement = this.getElement().querySelector('.event__errors');
      errorElement.textContent = message;
      errorElement.classList.add('event__errors--active');
    } else {
      this._hideErrorMessage();
    }
  }

  _hideErrorMessage() {
    const errorElement = this.getElement().querySelector('.event__errors');
    errorElement.textContent = '';
    errorElement.classList.remove('event__errors--active');
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
    this.setSubmitHandler(this._callback.submit);
    this.setCancelHandler(this._callback.cancel);
    this.setDeleteHandler(this._callback.delete);
  }

  _setDatepickers() {
    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }

    this._startDatePicker = flatpickr(
      this.getElement().querySelector('.event__input-start-date'),
      Object.assign(
        {
          defaultDate: this._data.startDate,
          onChange: this._startDateChangeHandler,
          maxDate: this._data.endDate,
        },
        PICKER_OPTIONS,
      ),
    );

    this._endDatePicker = flatpickr(
      this.getElement().querySelector('.event__input-end-date'),
      Object.assign(
        {
          defaultDate: this._data.endDate,
          onChange: this._endDateChangeHandler,
          minDate: this._data.startDate,
        },
        PICKER_OPTIONS,
      ),
    );
  }

  _setInnerHandlers() {
    const price = this.getElement().querySelector('.event__input--price');

    price.addEventListener('input', this._priceChangeHandler);
    price.addEventListener('blur', this._handleBlur.bind(null, 'price'));

    const destination = this.getElement().querySelector(
      '.event__input--destination',
    );
    destination.addEventListener('change', this._destinationChangeHandler);
    destination.addEventListener(
      'blur',
      this._handleBlur.bind(null, 'currentDestination'),
    );

    Array.from(
      this.getElement().querySelectorAll('[name="event-type"]'),
    ).forEach((radio) =>
      radio.addEventListener('change', this._eventTypeChangeHandler),
    );

    Array.from(
      this.getElement().querySelectorAll('.event__offer-checkbox'),
    ).forEach((checkbox) =>
      checkbox.addEventListener('change', this._offersChangeHandler),
    );
  }

  _handleBlur(type) {
    this._touched[type] = true;

    this._validate();
  }

  getTemplate() {
    return createEditEventTemplate(
      this._eventTypes,
      this._destinations,
      this._offers,
      this._data,
    );
  }

  _submitHandler(e) {
    e.preventDefault();

    this._markAllAsTouched();

    const { isValid } = this._validate();

    if (!isValid) {
      return;
    }

    this._callback.submit(
      EditEvent.parseDataToEvent(this._data, this._offers, this._destinations),
    );
  }

  _deleteHandler(e) {
    e.preventDefault();
    this._callback.delete(
      EditEvent.parseDataToEvent(this._data, this._offers, this._destinations),
    );
  }

  _cancelHandler() {
    this._callback.cancel();
  }

  _priceChangeHandler(event) {
    const value = event.target.value;
    let realValue = value;

    if (!/^[0-9]$/.test(value)) {
      const elem = this.getElement().querySelector('.event__input--price');
      realValue = elem.value.replace(/[^0-9.]/g, '');
      elem.value = realValue;
    }

    this.updateData(
      {
        price: realValue,
      },
      true,
      'price',
    );
  }

  _startDateChangeHandler([userDate]) {
    this.updateData(
      {
        startDate: userDate,
      },
      true,
      'startDate',
    );
    this._endDatePicker.set('minDate', this._data.startDate);
  }

  _endDateChangeHandler([userDate]) {
    this.updateData(
      {
        endDate: userDate,
      },
      true,
      'endDate',
    );
    this._startDatePicker.set('maxDate', this._data.endDate);
  }

  _destinationChangeHandler(event) {
    event.preventDefault();
    this.updateData(
      {
        currentDestination: this._destinations.find(
          (elem) => elem.name === event.target.value,
        ),
      },
      null,
      'currentDestination',
    );
  }

  _eventTypeChangeHandler(event) {
    event.preventDefault();
    this.updateData(
      {
        type: event.target.value,
        offerIdsMap: {},
      },
      null,
      'type',
    );
  }

  _offersChangeHandler(event) {
    event.preventDefault();
    this.updateData(
      {
        offerIdsMap: Object.assign({}, this._data.offerIdsMap, {
          [event.target.value]: event.target.checked,
        }),
      },
      true,
    );
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement()
      .querySelector('form')
      .addEventListener('submit', this._submitHandler);
  }

  setCancelHandler(callback) {
    const element = this.getElement().querySelector('.event__rollup-btn');
    if (element) {
      this._callback.cancel = callback;
      this.getElement()
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this._cancelHandler);
    }
  }

  setDeleteHandler(callback) {
    this._callback.delete = callback;
    this.getElement()
      .querySelector('.event__reset-btn')
      .addEventListener('click', this._deleteHandler);
  }

  reset(event) {
    this.updateData(EditEvent.parseEventToData(event, this._destinations));
  }

  removeElement() {
    super.removeElement();

    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }
  }

  _getValidFormState(event) {
    const validationResult = this._validateEvent(event);
    return {
      messages: validationResult
        .filter(({ field, message }) => {
          return !!message && this._touched[field];
        })
        .map(({ message }) => message),
      isValid: !validationResult.filter(({ message }) => {
        return !!message;
      }).length,
    };
  }

  _validateEvent(event) {
    const config = this._getValidateConfig();

    const result = Object.keys(config).map((field) => {
      const valid = config[field].validate(event[field]);
      return {
        field,
        message: valid,
      };
    });

    return result;
  }

  _getValidateConfig() {
    return {
      currentDestination: {
        validate: requiredValidator('Destination'),
      },
      type: {
        validate: requiredValidator('Type'),
      },
      startDate: {
        validate: requiredValidator('Start date'),
      },
      endDate: {
        validate: requiredValidator('End date'),
      },
      price: {
        validate: (value) => {
          return requiredValidator('Price')(value) || priceValidator(value);
        },
      },
    };
  }

  static parseEventToData(
    {
      id,
      type,
      price,
      isFavorite,
      startDate = new Date(),
      endDate = new Date(),
      destination = {},
      offerIds = [],
    },
    destinations,
  ) {
    return Object.assign(
      {},
      {
        id,
        type,
        price,
        isFavorite,
        startDate,
        endDate,
        offerIdsMap: offerIds.reduce((acc, id) => {
          return {
            ...acc,
            [id]: true,
          };
        }, {}),
        currentDestination: destinations.find(
          (elem) => elem.name === destination.name,
        ),
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToEvent(data, availableOffers, destinations) {
    data = Object.assign({}, data);

    data.offerIds = Object.keys(data.offerIdsMap).filter(
      (key) => data.offerIdsMap[key],
    );
    data.offers = (availableOffers[data.type] || []).filter(
      (offer) => data.offerIdsMap[offer.id],
    );

    if (data.currentDestination) {
      data.destination = destinations.find(
        (elem) => elem.name === data.currentDestination.name,
      );
    }

    delete data.currentDestination;
    delete data.offerIdsMap;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
