import Abstract from './abstarct';

const createLoadingTemplate = () => {
  return '<p class="trip-events__msg">Loading...</p>';
};

export default class Filter extends Abstract {
  constructor() {
    super();
  }

  getTemplate() {
    return createLoadingTemplate();
  }
}
