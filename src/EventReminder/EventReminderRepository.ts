import { AppDAO } from '../dao/AppDao';
import { EventReminder } from './EventReminder';
import { CreateReminderNotification } from '../types';

export class EventReminderRepository {
  private dao: AppDAO;

  constructor(dao: AppDAO) {
    this.dao = dao;
  }

  public async insert(eventReminder: EventReminder) {
    try {
      let sql = 'INSERT INTO event_reminders (event, expiration, expired) VALUES (?,?,0)';
      let params = [eventReminder.event, eventReminder.expiration];
      let result = await this.dao.run(sql, params);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
}
