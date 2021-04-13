import EditEventView from './view/edit-event';
import EventView from './view/event';
import EventsListView from './view/events-list';
import FilterView from './view/filter';
import NavigationView from './view/navigation';
import SortView from './view/sort';
import TripCostView from './view/trip-cost';
import TripInfoView from './view/trip-info';
import NoEventsView from './view/no-events';

import { destinations, generateEvent, offers } from './mock/event';
import { EVENT_TYPES } from './constants';
import {
  caclucateEventsCities,
  caclucateEventsDates,
  calculateFilterDisableState,
  calculateTotal,
  PlaceToInsert,
  // eslint-disable-next-line comma-dangle
  render,
  replace,
} from './utils';

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

const renderEvent = (eventsListElement, task) => {
  const eventComponent = new EventView(task);
  const editEventComponent = new EditEventView(
    EVENT_TYPES,
    destinations,
    offers,
    task,
  );

  const replaceEventToForm = () => {
    replace(editEventComponent, eventComponent);
  };

  const replaceFormToEvent = () => {
    replace(eventComponent, editEventComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.setEditClickHandler(() => {
    replaceEventToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.setSubmitHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.setCancelHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(eventsListElement, eventComponent, PlaceToInsert.BEFORE_END);
};

const renderEvents = (mainElement, tasks) => {
  if (!tasks.length) {
    return render(
      tripEventsElement,
      new NoEventsView(),
      PlaceToInsert.BEFORE_END,
    );
  }

  const eventsListView = new EventsListView();

  render(tripEventsElement, new SortView(), PlaceToInsert.BEFORE_END);

  render(tripEventsElement, eventsListView, PlaceToInsert.BEFORE_END);

  for (let i = 0; i < EVENTS_COUNT; i++) {
    renderEvent(eventsListView, events[i]);
  }
};

renderHeader(events);

renderEvents(tripEventsElement, events);
