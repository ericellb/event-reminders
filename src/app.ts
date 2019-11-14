import WebSocket = require('ws');
import { AppDAO } from './dao/AppDao';
import { ServerCommand, CreateReminder, ExpireReminder, ExpireReminderNotification } from './types';
import { EventReminder } from './EventReminder/EventReminder';
import { EventReminderRepository } from './EventReminder/EventReminderRepository';
import { EventReminderService } from './EventReminder/EventReminderService';

const dao = new AppDAO(__dirname + '/dao/database.sqlite');
const wss = new WebSocket.Server({ port: 8080 });
const eventReminderRepo = new EventReminderRepository(dao);
const eventReminderService = new EventReminderService(eventReminderRepo);
let clients: WebSocket[] = [];

// gracefully shutdown socket server
process.on('exit', () => {
  wss.close();
});

wss.on('connection', ws => {
  // Add to client list on connection
  clients.push(ws);

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
      let eventReminderName = await eventReminderService.getById(id);
      if (eventReminderName) {
        let res = await eventReminderService.expireById(id, eventReminderName);
        ws.send(res);
      }
    }
  });

  // Remove from client list on socket close
  ws.on('close', () => {
    clients.forEach((client, i) => {
      if (client === ws) {
        clients.splice(i, 1);
      }
    });
  });
});

wss.on('listening', () => {
  console.log('Web Socket Server Started');

  // Every minute query DB for expired events and broadcast them
  setInterval(() => {
    console.log('doing');
    const findAllExpiredEventReminders = async () => {
      let eventReminders = await eventReminderService.getAllExpired();
      eventReminders.forEach(async eventReminder => {
        let expireReminderNotification = await eventReminderService.expireById(eventReminder.id, eventReminder.event);
        broadCastExpiredReminder(expireReminderNotification);
      });
    };

    findAllExpiredEventReminders();
  }, 60000);
});

const broadCastExpiredReminder = (expireReminderNotification: string) => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(expireReminderNotification);
    }
  });
};

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
