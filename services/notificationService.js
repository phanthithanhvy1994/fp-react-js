import {Subject} from 'rxjs';

const notificationSubject = new Subject();

function onNotify() {
  return notificationSubject.asObservable().pipe();
}

function notify(type, content) {
  notificationSubject.next({type, content});
}

function clear() {
  notificationSubject.next({});
}

export const notificationService = {
  onNotify,
  notify,
  clear,
};
