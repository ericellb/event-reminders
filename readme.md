# Flightbook

> Trip building and navigating web service with frontend allowing you to choose Oneway, Roundtrip and Multi city trips.

## Getting Started

Follow these instructions to get the service up and running

### Prerequisites

What things you need to install the software

```
npm
```

### Installing

A step by step series of examples that tell you how to get a development env running

```
git clone https://github.com/ericellb/event-reminders
cd event-reminders
npm install
npm start
```

To get data out of the system, open and WS client of your choice and send data in the following format (I reccomend this Chrome Extension [Smart-Websocket-Client](https://chrome.google.com/webstore/detail/smart-websocket-client/omalebghpgejjiaoknljcfmglgbpocdp) )

```
Request
{
  "action": "createReminder",
  "payload": {
    "event": "Meeting @ 2PM",
    "expiration": "2020-10-10 17:45"
  }
}

Expected Response
{
  "action": "createReminderNotification",
  "payload": {
    "event": "Meeting @ 2PM",
    "expiration": "2020-10-10 17:45",
    "id": 33
  }
}

```

## Running the tests

Run jest

```
npm run test
```

### Break down into end to end tests

- Can connect to Websocket Server

- Can create an event reminder and get expected response

- Cant create an event reminder with already expired expiration date

- Cant create an event reminder without a reminder name

- Can create and event, manually expire the event, and receive the expire event notification

# API Documentation

### Create Reminder

Creates a reminder, and returns back a Create Reminder Notification

- **Action**

  createReminder

- **Payload**

  **Required:**

  `event=[string]`

  `expiration=[date]`

* **Example Request:**

  ```
  {
    "action": "createReminder",
    "payload": {
      "event": "Meeting @ 2PM",
      "expiration": "2020-10-10 17:45"
    }
  }
  ```

* **Success Response:**

  ```
  {
    "action": "createReminderNotification",
    "payload": {
      "event": "Meeting @ 2PM",
      "expiration": "2020-10-10 17:45",
      "id": 33
    }
  }
  ```

* **Error Response:**
  ```
  {
    "action": "createReminderNotification",
    "payload": {
      "error": "Event name required" | 'Expiration date cannot be before current time
    }
  }
  ```

## License

Copyright Eric Ellbogen 2019

- This project is under the **GNU V3** license. [Find it here](https://github.com/ericellb/event-reminders/blob/master/LICENSE).
