export interface ServerCommand {
  action: 'createReminder';
  payload: CreateReminder;
}

export type CreateReminder = {
  event: string;
  expiration: Date;
};

export type CreateReminderNotification = {
  action: 'createReminderNotification';
  payload: {
    event?: string;
    expiration?: Date;
    id?: number;
    error?: string;
  };
};
