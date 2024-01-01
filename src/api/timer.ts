import { CountdownTimer } from '../classes/CountdownTimer';
import { ICountdownTimer, CountdownTimerConfig } from '../types/countdownTimer';

export function createCountdownTimer(config: CountdownTimerConfig) {
  const timer: ICountdownTimer = new CountdownTimer(config);
  return timer;
}
