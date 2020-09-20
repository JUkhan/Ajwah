import store from "./store";

store.registerState({
  stateName: "counter",
  initialState: { count: 0, msg: "" },
  mapActionToState: async (state, action, emit) => {
    if (action.type == "inc") emit({ count: state.count + 1, msg: "" });
    else if (action.type == "dec") emit({ count: state.count + 1, msg: "" });
    if (action.type == "asyncInc") {
      emit({ count: state.count, msg: "loading..." });
      const count = await getData(state.count);
      emit({ msg: "", count });
    }
  },
});

function getData(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num + Math.floor(Math.random() * 15));
    }, 1000);
  });
}
