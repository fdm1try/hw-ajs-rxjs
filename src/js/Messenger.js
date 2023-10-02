import moment from 'moment';
import { pluck } from 'rxjs/operators';
import GlobalStore from './GlobalStore';

export default class Messenger {
  #messages = [];

  static get updateInterval() { return 3000; }

  static get markup() {
    return `
      <div class="messenger">
        <div class="messenger-incoming">
          <h2 class="messenger-incoming-title">Incoming</h2>
          <div class="messenger-incoming-messages">
          </div>
        </div>
      </div>
    `;
  }

  static get markupMessage() {
    return `
      <div class="messenger-message">
        <address class="messenger-message-from">
          <a href='#' class="messenger-message-from-mail"></a>
        </address>
        <div class="messenger-message-subject"></div>
        <div class="messenger-message-date"></div>
      </div>
    `;
  }

  static get selector() { return '.messenger'; }

  static get selectorIncomingList() { return '.messenger-incoming-messages'; }

  static get selectorMessage() { return '.messenger-message-container'; }

  static get selectorMessageFrom() { return '.messenger-message-from'; }

  static get selectorMessageFromLink() { return '.messenger-message-from-mail'; }

  static get selectorMessageSubject() { return '.messenger-message-subject'; }

  static get selectorMessageDate() { return '.messenger-message-date'; }

  constructor() {
    this.container = document.body;
    this.addMessage = this.addMessage.bind(this);

    this.registerEvents();
  }

  registerEvents() {
    GlobalStore.unreadMessages$.pipe(pluck('messages'))
      .subscribe((messages) => messages.forEach(this.addMessage));
  }

  bindToDOM(el) {
    this.container = el;
  }

  render() {
    this.container.innerHTML = Messenger.markup;
    this.elIncomingMessages = this.container.querySelector(Messenger.selectorIncomingList);

    const messages = this.#messages;
    this.#messages = [];
    while (messages.length) {
      this.addMessage(messages.pop());
    }
  }

  addMessage(message) {
    const container = document.createElement('div');
    container.classList.add('messenger-message-container');
    container.innerHTML = Messenger.markupMessage;

    const elFrom = container.querySelector(Messenger.selectorMessageFromLink);
    const elSubject = container.querySelector(Messenger.selectorMessageSubject);
    const elDate = container.querySelector(Messenger.selectorMessageDate);

    elFrom.textContent = message.from;
    elFrom.href = `mailto:${message.from}`;
    elDate.textContent = moment(message.date).format('HH:mm DD.MM.YYYY');
    let { subject } = message;
    if (subject.length > 15) subject = `${subject.slice(0, 15)}...`;
    elSubject.textContent = subject;

    this.elIncomingMessages.insertAdjacentElement('afterbegin', container);
    this.#messages.push(message);
  }
}
