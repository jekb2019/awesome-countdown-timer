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
  getInfo: () => CountdownTimerInfo;
}

export type CountdownTimerConfig = {
  startTime: number;
  onCreate?: CountdownTimerEventHandler;
  onStart?: CountdownTimerEventHandler;
  onPause?: CountdownTimerEventHandler;
  onTick?: CountdownTimerEventHandler;
  onFinish?: CountdownTimerEventHandler;
};

export type CountdownTimerInfo = {
  state: CountdownTimerState;
  currentTime: number;
  startTime: number;
};

export type CountdownTimerEventHandler = (event?: CountdownTimerEvent) => void;
