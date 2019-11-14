import WebSocket = require('ws');
import { AppDAO } from './dao/AppDao';
import { ServerCommand, CreateReminder, ExpireReminder } from './types';
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
      let { event, expiration } = command.payload as CreateReminder;
      let eventReminder = new EventReminder(event, expiration);
      let res = await eventReminderService.createReminder(eventReminder);
      ws.send(res);
    } else if (command.action === 'expireReminder') {
      let { id } = command.payload as ExpireReminder;
      let eventReminderName = await eventReminderService.getReminder(id);
      if (eventReminderName) {
        let res = await eventReminderService.expireReminder(id, eventReminderName);
        ws.send(res);
      }
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
