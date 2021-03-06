class ResoureManger {
  constructor() {
    this._offers = [];
    this._destinations = [];
  }

  setResources({ destinations, offers }) {
    if (!destinations.length || !offers.length) {
      throw new Error('Not enough resources');
    }

    this._destinations = destinations;
    this._offers = offers;
  }

  getResources() {
    return {
      destinations: this._destinations,
      offers: this._adaptOffersToClient(this._offers),
    };
  }

  _adaptOffersToClient(offers) {
    const map = {};
    offers.forEach((offer) => {
      if (offer.offers.length) {
        map[offer.type] = offer.offers.map((current) => ({
          id: current.title,
          price: current.price,
          name: current.title,
        }));
      }
    });

    return map;
  }
}

export default new ResoureManger();
