import {Subject} from 'rxjs';

const calendarSubject = new Subject();

function onCalendar() {
  return calendarSubject.asObservable().pipe();
}

function calendarFire(eventType) {
  calendarSubject.next(eventType);
}

export const calendarService = {
  onCalendar,
  calendarFire
};
