import { CountdownTimerState } from '../types/states';

class CountdownTimerError extends Error {
  constructor(errorName: string, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = errorName;
  }
}

export class CreateCountdownTimerError extends CountdownTimerError {
  constructor(message: string) {
    super('CreateCountdownTimerError', message);
  }
}

export class CountdownTimerEventHandlerError extends CountdownTimerError {
  constructor(message: string) {
    super('CreateCountdownTimerError', message);
  }
}

export class CountdownTimerInvalidStateTransitionError extends CountdownTimerError {
  constructor(prevState: CountdownTimerState, nextState: CountdownTimerState) {
    super(
      'InvalidStateTransitionError',
      `Cannot transition from ${prevState} timer to ${nextState}`
    );
  }
}
