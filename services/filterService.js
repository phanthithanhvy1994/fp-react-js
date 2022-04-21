import {Subject} from 'rxjs';

const filterSubject = new Subject();

function onFilter() {
  return filterSubject.asObservable().pipe();
}

function filterFire(eventType) {
  filterSubject.next(eventType);
}

function clear() {
  filterSubject.next({});
}

export const filterService = {
  onFilter,
  filterFire,
  clear,
};
