"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.combineStates = combineStates;

var _tokens = require("./tokens");

var _utils = require("./utils");

function updateState(state, action, instance) {
    var metaProp = instance[_tokens.STATE_METADATA_KEY];
    if (!state) {
        state = (0, _utils.copyObj)(metaProp.initialState);
    }
    var actionProp = metaProp.actions[action.type];
    return actionProp ? instance[actionProp](state, action) : state;
}

function combineStates(state, action, states) {
    return Object.keys(states).reduce(function (nextState, key) {
        nextState[key] = updateState(state[key], action, states[key]);
        return nextState;
    }, {});
}