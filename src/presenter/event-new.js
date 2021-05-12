import { EVENT_TYPES } from '../constants';
import EditEventView from '../view/edit-event';
import { PlaceToInsert, remove, render } from '../utils';
import { UserAction, UpdateType } from '../constants';

export default class EventNew {
  constructor(eventsListContainer, handleEventChange, resourseManger) {
    this._eventsListContainer = eventsListContainer;
    this._handleEventChange = handleEventChange;
    this.__resourseManger = resourseManger;

    this._editEventComponent = null;
    this._destroyCallback = null;

    this._handleDelete = this._handleDelete.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._editEventComponent !== null) {
      return;
    }

    const { destinations, offers } = this.__resourseManger.getResourses();

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
  }

  destroy() {
    if (this._editEventComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._editEventComponent);
    this._editEventComponent = null;

    document.removeEventListener('keydown', this._onEscKeyDownHandler);
  }

  _handleSubmit(event) {
    this._handleEventChange(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      Object.assign(event, { isFavorite: false }),
    );
  }

  _handleDelete() {
    this.destroy();
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
