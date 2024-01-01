import { WORKER_COMMANDS, WORKER_RESPONSE } from '../constants/workerActions';

let timeoutId: number;

self.onmessage = (event) => {
  const { action, interval } = event.data;

  switch (action) {
    case WORKER_COMMANDS.START: {
      accurateSetInterval(function () {
        self.postMessage(WORKER_RESPONSE.TICK);
      }, interval);
      break;
    }
    case WORKER_COMMANDS.STOP: {
      self.clearTimeout(timeoutId);
      break;
    }
    default: {
      throw new Error('Unknown worker command');
    }
  }
};

const accurateSetInterval = (callback: () => void, interval: number) => {
  let counter = 1;
  const startTime = Date.now();

  function main() {
    const nowTime = Date.now();
    const nextTime = startTime + counter * interval;
    timeoutId = self.setTimeout(main, interval - (nowTime - nextTime));
    counter += 1;
    callback();
  }

  timeoutId = self.setTimeout(main, interval);
};
