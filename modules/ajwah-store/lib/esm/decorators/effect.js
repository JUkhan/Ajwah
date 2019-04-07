function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { ignoreElements } from 'rxjs/operators';
import { merge } from 'rxjs';
import { getEffectKey } from './altdecoretors';
import { ofType } from '../operators';
import { EFFECT_METADATA_KEY } from './metakeys';

export function EffectKey(key) {
    return function (target) {
        target = target.prototype;
        if (!target.hasOwnProperty(EFFECT_METADATA_KEY)) {
            Object.defineProperty(target, EFFECT_METADATA_KEY, { value: { effects: [] } });
        }
        target[EFFECT_METADATA_KEY].key = key;
    };
}

export function Effect() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { dispatch: true },
        dispatch = _ref.dispatch;

    return function (target, propertyName) {
        if (!target.hasOwnProperty(EFFECT_METADATA_KEY)) {
            Object.defineProperty(target, EFFECT_METADATA_KEY, { value: { effects: [] } });
        }
        target[EFFECT_METADATA_KEY].effects.push({ propertyName: propertyName, dispatch: dispatch });
    };
}
export function getEffectsMetadata(instance) {
    return instance[EFFECT_METADATA_KEY] && instance[EFFECT_METADATA_KEY].effects || [];
}

export function mergeEffects(instance, action$, store$) {
    var observables = getEffectsMetadata(instance).filter(function (_ref2) {
        var propertyName = _ref2.propertyName;
        return typeof instance[propertyName] === 'function';
    }).map(function (_ref3) {
        var propertyName = _ref3.propertyName,
            dispatch = _ref3.dispatch;

        if (propertyName.startsWith(getEffectKey() + 'For')) {
            return callEffectFunction(instance, propertyName, dispatch, action$.pipe(ofType.apply(undefined, _toConsumableArray(propertyName.replace(getEffectKey() + 'For', '').replace('_ndispatch', '').split('Or')))), store$);
        }
        return callEffectFunction(instance, propertyName, dispatch, action$, store$);
    });

    return merge.apply(undefined, _toConsumableArray(observables));
}
function callEffectFunction(instance, propertyName, dispatch, action$, store$) {
    if (dispatch === false) {
        return instance[propertyName](action$, store$).pipe(ignoreElements());
    }
    return instance[propertyName](action$, store$);
}