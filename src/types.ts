export interface ServerCommand {
  action: 'createReminder' | 'expireReminder';
  payload: CreateReminder | ExpireReminder;
}

export type CreateReminder = {
  event: string;
  expiration: Date;
};

export type ExpireReminder = {
  id: number;
};

export interface ClientCommand {
  action: 'createReminderNotification' | 'expireReminderNotification';
  payload: CreateReminderNotification | ExpireReminderNotification;
}

export type CreateReminderNotification = {
  action: 'createReminderNotification';
  payload: {
    event?: string;
    expiration?: Date;
    id?: number;
    error?: string;
  };
};

export type ExpireReminderNotification = {
  action: 'expireReminderNotification';
  payload: {
    event?: string;
    error?: string;
  };
};


export type EventReminderRow {
  id: number;
  event: string;
  expiration: Date;
  expired: number;
}