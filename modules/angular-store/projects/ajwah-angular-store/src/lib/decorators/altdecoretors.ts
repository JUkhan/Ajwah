
import { EFFECT_METADATA_KEY, STATE_METADATA_KEY } from './metakeys';

let __actionKey = 'action';
let __effectKey = 'effect';

export function setKeys(actionKey, effectKey) {
    if (actionKey) {
        __actionKey = actionKey;
    }
    if (effectKey) {
        __effectKey = effectKey;
    }
}

export function setActionsAndEffects(target: any, includeStates = true) {
    target = target.prototype;
    if (includeStates) {
        if (!target.hasOwnProperty(STATE_METADATA_KEY)) {
            Object.defineProperty(target, STATE_METADATA_KEY, { value: { actions: {} } })
        }
    }

    if (!target.hasOwnProperty(EFFECT_METADATA_KEY)) {
        Object.defineProperty(target, EFFECT_METADATA_KEY, { value: { effects: [] } })
    }

    Object.getOwnPropertyNames(target).forEach(prop => {
        if (includeStates) {
            if (prop.startsWith(__actionKey)) {
                const actionType = prop.substr(__actionKey.length);
                target[STATE_METADATA_KEY].actions[actionType] = prop;
            }
        }

        if (prop.startsWith(__effectKey)) {
            const dispatch = !prop.endsWith('_ndispatch');
            target[EFFECT_METADATA_KEY].effects.push({ propertyName: prop, dispatch });
        }

    })

}

export function getEffectKey() {
    return __effectKey;
}