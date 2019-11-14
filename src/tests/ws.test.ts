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
    let createReminderCommand = { action: 'createReminder', payload: { event: 'Meeting @ 2PM', expiration: 'Nov-16-2020 17:45' } };
    let createReminderNotification = { action: 'createReminderNotification', payload: { event: 'Meeting @ 2PM', expiration: 'Nov-16-2020 17:45' } };

    ws.on('open', () => {
      ws.send(JSON.stringify(createReminderCommand));
    });

    ws.on('message', message => {
      let command = JSON.parse(message.toString());
      expect(command).toMatchObject(createReminderNotification);
      expect(command.payload).toHaveProperty('id');
      done();
    });
  });

  it('shouldnt be able to create an event remidner with already expired date', done => {
    expect.assertions(1);
    let expiredCreateReminderCommand = { action: 'createReminder', payload: { event: 'Meeting @ 2PM', expiration: 'Nov-10-2015 17:45' } };
    let expiredCreateReminderNotification = { action: 'createReminderNotification', payload: { error: 'Expiration date cannot be before current time' } };

    ws.on('open', () => {
      ws.send(JSON.stringify(expiredCreateReminderCommand));
    });

    ws.on('message', message => {
      let command = JSON.parse(message.toString());
      expect(command).toMatchObject(expiredCreateReminderNotification);
      done();
    });
  });

  it('shouldnt be able to create an event reminder without a name', done => {
    expect.assertions(1);
    let expiredCreateReminderCommand = { action: 'createReminder', payload: { event: '', expiration: 'Nov-10-2020 17:45' } };
    let expiredCreateReminderNotification = { action: 'createReminderNotification', payload: { error: 'Event name required' } };

    ws.on('open', () => {
      ws.send(JSON.stringify(expiredCreateReminderCommand));
    });

    ws.on('message', message => {
      let command = JSON.parse(message.toString());
      expect(command).toMatchObject(expiredCreateReminderNotification);
      done();
    });
  });

  it('should receive an expire event notifically when manually expiring an evnet', done => {
    expect.assertions(1);
    let createReminderCommand = { action: 'createReminder', payload: { event: 'Meeting @ 2PM', expiration: 'Nov-16-2020 17:45' } };
    let expireReminderCommand = { action: 'expireReminder', payload: { id: 0 } };
    let expireReminderNotification = { action: 'expireReminderNotification', payload: { event: 'Meeting @ 2PM' } };

    ws.on('open', () => {
      ws.send(JSON.stringify(createReminderCommand));
    });

    ws.on('message', message => {
      let command = JSON.parse(message.toString());
      if (command.action === 'createReminderNotification') {
        expireReminderCommand.payload.id = command.payload.id;
        ws.send(JSON.stringify(expireReminderCommand));
      } else if (command.action === 'expireReminderNotification') {
        expect(command).toMatchObject(expireReminderNotification);
        done();
      }
    });
  });
});
