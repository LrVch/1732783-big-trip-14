import { EVENT_TYPES } from '../constants';
import { destinations, offers } from '../mock/event';
import EventView from '../view/event';
import EditEventView from '../view/edit-event';
import { PlaceToInsert, remove, render, replace } from '../utils';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Event {
  constructor(eventsListContainer, handleEventChange, handleModeChange) {
    this._eventsListContainer = eventsListContainer;
    this._handleEventChange = handleEventChange;
    this._handleModeChange = handleModeChange;

    this._eventComponent = null;
    this._editEventComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleCancel = this._handleCancel.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventView(event);
    this._editEventComponent = new EditEventView(
      EVENT_TYPES,
      destinations,
      offers,
      event,
    );

    this._eventComponent.setEditClickHandler(this._handleEditClick);

    this._eventComponent.setAddToFavoriteHandler(this._handleFavoriteClick);

    this._editEventComponent.setSubmitHandler(this._handleSubmit);

    this._editEventComponent.setCancelHandler(this._handleCancel);

    if (prevEventComponent === null || prevEditEventComponent === null) {
      return render(
        this._eventsListContainer,
        this._eventComponent,
        PlaceToInsert.BEFORE_END,
      );
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editEventComponent, prevEditEventComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._editEventComponent, this._eventComponent);
    document.addEventListener('keydown', this._onEscKeyDownHandler);
    this._handleModeChange();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._editEventComponent);
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleSubmit() {
    this._replaceFormToEvent();
  }

  _handleCancel() {
    this._replaceFormToEvent();
  }

  _handleFavoriteClick() {
    this._handleEventChange(
      Object.assign({}, this._event, {
        isFavorite: !this._event.isFavorite,
      }),
    );
  }
}