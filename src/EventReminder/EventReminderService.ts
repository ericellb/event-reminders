import { EventReminderRepository } from './EventReminderRepository';
import { EventReminder } from './EventReminder';
import { CreateReminderNotification } from '../types';

export class EventReminderService {
  private eventReminderRepo: EventReminderRepository;

  constructor(eventReminderRepo: EventReminderRepository) {
    this.eventReminderRepo = eventReminderRepo;
  }

  public async createReminder(eventReminder: EventReminder) {
    let errors = eventReminder.validate();
    let res: CreateReminderNotification = { action: 'createReminderNotification', payload: {} };

    if (errors.error) {
      res.payload.error = errors.error;
      return JSON.stringify(res);
    }

    try {
      let row = await this.eventReminderRepo.insert(eventReminder);
      res.payload.event = eventReminder.event;
      res.payload.expiration = eventReminder.expiration;
      res.payload.id = row.id;
    } catch (err) {
      res.payload.error = err;
    }

    return JSON.stringify(res);
  }
}
