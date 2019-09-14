import { STATE_METADATA_KEY } from "./tokens";
import { copyObj } from './utils';

export function combineStates(state, action, store) {
    const states = store.states;
    for (let key in states) {
        var currentSubState = state[key];
        const metaProp = states[key][STATE_METADATA_KEY];
        if (!currentSubState) {
            currentSubState = copyObj(metaProp.initialState);
        }
        const actionProp = metaProp.actions[action.type];
        if (actionProp) {
            state[key] = states[key][actionProp](currentSubState, action);
        } else {
            state[key] = currentSubState;
        }
    }
    return { ...state };
}

