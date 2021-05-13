import EventsListView from '../view/events-list';
import NoEventsView from '../view/no-events';
import SortView from '../view/sort';
import LoadingView from '../view/loading';
import {
  PlaceToInsert,
  remove,
  render,
  sortByDuration,
  sortByPrice,
  // eslint-disable-next-line comma-dangle
  sortFromStartToEnd,
} from '../utils';
import EventPresenter, {
  // eslint-disable-next-line comma-dangle
  State as EventPresenterViewState,
} from '../presenter/event';
import EventNewPresenter from '../presenter/event-new';
import { SortType, UserAction, UpdateType } from '../constants';
import { filter } from '../utils/filter';

export default class Trip {
  constructor(tripContainer, eventsModel, filterModel, api, resoureManger) {
    this._api = api;
    this._resourseManger = resoureManger;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._eventsListComponent = new EventsListView();
    this._noEventsComponent = new NoEventsView();
    this._sortComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._eventNewPresenter = new EventNewPresenter(
      this._eventsListComponent,
      this._handleViewAction,
      this._resourseManger,
    );
    this._loadingComponent = new LoadingView();
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
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderEventsContainer();
    this._renderTrip();
  }

  destroy() {
    this._clearBoard({ resetSortType: true });

    remove(this._eventsListComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent(callback) {
    this._eventNewPresenter.init(callback);
  }

  disableSort() {
    if (this._sortComponent) {
      this._sortComponent.disable();
    }
  }

  enableSort() {
    if (this._sortComponent) {
      this._sortComponent.enable();
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const events = this._getEvents();

    if (!events.length) {
      return this._renderNoEvents();
    }

    this._renderSort();

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

    render(this._tripContainer, this._sortComponent, PlaceToInsert.AFTER_BEGIN);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this._eventsListComponent,
      this._handleViewAction,
      this._handleModeChange,
      this._resourseManger,
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

  _renderLoading() {
    render(
      this._tripContainer,
      this._loadingComponent,
      PlaceToInsert.AFTER_BEGIN,
    );
  }

  _renderEvents(events) {
    events.forEach((event) => this._renderEvent(event));
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._eventPresenter[update.id].setViewState(
          EventPresenterViewState.SAVING,
        );
        this._api
          .updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(
              EventPresenterViewState.ABORTING,
            );
          });
        break;
      case UserAction.ADD_TASK:
        this._eventNewPresenter.setSaving();
        this._api
          .addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_TASK:
        this._eventPresenter[update.id].setViewState(
          EventPresenterViewState.DELETING,
        );
        this._api
          .deleteEvent(update.id)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(
              EventPresenterViewState.ABORTING,
            );
          });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
