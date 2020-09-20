import store from "./storeService";

export default function registerCounterState() {
  store.registerState({
    stateName: "counter",
    initialState: { count: 0, msg: "" },
    mapActionToState: async (state, action, emit) => {
      switch (action.type) {
        case "Inc":
          emit({ count: state.count + 1, msg: "" });
          break;
        case "Dec":
          emit({ count: state.count - 1, msg: "" });
          break;
        case "AsyncInc":
          emit({ count: state.count, msg: " loading..." });
          //emit({ msg: '', count: await getData(state.count) });
          break;
      }
    },
  });
}

function getData(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num + 1);
    }, 1000);
  });
}
