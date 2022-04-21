// Description: Catch focus and blur events and notify

import {Subject} from 'rxjs';

const notificationSubject = new Subject();

function onChangeEvent() {
  return notificationSubject.asObservable();
}

function changeEvent(eventType) {
  notificationSubject.next(eventType);
}

export const cellTableService = {
  changeEvent,
  onChangeEvent,
};
