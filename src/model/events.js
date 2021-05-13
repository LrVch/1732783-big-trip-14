import Observer from '../utils/observer.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      // eslint-disable-next-line quotes
      throw new Error("Can't update unexisting event");
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [update, ...this._events];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      // eslint-disable-next-line quotes
      throw new Error("Can't delete unexisting event");
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign({}, event, {
      price: event.base_price,
      startDate: new Date(event.date_from),
      endDate: new Date(event.date_to),
      isFavorite: event.is_favorite,
      offers: event.offers.map((offer) => ({
        ...offer,
        name: offer.title,
        id: offer.title,
      })),
      offerIds: event.offers.map((offer) => offer.title),
    });

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedTask = Object.assign({}, event, {
      base_price: Number(event.price),
      date_from: event.startDate.toISOString(),
      date_to: event.endDate.toISOString(),
      is_favorite: event.isFavorite,
      offers: event.offers.map((offer) => ({
        title: offer.name,
        price: offer.price,
      })),
    });

    delete adaptedTask.price;
    delete adaptedTask.startDate;
    delete adaptedTask.endDate;
    delete adaptedTask.isFavorite;

    return adaptedTask;
  }
}
