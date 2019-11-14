import WebSocket = require('ws');
import { AppDAO } from './dao/AppDao';
import { ServerCommand } from './types';
import { EventReminder } from './EventReminder/EventReminder';
import { EventReminderRepository } from './EventReminder/EventReminderRepository';
import { EventReminderService } from './EventReminder/EventReminderService';

const dao = new AppDAO(__dirname + '/dao/database.sqlite');
const wss = new WebSocket.Server({ port: 8080 });
const eventReminderRepo = new EventReminderRepository(dao);
const eventReminderService = new EventReminderService(eventReminderRepo);

// gracefully shutdown socket server
process.on('exit', () => {
  wss.close();
});

wss.on('connection', ws => {
  ws.on('message', async message => {
    let command = parseCommand(message) as ServerCommand;
    // Check if create reminder command
    if (command.action === 'createReminder') {
      let { event, expiration } = command.payload;
      let eventReminder = new EventReminder(event, expiration);
      let res = await eventReminderService.createReminder(eventReminder);
      ws.send(res);
    }
  });
});

// Parses incoming command
const parseCommand = (message: WebSocket.Data) => {
  let command;
  try {
    command = JSON.parse(message.toString());
  } catch (err) {
    command.action = 'Invalid Command';
  }

  return command;
};
