
import { ignoreElements } from 'rxjs/operators';
import { merge } from 'rxjs';


export const EFFECT_METADATA_KEY = 'ajwah/effects';
export function EffectKey(key: string) {
    return function (target) {
        target = target.prototype;
        if (!target.hasOwnProperty(EFFECT_METADATA_KEY)) {
            Object.defineProperty(target, EFFECT_METADATA_KEY, {})
        }
        target[EFFECT_METADATA_KEY].key = key;

    }
}

export function Effect({ dispatch } = { dispatch: true }) {
    return function (target, propertyName) {
        if (!target.hasOwnProperty(EFFECT_METADATA_KEY)) {
            Object.defineProperty(target, EFFECT_METADATA_KEY, { value: [] })
        }
        target[EFFECT_METADATA_KEY].push({ propertyName, dispatch });
    };
}
export function getEffectsMetadata(instance) {
    return instance[EFFECT_METADATA_KEY] || [];
}

export function mergeEffects(instance) {
    const observables = getEffectsMetadata(instance).map((({ propertyName, dispatch }) => {
        const observable = typeof instance[propertyName] === 'function' ?
            instance[propertyName]() : instance[propertyName];
        if (dispatch === false) {
            return ignoreElements.call(observable);
        }
        return observable;
    }));
    return merge(...observables);
}