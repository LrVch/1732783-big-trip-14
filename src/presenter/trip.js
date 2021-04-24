import EventsListView from '../view/events-list';
import NoEventsView from '../view/no-events';
import SortView from '../view/sort';
import {
  PlaceToInsert,
  render,
  sortByDuration,
  updateItem,
  // eslint-disable-next-line comma-dangle
  sortByPrice,
} from '../utils';
import EventPresenter from '../presenter/event';
import { SortType } from '../constants';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._eventsListComponent = new EventsListView();
    this._noEventsComponent = new NoEventsView();
    this._sortComponent = new SortView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourcedEvents = events.slice();

    this._renderTrip();
  }

  _renderTrip() {
    if (!this._events.length) {
      return this._renderNoEvents();
    }

    this._renderSort();

    this._renderEventsContainer();

    this._renderEvents();
  }

  _renderEventsContainer() {
    render(
      this._tripContainer,
      this._eventsListComponent,
      PlaceToInsert.BEFORE_END,
    );
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, PlaceToInsert.BEFORE_END);
    this._sortComponent.setSortChangeHandler(this._handleSortChange);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this._eventsListComponent,
      this._handleEventChange,
      this._handleModeChange,
    );
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderNoEvents() {
    render(
      this._tripContainer,
      this._noEventsComponent,
      PlaceToInsert.BEFORE_END,
    );
  }

  _renderEvents() {
    this._events.forEach((event) => this._renderEvent(event));
  }

  _clearEventsList() {
    Object.values(this._eventPresenter).forEach((presenter) =>
      presenter.destroy(),
    );
    this._eventPresenter = {};
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object.values(this._eventPresenter).forEach((presenter) =>
      presenter.resetView(),
    );
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.DURATION:
        this._events.sort(sortByDuration);
        break;
      case SortType.PRICE:
        this._events.sort(sortByPrice);
        break;
      default:
        this._events = this._sourcedEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEventsList();
    this._renderEvents();
  }
}
