import { createEditEventTemplate } from './view/edit-event';
import { createEventTemplate } from './view/event';
import { createEventsListTemplate } from './view/events-list';
import { createFilterTemplate } from './view/filter';
import { createNavigationTemplate } from './view/navigation';
import { createSortTemplate } from './view/sort';
import { createTripCostTemplate } from './view/trip-cost';
import { createTripInfoTemplate } from './view/trip-info';

const PLACE_TO_INSERT = {
  BEFORE_END: 'beforeEnd',
  BEFORE_BEGIN: 'beforeBegin',
  AFTER_END: 'afterEnd',
  AFTER_BEGIN: 'afterBegin',
};

const EVENTS_COUNT = 3;

const render = (container, template, place = PLACE_TO_INSERT.BEFORE_END) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector('.page-body');
const tripMainElement = mainElement.querySelector('.trip-info');
const navigationElement = mainElement.querySelector(
  '.trip-controls__navigation'
);
const filterElement = mainElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');

render(tripMainElement, createTripInfoTemplate());
render(tripMainElement, createTripCostTemplate());
render(navigationElement, createNavigationTemplate());
render(filterElement, createFilterTemplate());
render(tripEventsElement, createSortTemplate());
render(tripEventsElement, createEventsListTemplate());

const tripElentsListElement = tripEventsElement.querySelector(
  '.trip-events__list'
);

render(tripElentsListElement, createEditEventTemplate());

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripElentsListElement, createEventTemplate());
}
