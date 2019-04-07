import { STATE_METADATA_KEY } from './metakeys';

export function State(_ref) {
    var name = _ref.name,
        _ref$initialState = _ref.initialState,
        initialState = _ref$initialState === undefined ? {} : _ref$initialState;

    return function (target) {
        target = target.prototype;
        if (!target.hasOwnProperty(STATE_METADATA_KEY)) {
            Object.defineProperty(target, STATE_METADATA_KEY, { value: { name: name, initialState: initialState, actions: {} } });
        }
        target[STATE_METADATA_KEY].name = name;
        target[STATE_METADATA_KEY].initialState = initialState;
    };
}

export function Action(actionType) {
    return function (target, propertyName) {
        if (!target.hasOwnProperty(STATE_METADATA_KEY)) {
            Object.defineProperty(target, STATE_METADATA_KEY, { value: { actions: {} } });
        }
        target[STATE_METADATA_KEY].actions[actionType] = propertyName;
    };
}