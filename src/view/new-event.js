import { NavigationItems } from '../constants';
import Abstract from './abstarct';

const createNewEventTemplate = () => {
  return `<button
    class="trip-main__event-add-btn btn btn--big btn--yellow"
    data-menu-action="${NavigationItems.ADD_NEW_EVENT}"
    type="button"
  >
    New event
  </button>`;
};

export default class NewEvent extends Abstract {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createNewEventTemplate();
  }

  _clickHandler(event) {
    this._callback.click(event.target.dataset.menuAction);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  disable() {
    this.getElement().setAttribute('disabled', true);
  }

  enable() {
    this.getElement().removeAttribute('disabled');
  }
}
