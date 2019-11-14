import WebSocket = require('ws');

describe('Websocket Event Reminder Service Test', () => {
  let ws: WebSocket;
  let wsServerURL = 'ws://localhost:8080';

  beforeEach(() => {
    ws = new WebSocket(wsServerURL);
  });

  afterEach(() => {
    ws.close();
  });

  it('should successfully connect to a websocket server', done => {
    expect.assertions(1);
    ws.on('open', () => {
      expect(true).toEqual(true);
      done();
    });
  });

  it('should be able to create an event reminder', done => {
    expect.assertions(2);
    let createReminderCommand = { action: 'createReminder', payload: { event: 'Meeting @ 2PM', expiration: 'Nov-16-2019 17:45' } };
    let createReminderNotification = { action: 'createReminderNotification', payload: { event: 'Meeting @ 2PM', expiration: 'Nov-16-2019 17:45' } };
    ws.on('open', () => {
      ws.send(JSON.stringify(createReminderCommand));
    });

    ws.on('message', message => {
      let command = JSON.parse(message.toString());
      expect(command).toMatchObject(createReminderNotification);
      expect(command.payload).toHaveProperty('id');
    });
  });
});

// TESTS
// can create an event
// cannot create an event with already expired date
// cannot create an event without required name / expiration
// can get back expired notifcation when event expires
