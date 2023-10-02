import Messenger from './Messenger';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const messenger = new Messenger();
  messenger.bindToDOM(container);
  messenger.render();
});
