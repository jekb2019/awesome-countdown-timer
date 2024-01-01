// @ts-ignore
import Worker from 'worker-loader?inline=no-fallback!../workers/intervalScript.ts';
import { WORKER_COMMANDS } from '../constants/workerActions';

export function setAccurateInterval(
  callback: Function,
  interval: number
): Function {
  const worker = new Worker();

  worker.postMessage({
    action: WORKER_COMMANDS.START,
    interval,
  });
  worker.onmessage = () => {
    callback();
  };

  function clearAccurateInterval() {
    worker.postMessage({
      action: WORKER_COMMANDS.STOP,
    });
    worker.terminate();
  }

  return clearAccurateInterval;
}
