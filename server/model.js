const { faker } = require('@faker-js/faker');

let lastResponse = new Date();

function getNewMessages() {
  let count = Math.round(Math.random() * 3);
  const messages = [];
  while (count) {
    messages.push({
      id: faker.string.uuid(),
      from: faker.internet.email(),
      subject: faker.company.catchPhrase(),
      body: faker.lorem.lines({ min: 1, max: 10 }),
      received: faker.date.between({ from: lastResponse, to: new Date() }),
    });
    count -= 1;
  }
  if (messages.length) {
    lastResponse = new Date();
  }
  messages.sort((a, b) => a.received - b.received);
  return messages;
}

module.exports = getNewMessages;
