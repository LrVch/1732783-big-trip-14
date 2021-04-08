import { formatToPickedDateTime } from '../utils';

const getDestinationItem = (eventType) => (type) => {
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

const getEventOffers = (availableOffers = [], offerIds) => {
  return availableOffers
    .map(
      ({ id, name, price }) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
          id="event-offer-${id}"
          type="checkbox"
          name="event-offer-luggage"
          ${id in offerIds ? 'checked' : ''}
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

const getOffersSection = (availableOffers = [], offerIds, type) => {
  const isAwailableOffers = (availableOffers[type] || []).length;
  return isAwailableOffers
    ? `<section class="event__section  event__section--offers">
    ${getOffersTitle(availableOffers[type])}

    <div class="event__available-offers">
      ${getEventOffers(availableOffers[type] || [], offerIds)}
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
  event = {},
) => {
  const {
    type = '',
    price = 0,
    startDate,
    endDate,
    destination: { name } = {
      name: '',
    },
    offers = [],
  } = event;

  const currentDestination = destinations.find((elem) => elem.name === name);

  const isEdit = Object.keys(event).length;

  const offerIds = offers.reduce((acc, next) => {
    return {
      ...acc,
      [next.id]: true,
    };
  }, {});

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            ${getTypeImage(type)}
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${types.map(getDestinationItem(type)).join(' ')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
            value="${name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${getDestinationOptions(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
            value="${formatToPickedDateTime(startDate)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
            value="${formatToPickedDateTime(endDate)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">
          ${isEdit ? 'Delete' : 'Canel'}
        </button>
        ${getEventCloseButton(isEdit)}
      </header>

      <section class="event__details">
        ${getOffersSection(availableOffers, offerIds, type)}

        ${getDestination(currentDestination)}
      </section>
    </form>
  </li>`;
};
