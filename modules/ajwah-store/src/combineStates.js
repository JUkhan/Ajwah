import { STATE_METADATA_KEY } from "./tokens";
import { copyObj } from "./utils";

/*function updateState(state, action, instance) {
    const metaProp = instance[STATE_METADATA_KEY];
    if (!state) {
        state = copyObj(metaProp.initialState);
    }
    const actionProp = metaProp.actions[action.type];
    return actionProp ? instance[actionProp](state, action) : state;
}

export function combineStates(state, action, states) {
    return Object.keys(states).reduce((nextState, key) => {
        nextState[key] = updateState(state[key], action, states[key]);
        return nextState;
    }, {});
}*/

export function combineStates(state, action, store) {
    const states = store.states;
    Object.keys(states).forEach(async (key) => {
        var currentSubState = state[key];
        const metaProp = states[key][STATE_METADATA_KEY];
        if (!currentSubState) {
            currentSubState = copyObj(metaProp.initialState);
        }
        const actionProp = metaProp.actions[action.type];
        if (actionProp) {
            const gen = states[key][actionProp](currentSubState, action);
            if (gen.next && gen.throw && gen.return) {
                for (var nextVal of gen) {
                    const newSubState = await Promise.resolve(nextVal);
                    if (newSubState !== state[key]) {
                        state[key] = newSubState;
                        store.stateChange(state);
                    }
                }
            } else {
                Promise.resolve(gen).then(function (newSubState) {
                    if (newSubState !== currentSubState) {
                        state[key] = newSubState;
                        store.stateChange(state);
                    }
                })
            }

        } else {
            state[key] = currentSubState;
        }

    });
    return state;
}