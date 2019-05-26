import { EFFECT_METADATA_KEY, STATE_METADATA_KEY } from '../tokens';

let __actionKey = 'on';
let __effectKey = 'effect';

export function setKeys(actionKey, effectKey) {
    if (actionKey) {
        __actionKey = actionKey;
    }
    if (effectKey) {
        __effectKey = effectKey;
    }
}

export function setActionsAndEffects(target, includeStates = true) {
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

        if (prop.startsWith(__effectKey) && target[EFFECT_METADATA_KEY].effects.findIndex(_ => _.propertyName === prop) === -1) {
            const dispatch = !prop.endsWith('_ndispatch');
            target[EFFECT_METADATA_KEY].effects.push({ propertyName: prop, dispatch });
        }

    })

}

export function getEffectKey() {
    return __effectKey;
}