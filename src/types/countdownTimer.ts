import { CountdownTimerState } from './states';

export type TimerID = string;

export interface CountdownTimer {
  id: TimerID;
  startTimer: () => CountdownTimer;
  pauseTimer: () => CountdownTimer;
  finishTimer: () => CountdownTimer;
  getInfo: () => CountdownTimerInfo;
}

export type CountdownTimerConfig = {
  startTime: number;
};

export type CountdownTimerInfo = {
  state: CountdownTimerState;
  currentTime: number;
  startTime: number;
};
