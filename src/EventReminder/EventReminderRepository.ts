import { AppDAO } from '../dao/AppDao';
import { EventReminder } from './EventReminder';
import { CreateReminderNotification, EventReminderRow } from '../types';

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

  public async getById(id: number) {
    try {
      let sql = 'SELECT * from event_reminders WHERE id = ?';
      let params = [id];
      let result = await this.dao.get<EventReminderRow>(sql, params);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async expireById(id: number) {
    try {
      let sql = 'UPDATE event_reminders SET expired=1 WHERE id=?';
      let params = [id];
      let result = await this.dao.run(sql, params);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
}
