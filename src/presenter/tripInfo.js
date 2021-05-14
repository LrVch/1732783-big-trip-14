import { render, replace, remove, PlaceToInsert } from '../utils/render';
import TripCostView from '../view/trip-cost';
import TripInfoView from '../view/trip-info';
import {
  caclucateEventsCities,
  caclucateEventsDates,
  calculateTotal
} from '../utils';

export default class TripInfo {
  constructor(infoContainer, eventsModel) {
    this._infoContainer = infoContainer;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = null;
    this._tripCostComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const events = this._eventsModel.getEvents();
    const prevTripInfoComponent = this._tripInfoComponent;
    const prevTripCostComponent = this._tripCostComponent;

    this._tripInfoComponent = new TripInfoView({
      cities: caclucateEventsCities(events),
      dates: caclucateEventsDates(events),
    });

    this._tripCostComponent = new TripCostView(calculateTotal(events));

    if (prevTripInfoComponent === null || prevTripCostComponent === null) {
      render(
        this._infoContainer,
        this._tripInfoComponent,
        PlaceToInsert.BEFORE_END,
      );
      render(
        this._infoContainer,
        this._tripCostComponent,
        PlaceToInsert.BEFORE_END,
      );
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    replace(this._tripCostComponent, prevTripCostComponent);
    remove(prevTripInfoComponent);
    remove(prevTripCostComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
