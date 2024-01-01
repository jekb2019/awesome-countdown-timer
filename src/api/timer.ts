import { CountdownTimerImpl } from '../classes/CountdownTimer';
import { CountdownTimer, CountdownTimerConfig } from '../types/countdownTimer';

export function createTimer(config: CountdownTimerConfig) {
  const timer: CountdownTimer = new CountdownTimerImpl(config);
  return timer;
}
