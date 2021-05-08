import { FilterType } from '../constants';
import { isEventInFuture, isEventInPast, isEventEverything } from './event';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) =>
    events.filter(
      (event) =>
        isEventEverything(event.startDate, event.endDate) ||
        isEventInFuture(event.startDate),
    ),
  [FilterType.PAST]: (events) =>
    events.filter(
      (event) =>
        isEventEverything(event.startDate, event.endDate) ||
        isEventInPast(event.endDate),
    ),
};
