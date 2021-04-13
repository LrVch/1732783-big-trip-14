import Abstract from './abstarct';

const createNoEventsTemplate = () => {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};

export default class NoEvents extends Abstract {
  constructor() {
    super();
  }

  getTemplate() {
    return createNoEventsTemplate();
  }
}
