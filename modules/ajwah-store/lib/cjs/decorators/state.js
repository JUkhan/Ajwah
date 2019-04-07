'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.State = State;
exports.Action = Action;

var _metakeys = require('./metakeys');

function State(_ref) {
    var name = _ref.name,
        _ref$initialState = _ref.initialState,
        initialState = _ref$initialState === undefined ? {} : _ref$initialState;

    return function (target) {
        target = target.prototype;
        if (!target.hasOwnProperty(_metakeys.STATE_METADATA_KEY)) {
            Object.defineProperty(target, _metakeys.STATE_METADATA_KEY, { value: { name: name, initialState: initialState, actions: {} } });
        }
        target[_metakeys.STATE_METADATA_KEY].name = name;
        target[_metakeys.STATE_METADATA_KEY].initialState = initialState;
    };
}

function Action(actionType) {
    return function (target, propertyName) {
        if (!target.hasOwnProperty(_metakeys.STATE_METADATA_KEY)) {
            Object.defineProperty(target, _metakeys.STATE_METADATA_KEY, { value: { actions: {} } });
        }
        target[_metakeys.STATE_METADATA_KEY].actions[actionType] = propertyName;
    };
}