'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EffectKey = EffectKey;
exports.Effect = Effect;
exports.getEffectsMetadata = getEffectsMetadata;
exports.mergeEffects = mergeEffects;

var _operators = require('rxjs/operators');

var _rxjs = require('rxjs');

var _altdecoretors = require('./altdecoretors');

var _operators2 = require('../operators');

var _metakeys = require('./metakeys');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function EffectKey(key) {
    return function (target) {
        target = target.prototype;
        if (!target.hasOwnProperty(_metakeys.EFFECT_METADATA_KEY)) {
            Object.defineProperty(target, _metakeys.EFFECT_METADATA_KEY, { value: { effects: [] } });
        }
        target[_metakeys.EFFECT_METADATA_KEY].key = key;
    };
}

function Effect() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { dispatch: true },
        dispatch = _ref.dispatch;

    return function (target, propertyName) {
        if (!target.hasOwnProperty(_metakeys.EFFECT_METADATA_KEY)) {
            Object.defineProperty(target, _metakeys.EFFECT_METADATA_KEY, { value: { effects: [] } });
        }
        target[_metakeys.EFFECT_METADATA_KEY].effects.push({ propertyName: propertyName, dispatch: dispatch });
    };
}
function getEffectsMetadata(instance) {
    return instance[_metakeys.EFFECT_METADATA_KEY] && instance[_metakeys.EFFECT_METADATA_KEY].effects || [];
}

function mergeEffects(instance, action$, store$) {
    var observables = getEffectsMetadata(instance).filter(function (_ref2) {
        var propertyName = _ref2.propertyName;
        return typeof instance[propertyName] === 'function';
    }).map(function (_ref3) {
        var propertyName = _ref3.propertyName,
            dispatch = _ref3.dispatch;

        if (propertyName.startsWith((0, _altdecoretors.getEffectKey)() + 'For')) {
            return callEffectFunction(instance, propertyName, dispatch, action$.pipe(_operators2.ofType.apply(undefined, _toConsumableArray(propertyName.replace((0, _altdecoretors.getEffectKey)() + 'For', '').replace('_ndispatch', '').split('Or')))), store$);
        }
        return callEffectFunction(instance, propertyName, dispatch, action$, store$);
    });

    return _rxjs.merge.apply(undefined, _toConsumableArray(observables));
}
function callEffectFunction(instance, propertyName, dispatch, action$, store$) {
    if (dispatch === false) {
        return instance[propertyName](action$, store$).pipe((0, _operators.ignoreElements)());
    }
    return instance[propertyName](action$, store$);
}