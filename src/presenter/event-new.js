import { nanoid } from 'nanoid';

import { EVENT_TYPES } from '../constants';
import { destinations, offers } from '../mock/event';
import EditEventView from '../view/edit-event';
import { PlaceToInsert, remove, render } from '../utils';
import { UserAction, UpdateType } from '../constants';

export default class EventNew {
  constructor(eventsListContainer, handleEventChange) {
    this._eventsListContainer = eventsListContainer;
    this._handleEventChange = handleEventChange;

    this._editEventComponent = null;

    this._handleDelete = this._handleDelete.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  init() {
    if (this._editEventComponent !== null) {
      return;
    }

    this._editEventComponent = new EditEventView(
      EVENT_TYPES,
      destinations,
      offers,
    );

    this._editEventComponent.setSubmitHandler(this._handleSubmit);
    this._editEventComponent.setDeleteHandler(this._handleDelete);

    render(
      this._eventsListContainer,
      this._editEventComponent,
      PlaceToInsert.AFTER_BEGIN,
    );

    document.addEventListener('keydown', this._onEscKeyDownHandler);
    document
      .querySelector('.trip-main__event-add-btn')
      .setAttribute('disabled', true);
  }

  destroy() {
    if (this._editEventComponent === null) {
      return;
    }

    remove(this._editEventComponent);
    this._editEventComponent = null;

    document.removeEventListener('keydown', this._onEscKeyDownHandler);
    document
      .querySelector('.trip-main__event-add-btn')
      .removeAttribute('disabled');
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleSubmit(event) {
    this._handleEventChange(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      Object.assign(event, { id: nanoid() }),
    );
  }

  _handleDelete() {
    this.destroy();
  }

  _handleCancel() {
    this._resetAndReplaceFormToEvent();
  }
}
