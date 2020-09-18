import { Store } from '../services/store';
interface Counter {
  msg: string;
  count: number;
}
export function registerCounterState(store: Store) {
  store.registerState<Counter>(
    'counter',
    { count: 0, msg: '' },
    async (state, action, emit) => {
      switch (action.type) {
        case 'Inc':
          emit({ count: state.count + 1, msg: '' });
          break;
        case 'Dec':
          emit({ count: state.count - 1, msg: '' });
          break;
        case 'AsyncInc':
          emit({ count: state.count, msg: ' loading...' });
          //emit({ msg: '', count: await getData(state.count) });
          break;
      }
    }
  );
}

function getData(num: number): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num + 1);
    }, 1000);
  });
}
