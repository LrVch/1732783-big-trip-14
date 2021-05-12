import EventsModel from './model/events';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._request({ url: 'points' })
      .then(Api.toJSON)
      .then((events) => events.map(EventsModel.adaptToClient));
  }

  getOffers() {
    return this._request({ url: 'offers' }).then(Api.toJSON);
  }

  getDestinations() {
    return this._request({ url: 'destinations' }).then(Api.toJSON);
  }

  updateEvent(point) {
    return this._request({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(EventsModel.adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  _request({ url, method = Method.GET, body = null, headers = new Headers() }) {
    headers.append('Authorization', this._authorization);

    return fetch(`${this._endPoint}/${url}`, { method, body, headers })
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
