import { STATE_METADATA_KEY } from './metakeys';

export function State({ name, initialState = {} }) {
    return function (target) {
        target = target.prototype;
        if (!target.hasOwnProperty(STATE_METADATA_KEY)) {
            Object.defineProperty(target, STATE_METADATA_KEY, { value: { name, initialState, actions: {} } })
        }
        target[STATE_METADATA_KEY].name = name;
        target[STATE_METADATA_KEY].initialState = initialState;
    }
}

export function Action(actionType) {
    return function (target, propertyName) {
        if (!target.hasOwnProperty(STATE_METADATA_KEY)) {
            Object.defineProperty(target, STATE_METADATA_KEY, { value: { actions: {} } })
        }
        target[STATE_METADATA_KEY].actions[actionType] = propertyName;
    }
}

