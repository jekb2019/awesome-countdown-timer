import { CountdownTimerEvent, CountdownTimerEventType } from './events';
import { CountdownTimerState } from './states';

export type TimerID = string;

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

export type CountdownTimerConfig = {
  startTime: number;
  disableInvalidStateTransitionError?: boolean; // When disabled, it will not trigger error for invalid state transition - Transition will just not happen
  onCreate?: CountdownTimerEventHandler;
  onStart?: CountdownTimerEventHandler;
  onPause?: CountdownTimerEventHandler;
  onTick?: CountdownTimerEventHandler;
  onFinish?: CountdownTimerEventHandler;
  onReset?: CountdownTimerEventHandler;
};

export type CountdownTimerInfo = {
  id: TimerID;
  state: CountdownTimerState;
  currentTime: number;
  startTime: number;
};

export type CountdownTimerEventHandler = (event?: CountdownTimerEvent) => void;
