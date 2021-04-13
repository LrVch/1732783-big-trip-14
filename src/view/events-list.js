import Abstract from './abstarct';

const createEventsListTemplate = () => {
  return '<ul class="trip-events__list"></ul>';
};

export default class EventsList extends Abstract {
  constructor() {
    super();
  }

  getTemplate() {
    return createEventsListTemplate();
  }
}
