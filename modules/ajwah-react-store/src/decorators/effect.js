
import { ignoreElements } from 'rxjs/operators';
import { merge } from 'rxjs';


export const EFFECT_METADATA_KEY = 'ajwah/effects';
export function EffectKey(key) {
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
    return instance[EFFECT_METADATA_KEY];
}

export function mergeEffects(instance, action$) {
    const observables = getEffectsMetadata(instance).map(
        ({ propertyName, dispatch }) => {
            const effect = typeof instance[propertyName] === 'function' ?
                instance[propertyName]() : instance[propertyName];

            if (dispatch === false) {
                return effect(action$).pipe(ignoreElements());
            }

            return effect(action$);
        }
    );

    return merge(...observables);
}