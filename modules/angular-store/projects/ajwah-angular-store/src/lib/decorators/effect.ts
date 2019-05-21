
import { ignoreElements } from 'rxjs/operators';
import { merge } from 'rxjs';
import { EFFECT_METADATA_KEY } from '../tokens';

export function EffectKey(key: string) {
    return function (target) {
        target = target.prototype;
        if (!target.hasOwnProperty(EFFECT_METADATA_KEY)) {
            Object.defineProperty(target, EFFECT_METADATA_KEY, { value: { effects: [] } })
        }
        target[EFFECT_METADATA_KEY].key = key;

    }
}

export function Effect({ dispatch } = { dispatch: true }) {
    return function (target, propertyName) {
        if (!target.hasOwnProperty(EFFECT_METADATA_KEY)) {
            Object.defineProperty(target, EFFECT_METADATA_KEY, { value: { effects: [] } })
        }
        target[EFFECT_METADATA_KEY].effects.push({ propertyName, dispatch });

    };
}
export function getEffectsMetadata(instance) {
    return instance[EFFECT_METADATA_KEY] && instance[EFFECT_METADATA_KEY].effects || [];
}

export function mergeEffects(instance) {
    const observables = getEffectsMetadata(instance)
        .map(({ propertyName, dispatch }) => {

            const observable = typeof instance[propertyName] === 'function' ?
                instance[propertyName]() : instance[propertyName];
            return dispatch === false ? observable.pipe(ignoreElements()) : observable;
        });

    return merge(...observables);
}
