import { nanoid } from 'nanoid';
import {
  CountdownTimer,
  CountdownTimerConfig,
  CountdownTimerInfo,
  TimerID,
} from '../types/countdownTimer';
import { CreateCountdownTimerError } from '../errors/timerErrors';
import { convertToInteger, isInteger, isPositiveNumber } from '../util/number';
import { CountdownTimerState } from '../types/states';

function getTimerCreationErrorMessage(config: CountdownTimerConfig) {
  if (!config) {
    return 'Please provide configuration for timer';
  }

  const { startTime } = config;

  if (
    startTime == null ||
    !isInteger(startTime) ||
    !isPositiveNumber(startTime)
  ) {
    return 'Countdown timer config requires a non-negative integer `startTime`';
  }

  return null;
}

export class CountdownTimerImpl implements CountdownTimer {
  readonly id: TimerID;
  private startTime: number;
  private currentTime: number;
  private state: CountdownTimerState = 'idle';

  constructor(config: CountdownTimerConfig) {
    const errorMsg = getTimerCreationErrorMessage(config);

    if (errorMsg) {
      throw new CreateCountdownTimerError(errorMsg);
    }

    const { startTime } = config;
    const startTimeInNumber = convertToInteger(startTime);

    this.id = nanoid();
    this.currentTime = startTimeInNumber;
    this.startTime = startTime;
  }

  startTimer() {
    console.log('Timer started');
    return this;
  }

  pauseTimer() {
    console.log('Timer paused');
    return this;
  }

  finishTimer() {
    console.log('Timer finished');
    return this;
  }

  getInfo(): CountdownTimerInfo {
    return {
      state: this.state,
      currentTime: this.currentTime,
      startTime: this.startTime,
    };
  }
}
