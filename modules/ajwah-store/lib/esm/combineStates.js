var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { STATE_METADATA_KEY } from "./decorators/metakeys";

function updateState(state, action, instance) {
    var metaProp = instance[STATE_METADATA_KEY];
    if (!state) {
        state = Array.isArray(metaProp.initialState) ? [].concat(_toConsumableArray(metaProp.initialState)) : _extends({}, metaProp.initialState);
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