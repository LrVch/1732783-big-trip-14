import EventsListView from '../view/events-list';
import NoEventsView from '../view/no-events';
import SortView from '../view/sort';
import {
  PlaceToInsert,
  render,
  sortByDuration,
  // eslint-disable-next-line comma-dangle
  sortByPrice,
} from '../utils';
import EventPresenter from '../presenter/event';
import { SortType } from '../constants';

export default class Trip {
  constructor(tripContainer, eventsModel) {
    this._eventsModel = eventsModel;
    this._tripContainer = tripContainer;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._eventsListComponent = new EventsListView();
    this._noEventsComponent = new NoEventsView();
    this._sortComponent = new SortView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.DURATION:
        return this._eventsModel.getEvents().slice().sort(sortByDuration);
      case SortType.PRICE:
        return this._eventsModel.getEvents().slice().sort(sortByPrice);
    }

    return this._eventsModel.getEvents();
  }

  init() {
    this._renderTrip();
  }

  _renderTrip() {
    const events = this._getEvents();

    if (!events.length) {
      return this._renderNoEvents();
    }

    this._renderSort();

    this._renderEventsContainer();

    this._renderEvents(events);
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
      this._handleViewAction,
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

  _renderEvents(events) {
    events.forEach((event) => this._renderEvent(event));
  }

  _clearEventsList() {
    Object.values(this._eventPresenter).forEach((presenter) =>
      presenter.destroy(),
    );
    this._eventPresenter = {};
  }

  // _handleEventChange(updatedEvent) {
  //   this._eventPresenter[updatedEvent.id].init(updatedEvent);
  // }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
  }

  _handleModeChange() {
    Object.values(this._eventPresenter).forEach((presenter) =>
      presenter.resetView(),
    );
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearEventsList();
    this._renderEvents(this._getEvents());
  }
}
