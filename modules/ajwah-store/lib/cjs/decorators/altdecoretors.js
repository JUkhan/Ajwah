'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setKeys = setKeys;
exports.setActionsAndEffects = setActionsAndEffects;
exports.getEffectKey = getEffectKey;

var _metakeys = require('./metakeys');

var __actionKey = 'action';
var __effectKey = 'effect';

function setKeys(actionKey, effectKey) {
    if (actionKey) {
        __actionKey = actionKey;
    }
    if (effectKey) {
        __effectKey = effectKey;
    }
}

function setActionsAndEffects(target) {
    var includeStates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    target = target.prototype;
    if (includeStates) {
        if (!target.hasOwnProperty(_metakeys.STATE_METADATA_KEY)) {
            Object.defineProperty(target, _metakeys.STATE_METADATA_KEY, { value: { actions: {} } });
        }
    }

    if (!target.hasOwnProperty(_metakeys.EFFECT_METADATA_KEY)) {
        Object.defineProperty(target, _metakeys.EFFECT_METADATA_KEY, { value: { effects: [] } });
    }

    Object.getOwnPropertyNames(target).forEach(function (prop) {
        if (includeStates) {
            if (prop.startsWith(__actionKey)) {
                var actionType = prop.substr(__actionKey.length);
                target[_metakeys.STATE_METADATA_KEY].actions[actionType] = prop;
            }
        }

        if (prop.startsWith(__effectKey)) {
            var dispatch = !prop.endsWith('_ndispatch');
            target[_metakeys.EFFECT_METADATA_KEY].effects.push({ propertyName: prop, dispatch: dispatch });
        }
    });
}

function getEffectKey() {
    return __effectKey;
}