import FilterView from './view/filter';
import NavigationView from './view/navigation';
import TripCostView from './view/trip-cost';
import TripInfoView from './view/trip-info';
import TripPresenter from './presenter/trip';

import { generateEvent } from './mock/event';
import {
  caclucateEventsCities,
  caclucateEventsDates,
  calculateFilterDisableState,
  calculateTotal,
  PlaceToInsert,
  // eslint-disable-next-line comma-dangle
  render,
} from './utils';

/*
  этот пул реквест только для проформы, задание было выполнено в ветке module5-task1
*/

const EVENTS_COUNT = 20;

const events = Array(EVENTS_COUNT).fill().map(generateEvent);

const mainElement = document.querySelector('.page-body');
const tripMainElement = mainElement.querySelector('.trip-info');
const navigationElement = mainElement.querySelector(
  '.trip-controls__navigation',
);
const filterElement = mainElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');

const renderHeader = (events) => {
  render(
    tripMainElement,
    new TripInfoView({
      cities: caclucateEventsCities(events),
      dates: caclucateEventsDates(events),
    }),
    PlaceToInsert.BEFORE_END,
  );

  render(
    tripMainElement,
    new TripCostView(calculateTotal(events)),
    PlaceToInsert.BEFORE_END,
  );

  render(navigationElement, new NavigationView(), PlaceToInsert.BEFORE_END);

  render(
    filterElement,
    new FilterView(calculateFilterDisableState(events)),
    PlaceToInsert.BEFORE_END,
  );
};

renderHeader(events);

const tripPresenter = new TripPresenter(tripEventsElement);

tripPresenter.init(events);
