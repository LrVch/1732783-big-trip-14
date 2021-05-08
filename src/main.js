import NavigationView from './view/navigation';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/tripInfo';
import EventsModel from './model/events';
import FilterModel from './model/fiter';

import { generateEvent } from './mock/event';
import {
  PlaceToInsert,
  // eslint-disable-next-line comma-dangle
  render,
} from './utils';

const EVENTS_COUNT = 20;

const events = Array(EVENTS_COUNT).fill().map(generateEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const mainElement = document.querySelector('.page-body');
const tripMainElement = mainElement.querySelector('.trip-info');
const navigationElement = mainElement.querySelector(
  '.trip-controls__navigation',
);
const filterElement = mainElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');

render(navigationElement, new NavigationView(), PlaceToInsert.BEFORE_END);

const tripPresenter = new TripPresenter(
  tripEventsElement,
  eventsModel,
  filterModel,
);
const filterPresenter = new FilterPresenter(
  filterElement,
  filterModel,
  eventsModel,
);

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

document
  .querySelector('.trip-main__event-add-btn')
  .addEventListener('click', (evt) => {
    evt.preventDefault();
    tripPresenter.createEvent();
  });
