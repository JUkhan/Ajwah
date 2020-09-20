import { filter, withLatestFrom } from "rxjs/operators";
import { parse } from "jsan";

export function devTools(
  { store, maxAge, name } = { maxAge: 8, name: "Ajwah DevTools" }
) {
  if (!store) return;
  const withDevtools =
    typeof window === "object" &&
    typeof window["__REDUX_DEVTOOLS_EXTENSION__"] !== "undefined";
  return withDevtools ? new _DevTools({ name, maxAge }, store) : runLog(store);
}

function runLog(store) {
  store.exportState().subscribe(([action, state]) => {
    console.group(action.type);
    console.info("payload: ", action.payload);
    console.info(state);
    console.groupEnd();
  });
}

class _DevTools {
  constructor(config, store) {
    this.config = config;
    this.ctx = { store: store };
    this.run();
  }
  run() {
    this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(this.config);
    this.unsubscribe = this.devTools.subscribe((message) =>
      this.dispatchMonitorAction(message)
    );

    this.ctx.store
      .exportState()
      .pipe(filter((arr) => arr[0].type && arr[0].type !== "@importState"))
      .subscribe(([action, state]) => {
        this.devTools.send(action, state);
      });
  }
  dispose() {
    this.unsubscribe();
    window.devToolsExtension.disconnect();
  }

  setAppState(state) {
    this.ctx.store.importState(state);
  }
  getAppState() {
    return this.copyObj(this.ctx.store.getValue());
  }
  copyObj(obj) {
    return { ...obj };
  }

  dispatchMonitorAction(message) {
    if (message.type === "DISPATCH") {
      let state;
      switch (message.payload.type) {
        case "RESET":
          this.setAppState({});
          this.devTools.init(this.getAppState());
          break;
        case "COMMIT":
          this.devTools.init(this.getAppState());
          break;
        case "ROLLBACK":
          state = parse(message.state);
          this.setAppState(state);
          this.devTools.init(state);
          break;
        case "SWEEP":
          state = this.liftedState;
          state.skippedActionIds.forEach((id) => {
            delete state.actionsById[id];
            state.computedStates.splice(id, 1);
          });
          state.currentStateIndex -= state.skippedActionIds.length;
          state.nextActionId -= state.skippedActionIds.length;
          state.skippedActionIds = [];
          var actionsById = {};
          state.stagedActionIds = [];
          Object.keys(state.actionsById).forEach((id, index) => {
            actionsById[index] = state.actionsById[id];
            state.stagedActionIds.push(index);
          });
          state.actionsById = actionsById;
          this.devTools.send(null, state);
          break;
        case "JUMP_TO_STATE":
        case "JUMP_TO_ACTION":
          this.setAppState(parse(message.state));
          break;
        case "TOGGLE_ACTION":
          this.toggleAction(message.payload.id, message.state);
          break;
        case "IMPORT_STATE": {
          const { nextLiftedState } = message.payload;
          const { computedStates } = nextLiftedState;
          this.setAppState(
            this.copyObj(computedStates[computedStates.length - 1].state)
          );
          this.devTools.send(null, nextLiftedState);
          break;
        }
        default:
          break;
      }
    } else if (message.type === "ACTION") {
      try {
        const action = parse(message.payload);
        this.ctx.store.next(action);
      } catch (err) {
        console.error(
          `Incorrect json format: ${message.payload} ex: {"type":"Inc"}`
        );
      }
    }
  }
  findStartIndex(liftedState, index) {
    index--;
    while (index > 0) {
      if (liftedState.skippedActionIds.indexOf(index) !== -1) {
        index--;
      } else {
        return index;
      }
    }
    return index;
  }
  toggleAction(id, strState) {
    const liftedState = parse(strState);
    const skippedIndex = liftedState.skippedActionIds.indexOf(id);
    const skipped = skippedIndex !== -1;
    const start = liftedState.stagedActionIds.indexOf(id);
    if (start === -1) {
      this.devTools.send(null, liftedState);
      return;
    }

    this.setAppState(
      this.copyObj(
        liftedState.computedStates[this.findStartIndex(liftedState, start)]
          .state
      )
    );
    for (
      let i = skipped ? start : start + 1;
      i < liftedState.stagedActionIds.length;
      i++
    ) {
      if (
        i !== start &&
        liftedState.skippedActionIds.indexOf(liftedState.stagedActionIds[i]) !==
          -1
      )
        continue; // it's already skipped

      const action =
        liftedState.actionsById[liftedState.stagedActionIds[i]].action;

      this.ctx.store.dispatch(action);
      liftedState.computedStates[i].state = this.getAppState();
    }

    if (skipped) {
      liftedState.skippedActionIds.splice(skippedIndex, 1);
    } else {
      liftedState.skippedActionIds.push(id);
    }
    this.liftedState = liftedState;
    this.devTools.send(null, liftedState);
  }
}
