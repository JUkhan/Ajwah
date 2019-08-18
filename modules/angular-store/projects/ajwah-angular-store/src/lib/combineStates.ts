import { STATE_METADATA_KEY } from "./tokens";
import { copyObj } from './utils';

export function combineStates(state, action, store) {
    const states = store.states;
    Object.keys(states).forEach((key) => {
        var currentSubState = state[key];
        const metaProp = states[key][STATE_METADATA_KEY];
        if (!currentSubState) {
            currentSubState = copyObj(metaProp.initialState);
        }
        const actionProp = metaProp.actions[action.type];
        if (actionProp) {
            Promise.resolve(states[key][actionProp](currentSubState, action)).then(function (newSubState) {
                if (newSubState !== currentSubState) {
                    state[key] = newSubState;
                    store.stateChange(state);
                }
            });
        } else {
            state[key] = currentSubState;
        }

    });
    return state;
}

