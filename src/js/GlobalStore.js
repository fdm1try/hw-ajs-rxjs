import { ajax } from 'rxjs/ajax';
import { interval, of } from 'rxjs';
import { mergeMap, startWith, catchError } from 'rxjs/operators';

export default class GlobalStore {
  static get updateInterval() {
    return 3000;
  }

  static #unreadMessages$ = interval(GlobalStore.updateInterval)
    .pipe(
      startWith(GlobalStore.unreadMessagesRequest$.subscribe),
      mergeMap(() => GlobalStore.unreadMessagesRequest$),
    );

  static get unreadMessagesRequest$() {
    return ajax.getJSON(GlobalStore.endpointGetUnreadMessages).pipe(
      catchError((error) => of({
        status: 'error', error, timestamp: new Date(), messages: [],
      })),
    );
  }

  static get unreadMessages$() {
    return GlobalStore.#unreadMessages$;
  }

  static get endpoint() {
    // eslint-disable-next-line no-undef
    return `http${SERVER_USESSL ? 's' : ''}://${SERVER_HOST}:${SERVER_PORT}`;
  }

  static get endpointGetUnreadMessages() {
    return `${GlobalStore.endpoint}/messages/unread`;
  }
}
