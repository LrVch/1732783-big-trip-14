import Abstract from './abstarct';
import { NavigationItems } from '../constants';

const createNavigationTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" data-menu-action="${NavigationItems.TABLE}" href="#">Table</a>
    <a class="trip-tabs__btn" data-menu-action="${NavigationItems.STATS}" href="#">Stats</a>
  </nav>`;
};

export default class Navigation extends Abstract {
  constructor(initialMenuItem = NavigationItems.TABLE) {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);

    this._disabledItems = {};
    this._active = initialMenuItem;

    this.setMenuItem(this._active);
  }

  getTemplate() {
    return createNavigationTemplate();
  }

  _menuClickHandler(event) {
    event.preventDefault();
    const menuItem = event.target.dataset.menuAction;

    if (this._disabledItems[menuItem]) {
      return;
    }

    this._callback.menuClick(menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    Array.from(this.getElement().querySelectorAll('.trip-tabs__btn')).forEach(
      (elem) => {
        elem.addEventListener('click', this._menuClickHandler);
      },
    );
  }

  setMenuItem(menuItem) {
    if (this._disabledItems[menuItem]) {
      return;
    }

    this._active = menuItem;

    Array.from(this.getElement().querySelectorAll('.trip-tabs__btn')).forEach(
      (elem) => {
        elem.classList.remove('trip-tabs__btn--active');
      },
    );

    const item = this.getElement().querySelector(
      `[data-menu-action=${menuItem}]`,
    );

    if (item !== null) {
      item.classList.add('trip-tabs__btn--active');
    }
  }

  disableMenuItem(menuItem) {
    this._disabledItems[menuItem] = true;
  }

  enableMenuItem(menuItem) {
    this._disabledItems[menuItem] = false;
  }

  getActiveItem() {
    return this._active;
  }
}
