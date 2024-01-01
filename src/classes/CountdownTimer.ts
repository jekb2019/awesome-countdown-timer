import { nanoid } from 'nanoid';
import {
  ICountdownTimer,
  CountdownTimerConfig,
  CountdownTimerInfo,
  TimerID,
  CountdownTimerEventHandler,
} from '../types/countdownTimer';
import {
  CountdownTimerEventHandlerError,
  CountdownTimerInvalidStateTransitionError,
  CreateCountdownTimerError,
} from '../errors/timerErrors';
import { convertToInteger, isInteger, isPositiveNumber } from '../util/number';
import { CountdownTimerState } from '../types/states';
import { CountdownTimerEventType } from '../types/events';
import { setAccurateInterval } from '../util/accurateTimer';
import { ONE_SECOND_IN_MS } from '../constants/time';

function getTimerCreationErrorMessage(config: CountdownTimerConfig) {
  if (!config) {
    return 'CountdownTimerConfig required';
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

export class CountdownTimer implements ICountdownTimer {
  readonly id: TimerID;
  private startTime: number;
  private currentTime: number;
  private state: CountdownTimerState = 'idle';
  private disableInvalidStateTransitionError = false;

  private onCreate: CountdownTimerEventHandler = () => {};
  private onStart: CountdownTimerEventHandler = () => {};
  private onPause: CountdownTimerEventHandler = () => {};
  private onTick: CountdownTimerEventHandler = () => {};
  private onFinish: CountdownTimerEventHandler = () => {};
  private onReset: CountdownTimerEventHandler = () => {};

  private clearAccurateInterval: Function = null;

  constructor(config: CountdownTimerConfig) {
    const errorMsg = getTimerCreationErrorMessage(config);

    if (errorMsg) {
      throw new CreateCountdownTimerError(errorMsg);
    }

    const {
      startTime,
      disableInvalidStateTransitionError,
      onCreate,
      onStart,
      onPause,
      onTick,
      onFinish,
      onReset,
    } = config;

    const startTimeInNumber = convertToInteger(startTime);

    this.id = nanoid();
    this.currentTime = startTimeInNumber;
    this.startTime = startTime;
    this.disableInvalidStateTransitionError = Boolean(
      disableInvalidStateTransitionError
    );

    if (onCreate) {
      this.onCreate = onCreate;
    }
    if (onStart) {
      this.onStart = onStart;
    }
    if (onPause) {
      this.onPause = onPause;
    }
    if (onTick) {
      this.onTick = onTick;
    }
    if (onFinish) {
      this.onFinish = onFinish;
    }
    if (onReset) {
      this.onReset = onReset;
    }

    this.fireEvent('create');
  }

  private fireEvent(type: CountdownTimerEventType) {
    let handler: CountdownTimerEventHandler;
    switch (type) {
      case 'create': {
        handler = this.onCreate;
        break;
      }
      case 'start': {
        handler = this.onStart;
        break;
      }
      case 'pause': {
        handler = this.onPause;
        break;
      }
      case 'tick': {
        handler = this.onTick;
        break;
      }
      case 'finish': {
        handler = this.onFinish;
        break;
      }
      case 'reset': {
        handler = this.onReset;
        break;
      }
    }

    const timerInfo = this.getInfo();
    try {
      handler({
        eventType: type,
        countdownTimerInfo: timerInfo,
      });
    } catch (error) {
      throw new CountdownTimerEventHandlerError(error);
    }
  }

  private setInternalTimer(callback: Function) {
    this.clearAccurateInterval = setAccurateInterval(
      callback,
      ONE_SECOND_IN_MS
    );
  }

  private clearInternalTimer() {
    if (this.clearAccurateInterval) {
      this.clearAccurateInterval();
    }
  }

  private updateState(newState: CountdownTimerState) {
    if (newState === 'running') {
      if (this.state === 'finished' || this.state === 'running') {
        if (!this.disableInvalidStateTransitionError) {
          throw new CountdownTimerInvalidStateTransitionError(
            this.state,
            newState
          );
        }
        return;
      }
    }

    if (newState === 'paused') {
      if (this.state !== 'running') {
        if (!this.disableInvalidStateTransitionError) {
          throw new CountdownTimerInvalidStateTransitionError(
            this.state,
            newState
          );
        }
        return;
      }
    }

    this.state = newState;
  }

  addEventListener(
    type: CountdownTimerEventType,
    handler: CountdownTimerEventHandler
  ) {
    switch (type) {
      case 'create': {
        this.onCreate = handler;
      }
      case 'start': {
        this.onStart = handler;
      }
      case 'pause': {
        this.onPause = handler;
      }
      case 'tick': {
        this.onTick = handler;
      }
      case 'finish': {
        this.onFinish = handler;
      }
      case 'reset': {
        this.onReset = handler;
      }
    }
  }

  startTimer() {
    // Just for safety - Clear internal timer if already active
    this.clearInternalTimer();

    this.updateState('running');
    this.fireEvent('start');
    this.setInternalTimer(() => {
      this.currentTime--;
      this.fireEvent('tick');
      if (this.currentTime === 0) {
        this.finishTimer();
      }
    });
    return this;
  }

  pauseTimer() {
    this.clearInternalTimer();
    this.updateState('paused');
    this.fireEvent('pause');
    return this;
  }

  finishTimer() {
    this.clearInternalTimer();
    this.currentTime = 0;
    this.updateState('finished');
    this.fireEvent('finish');
    return this;
  }

  resetTimer() {
    this.clearInternalTimer();
    this.currentTime = this.startTime;
    this.updateState('idle');
    this.fireEvent('reset');
    return this;
  }

  getInfo(): CountdownTimerInfo {
    return {
      id: this.id,
      state: this.state,
      currentTime: this.currentTime,
      startTime: this.startTime,
    };
  }
}
