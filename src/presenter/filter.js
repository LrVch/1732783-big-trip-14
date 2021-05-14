import FilterView from '../view/filter';
import { render, replace, remove, PlaceToInsert } from '../utils/render';
import { UpdateType } from '../constants';
import { calculateFilterDisableState } from '../utils';

export default class Filter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;

    this._filterComponent = null;
    this._disabled = false;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const events = this._eventsModel.getEvents();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(
      calculateFilterDisableState(events),
      this._filterModel.getFilter(),
      this._disabled,
    );
    this._filterComponent.setFilterTypeChangeHandler(
      this._handleFilterTypeChange,
    );

    if (prevFilterComponent === null) {
      render(
        this._filterContainer,
        this._filterComponent,
        PlaceToInsert.BEFORE_END,
      );
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  disable() {
    this._disabled = true;
    this._filterComponent.disable();
  }

  enable() {
    const disabledState = calculateFilterDisableState(
      this._eventsModel.getEvents(),
    );

    this._disabled = false;
    this._filterComponent.enable(disabledState);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
