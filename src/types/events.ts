import { CountdownTimerInfo } from './countdownTimer';

export type CountdownTimerEventType =
  | 'create'
  | 'start'
  | 'pause'
  | 'finish'
  | 'tick';

export type CountdownTimerEvent = {
  eventType: CountdownTimerEventType;
  countdownTimerInfo: CountdownTimerInfo;
};
