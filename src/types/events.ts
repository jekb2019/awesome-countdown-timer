import { CountdownTimerInfo } from './countdownTimer';

export type CountdownTimerEventType =
  | 'create'
  | 'start' // Event fired right before countdown timer starts
  | 'pause' // Event fired right after countdown timer is paused
  | 'finish'
  | 'tick'
  | 'reset';

export type CountdownTimerEvent = {
  eventType: CountdownTimerEventType;
  countdownTimerInfo: CountdownTimerInfo;
};
