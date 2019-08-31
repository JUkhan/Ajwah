import { STATE_METADATA_KEY } from "./tokens";
import { copyObj } from './utils';

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
                let newSubState: { hasState?: boolean, state?: any } = {};
                let obj: { done: boolean, value: any };
                do {
                    obj = gen.next(newSubState);
                    newSubState = await Promise.resolve(obj.value);
                    if (newSubState && newSubState.hasState && newSubState.state !== state[key]) {
                        state[key] = newSubState.state;
                        store.stateChange(state);
                    }
                } while (!obj.done);
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

