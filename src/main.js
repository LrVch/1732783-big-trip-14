import NavigationView from './view/navigation';
import NewEventView from './view/new-event';
import StatsView from './view/stats';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/tripInfo';
import EventsModel from './model/events';
import FilterModel from './model/fiter';
import { NavigationItems, UpdateType, FilterType } from './constants';

import { generateEvent } from './mock/event';
import {
  PlaceToInsert,
  remove,
  // eslint-disable-next-line comma-dangle
  render,
} from './utils';

const EVENTS_COUNT = 20;

const events = Array(EVENTS_COUNT).fill().map(generateEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const mainElement = document.querySelector('.page-body');
const mainBodyElement = mainElement.querySelector(
  '.page-main .page-body__container',
);
const tripMainElement = mainElement.querySelector('.trip-info');
const tripMenuMainElement = mainElement.querySelector('.trip-main');
const navigationElement = mainElement.querySelector(
  '.trip-controls__navigation',
);
const filterElement = mainElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');

const navigationComponent = new NavigationView();
const newEventComponent = new NewEventView();

render(navigationElement, navigationComponent, PlaceToInsert.BEFORE_END);
render(tripMenuMainElement, newEventComponent, PlaceToInsert.BEFORE_END);

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

let statisticsComponent = null;

const handleEventNewFormClose = () => {
  navigationComponent.enableMenuItem(NavigationItems.STATS);
  navigationComponent.enableMenuItem(NavigationItems.TABLE);
  newEventComponent.enable();
  filterPresenter.enable();
  tripPresenter.enableSort();
};

const handleSiteMenuClick = (item) => {
  switch (item) {
    case NavigationItems.ADD_NEW_EVENT:
      navigationComponent.disableMenuItem(NavigationItems.STATS);
      navigationComponent.disableMenuItem(NavigationItems.TABLE);
      filterPresenter.disable();
      newEventComponent.disable();
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      tripPresenter.disableSort();
      tripPresenter.createEvent(handleEventNewFormClose);
      break;
    case NavigationItems.TABLE:
      if (navigationComponent.getActiveItem() === NavigationItems.TABLE) {
        return;
      }
      remove(statisticsComponent);
      navigationComponent.setMenuItem(NavigationItems.TABLE);
      filterPresenter.enable();
      newEventComponent.enable();
      // filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      break;
    case NavigationItems.STATS:
      if (navigationComponent.getActiveItem() === NavigationItems.STATS) {
        return;
      }
      statisticsComponent = new StatsView(eventsModel.getEvents());
      render(mainBodyElement, statisticsComponent, PlaceToInsert.BEFORE_END);
      navigationComponent.setMenuItem(NavigationItems.STATS);
      filterPresenter.disable();
      newEventComponent.disable();
      tripPresenter.destroy();
      break;
  }
};

newEventComponent.setClickHandler(handleSiteMenuClick);
navigationComponent.setMenuClickHandler(handleSiteMenuClick);
