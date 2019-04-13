import { ignoreElements } from 'rxjs/operators';
import { merge } from 'rxjs';
import { getEffectKey } from './altdecoretors';
import { ofType } from '../operators';
import { EFFECT_METADATA_KEY } from '../tokens';


export function EffectKey(key) {
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

export function mergeEffects(instance, action$, store$) {
    const observables = getEffectsMetadata(instance)
        .filter(({ propertyName }) => typeof instance[propertyName] === 'function')
        .map(({ propertyName, dispatch }) => {
            if (propertyName.startsWith(getEffectKey() + 'For')) {
                return callEffectFunction(instance, propertyName, dispatch, action$.pipe(ofType(...splitByActionNames(propertyName))), store$);
            }
            return callEffectFunction(instance, propertyName, dispatch, action$, store$);

        });

    return merge(...observables);
}
function callEffectFunction(instance, propertyName, dispatch, action$, store$) {
    if (dispatch === false) {
        return instance[propertyName](action$, store$).pipe(ignoreElements());
    }
    return instance[propertyName](action$, store$);
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