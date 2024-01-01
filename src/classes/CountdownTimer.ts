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

  private onCreate: CountdownTimerEventHandler = () => {};
  private onStart: CountdownTimerEventHandler = () => {};
  private onPause: CountdownTimerEventHandler = () => {};
  private onTick: CountdownTimerEventHandler = () => {};
  private onFinish: CountdownTimerEventHandler = () => {};

  private clearAccurateInterval: Function = null;

  constructor(config: CountdownTimerConfig) {
    const errorMsg = getTimerCreationErrorMessage(config);

    if (errorMsg) {
      throw new CreateCountdownTimerError(errorMsg);
    }

    const { startTime, onCreate, onStart, onPause, onTick, onFinish } = config;
    const startTimeInNumber = convertToInteger(startTime);

    this.id = nanoid();
    this.currentTime = startTimeInNumber;
    this.startTime = startTime;

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
        throw new CountdownTimerInvalidStateTransitionError(
          this.state,
          newState
        );
      }
    }

    if (newState === 'idle') {
      throw new CountdownTimerInvalidStateTransitionError(this.state, newState);
    }

    if (newState === 'paused') {
      if (
        this.state === 'paused' ||
        this.state === 'idle' ||
        this.state === 'finished'
      ) {
        throw new CountdownTimerInvalidStateTransitionError(
          this.state,
          newState
        );
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
    }
  }

  startTimer() {
    this.updateState('running');
    this.fireEvent('start');
    this.setInternalTimer(() => {
      this.fireEvent('tick');
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
    this.updateState('finished');
    this.fireEvent('finish');
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
