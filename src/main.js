import { createEditEventTemplate } from './view/edit-event';
import { createEventTemplate } from './view/event';
import { createEventsListTemplate } from './view/events-list';
import { createFilterTemplate } from './view/filter';
import { createNavigationTemplate } from './view/navigation';
import { createSortTemplate } from './view/sort';
import { createTripCostTemplate } from './view/trip-cost';
import { createTripInfoTemplate } from './view/trip-info';

import { generateDestinations, generateEvent, offers } from './mock/event';
import { EVENT_TYPES } from './constants';
import {
  caclucateEventsCities,
  caclucateEventsDates,
  calculateFilterDisableState,
  // eslint-disable-next-line comma-dangle
  calculateTotal,
} from './utils';

const palceToInsert = {
  BEFORE_END: 'beforeEnd',
  BEFORE_BEGIN: 'beforeBegin',
  AFTER_END: 'afterEnd',
  AFTER_BEGIN: 'afterBegin',
};

const EVENTS_COUNT = 20;

const events = Array(EVENTS_COUNT).fill().map(generateEvent);

const render = (container, template, place = palceToInsert.BEFORE_END) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector('.page-body');
const tripMainElement = mainElement.querySelector('.trip-info');
const navigationElement = mainElement.querySelector(
  '.trip-controls__navigation',
);
const filterElement = mainElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');

render(
  tripMainElement,
  createTripInfoTemplate({
    cities: caclucateEventsCities(events),
    dates: caclucateEventsDates(events),
  }),
);
render(tripMainElement, createTripCostTemplate(calculateTotal(events)));
render(navigationElement, createNavigationTemplate());
render(
  filterElement,
  createFilterTemplate(calculateFilterDisableState(events)),
);
render(tripEventsElement, createSortTemplate());
render(tripEventsElement, createEventsListTemplate());

const tripElentsListElement = tripEventsElement.querySelector(
  '.trip-events__list',
);

render(
  tripElentsListElement,
  createEditEventTemplate(
    EVENT_TYPES,
    generateDestinations(),
    offers,
    // undefined,
    events[0],
  ),
);

for (let i = 1; i < EVENTS_COUNT; i++) {
  render(tripElentsListElement, createEventTemplate(events[i]));
}
