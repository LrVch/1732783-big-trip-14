import EventsListView from '../view/events-list';
import NoEventsView from '../view/no-events';
import SortView from '../view/sort';
import {
  PlaceToInsert,
  remove,
  render,
  sortByDuration,
  sortByPrice,
  // eslint-disable-next-line comma-dangle
  sortFromStartToEnd,
} from '../utils';
import EventPresenter from '../presenter/event';
import EventNewPresenter from '../presenter/event-new';
import { SortType, UserAction, UpdateType, FilterType } from '../constants';
import { filter } from '../utils/filter';

export default class Trip {
  constructor(tripContainer, eventsModel, filterModel) {
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._eventsListComponent = new EventsListView();
    this._noEventsComponent = new NoEventsView();
    this._sortComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(
      this._eventsListComponent,
      this._handleViewAction,
    );
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.DURATION:
        return filtredEvents.slice().sort(sortByDuration);
      case SortType.PRICE:
        return filtredEvents.slice().sort(sortByPrice);
    }

    return filtredEvents.slice().sort(sortFromStartToEnd);
  }

  init() {
    this._renderTrip();
  }

  createEvent() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
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
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortChangeHandler(this._handleSortChange);

    render(this._tripContainer, this._sortComponent, PlaceToInsert.BEFORE_END);
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

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({ resetSortType: true });
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) =>
      presenter.resetView(),
    );
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderTrip();
  }

  _clearBoard({ resetSortType = false } = {}) {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) =>
      presenter.destroy(),
    );
    this._eventPresenter = {};

    remove(this._sortComponent);
    remove(this._noEventsComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
