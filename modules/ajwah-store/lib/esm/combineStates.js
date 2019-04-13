import { STATE_METADATA_KEY } from "./tokens";
import { copyObj } from "./utils";

function updateState(state, action, instance) {
    var metaProp = instance[STATE_METADATA_KEY];
    if (!state) {
        state = copyObj(metaProp.initialState);
    }
    var actionProp = metaProp.actions[action.type];
    return actionProp ? instance[actionProp](state, action) : state;
}

export function combineStates(state, action, states) {
    return Object.keys(states).reduce(function (nextState, key) {
        nextState[key] = updateState(state[key], action, states[key]);
        return nextState;
    }, {});
}