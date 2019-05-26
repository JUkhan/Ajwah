
import { ignoreElements } from 'rxjs/operators';
import { merge } from 'rxjs';
import { EFFECT_METADATA_KEY } from '../tokens';
import { getEffectKey } from './altdecoretors';
import { ofType } from '../operators';

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

export function mergeEffects(instance, action$) {
    const observables = getEffectsMetadata(instance)
        .map(({ propertyName, dispatch }) => {
            const observable = typeof instance[propertyName] === 'function' ?
                instance[propertyName](propertyName.startsWith(getEffectKey() + 'For') ? action$.pipe(ofType(...splitByActionNames(propertyName))) : action$) : instance[propertyName];
            return dispatch === false ? observable.pipe(ignoreElements()) : observable;
        });

    return merge(...observables);
}
function splitByActionNames(str) {
    str = str.replace(getEffectKey() + 'For', '').replace('_ndispatch', '').split(/Or([A-Z])/);

    const arr = str.reduce((res, item, index, list) => {
        if (index % 2)
            res.push(list.slice(index, index + 2).join(''))
        return res
    }, []);
    arr.push(str[0]);
    return arr;
}