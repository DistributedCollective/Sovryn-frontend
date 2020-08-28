import { EventActions } from '@drizzle/store';

export const contractEventNotifier = store => next => action => {
  if (action.type === EventActions.EVENT_FIRED) {
    const contract = action.name;
    const contractEvent = action.event.event;
    const message = action.event.returnValues._message;
    const display = `${contract}(${contractEvent}): ${message}`;

    console.log('event is: ', display);
  }
  return next(action);
};
