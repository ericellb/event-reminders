export class EventReminder {
  public event: string;
  public expiration: Date;

  constructor(event: string, expiration: Date, id?: number);
  constructor(event: string, expiration: Date, id: number) {
    this.event = event;
    this.expiration = expiration;
  }

  public validate = () => {
    let errors = { error: '' };

    if (this.event === '') {
      errors.error = 'Event name required';
    }

    if (new Date(this.expiration) < new Date()) {
      errors.error = 'Expiration date cannot be before current time';
    }

    return errors;
  };
}
