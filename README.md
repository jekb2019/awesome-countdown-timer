# Awesome Countdown Timer

A simple, easy-to-use, Javascript timer.

You can use `awesome-countdown-timer` to add countdown timers to your Javascript project.

# Installation

```
npm install awesome-countdown-timer
```

# Demo

# Getting Started

### Create a Countdown Timer

You can create new countdown timer using `createCountdownTimer` function.
`createCountwornTimer` accepts a single configuration object.

```javascript
import { createCountdownTimer } from 'awesome-countdown-timer';

const timer = createCountdownTimer({
  startTime: 10, // 10 seconds countdown timer
  onTick: (event) => console.log(event), // onTick is invoked every second when timer is running
});
```

### Starting Timer

You can start or resume (if timer is paused) the countdown timer using `startTimer`.

```javascript
timer.startTimer();
```

### Pausing Timer

You can pause timer using `pauseTimer`

```javascript
timer.pauseTimer();
```

### Finishing Timer

When you invoke `finishTimer`, the `currentTime` will become `0` and `state` will become `idle`

```javascript
timer.finishTimer();
```

### Resetting Timer

You can reset timer using `resetTimer`.

```javascript
timer.resetTimer();
```

### Getting Current State of the timer

You can get the current state of the timer by using `getInfo`

```javascript
const info = timer.getInfo();
console.log(info);
```

# Documentation

## Configuration

## Timer States

## Timer State Transition

## Timer Events

## Event Listeners

## API
