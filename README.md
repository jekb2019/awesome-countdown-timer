# Awesome Countdown Timer

The Awesome Countdown Timer is a simple, efficient JavaScript library designed to implement countdown timers seamlessly within your projects.

# Installation

Install the Awesome Countdown Timer via npm:

```
npm install awesome-countdown-timer
```

# Demo

TBD

# Getting Started

### Creating a Countdown Timer

To create a new countdown timer, use the `createCountdownTimer` function, which accepts a configuration object:

```javascript
import { createCountdownTimer } from 'awesome-countdown-timer';

const timer = createCountdownTimer({
  startTime: 10, // 10 seconds countdown timer
  onTick: (event) => console.log(event), // onTick is invoked every second when timer is running
});
```

### Starting the Countdown Timer

Start the countdown timer using `startTimer`

```javascript
timer.startTimer();
```

### Pausing Countdown Timer

Pause the countdown timer using `pauseTimer`

```javascript
timer.pauseTimer();
```

### Finishing Timer

Invoke `finishTimer` to set the current time to `0`.

```javascript
timer.finishTimer();
```

### Resetting Timer

Reset the timer to its initial state using `resetTimer`.

```javascript
timer.resetTimer();
```

### Getting Current State

Retrieve the current timer state using `getInfo`.

```javascript
const info = timer.getInfo();
console.log(info);
```

# Documentation

## Countdown Timer Configuration

The `createCountdownTimer` function accepts a `CountdownTimerConfig` object with the following properties:

```typescript
type CountdownTimerConfig = {
  startTime: number;
  disableInvalidStateTransitionError?: boolean;
  onCreate?: (event?: CountdownTimerEvent) => void;
  onStart?: (event?: CountdownTimerEvent) => void;
  onPause?: (event?: CountdownTimerEvent) => void;
  onTick?: (event?: CountdownTimerEvent) => void;
  onFinish?: (event?: CountdownTimerEvent) => void;
  onReset?: (event?: CountdownTimerEvent) => void;
};
```

| field                              | description                                                   | type     |
| ---------------------------------- | ------------------------------------------------------------- | -------- |
| startTime                          | Duration of the timer in seconds                              | number   |
| disableInvalidStateTransitionError | Disables throwing error when invalid state transition happens | boolean  |
| onCreate (optional)                | Event handler for `create` event                              | function |
| onStart (optional)                 | Event handler for `start` event                               | function |
| onPause (optional)                 | Event handler for `pause` event                               | function |
| onTick (optional)                  | Event handler for `tick` event                                | function |
| onFinish (optional)                | Event handler for `finish` event                              | function |
| onReset (optional)                 | Event handler for `reset` event                               | function |

## Countdown Timer States

The countdown timer can be in the following states:

| state    | description                                                                            |
| -------- | -------------------------------------------------------------------------------------- |
| idle     | Countdown timer is not started yet.                                                    |
| running  | Countdown timer is currently running. The timer will trigger `tick` event every second |
| paused   | Countdown timer is paused.                                                             |
| finished | Countdown timer has reached `0` seconds and finished.                                  |

## Countdown Timer API

The countdown timer object created by `createCountdownTimer` includes the following properties and methods:

```typescript
export interface ICountdownTimer {
  id: TimerID;
  addEventListener: (
    type: CountdownTimerEventType,
    handler: CountdownTimerEventHandler
  ) => void;
  startTimer: () => ICountdownTimer;
  pauseTimer: () => ICountdownTimer;
  finishTimer: () => ICountdownTimer;
  resetTimer: () => ICountdownTimer;
  getInfo: () => CountdownTimerInfo;
}
```

| property        | description                                                                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id              | Unique id of the countdown timer                                                                                                                         |
| addEventListenr | Attach event listener to `CountdownTimerEventType` events                                                                                                |
| startTimer      | Start (if state is `idle`) or resume (if stats is `paused`) countdown timer                                                                              |
| pauseTImer      | Pause countdown timer                                                                                                                                    |
| finishTimer     | Forcefully finish countdown timer. This will make the state `finished` and make the current time to `0`                                                  |
| resetTimer      | Reset timer to it's initial state. It will change the state to `idle`and current time to whatever `startTime` it was given in the `CountdownTimerConfig` |
| getInfo         | Get current information about the countdown timer                                                                                                        |

## Countdown Timer States

```typescript
type CountdownTimerState = 'idle' | 'running' | 'paused' | 'finished';
```

#### State Transition

The countdown timer changes states based on specific API calls, transitioning between `idle`, `running`, `paused`, and `finished` states.

| Situation              | State transition                       |
| ---------------------- | -------------------------------------- |
| Create countdown timer | countdown timer initializes to `idle`  |
| Reset countdown timer  | any state → `idle`                     |
| Start countdown timer  | `idle` \| `paused` → `running`         |
| Pause countdown timer  | `running` → `paused`                   |
| Finish countdown timer | `idle`\|`paused`\|`running` → `paused` |

#### Invalid State Transition

When `disableInvalidStateTransitionError` is enabled in `CountdownTimerConfig`, invalid transition will throw error.

The following state transitions are invalid.

| Invalid state transition |
| ------------------------ |
| `running` → `running`    |
| `finished` → `running`   |
| `idle` → `paused`        |
| `paused` → `paused`      |
| `finished` → `paused`    |

## Countdown Timer Events and Event Handlers

### Countdown Timer Events

The countdown timer fires events such as `create`, `start`, `pause`, `finish`, `tick`, and re`set, triggering respective event handlers when attached.

| Event type | Description                                                   | Event listener |
| ---------- | ------------------------------------------------------------- | -------------- |
| `create`   | Fired when countdown timer is created`                        | `onCreate`     |
| `start`    | Fired when countdown timer starts                             | `onStart`      |
| `pause`    | Fired when countdown timer pauses                             | `onPause`      |
| `finish`   | Fired when countdown finishes                                 | `onFinish`     |
| `tick`     | Fired every second when countdown timer is in `running` state | `onTick`       |
| `reset`    | Fired when countdown timer resets                             | `onReset`      |

### Event Handlers

When an event fires, corresponding event handler will be invoked.

Event handlers can be attached in two ways:

1. Passing Event Handlers When Creating Countdown Timer
2. Dynamically Attaching Event Handlers

### Passing Event Handlers When Creating Countdown Timer

```javascript
const timer = createCountdownTimer({
  startTime: 10,
  onCreate: (event) => {
    console.log(event);
  },
  onStart: (event) => {
    console.log(event);
  },
  onTick: (event) => {
    console.log(event);
  },
  onPause: (event) => {
    console.log(event);
  },
  onFinish: (event) => {
    console.log(event);
  },
  onReset: (event) => {
    console.log(event);
  },
});
```

### Dynamically Attaching Event Handlers

Event handlers can be dynamically attached using the `addEventListener`.

```javascript
timer.addEventListener('create', (event) => {
  console.log(event);
});
```

# Technologies used

### Web Worker

`awesome-countdown-timer` utilizes [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) to ensure accurately update time in the background thread (not the main thread).

### Webpack

`awesome-countdown-timer` is bundled using [Webpack](https://webpack.js.org/).

### Typescript

`awesome-countdown-timer` provides type declaration files for those who are integrating `awesome-countdown-timer` to a [Typescript](https://www.typescriptlang.org/) project.
