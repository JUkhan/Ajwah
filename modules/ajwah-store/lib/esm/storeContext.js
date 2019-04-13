var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { Store } from './store';
import { Dispatcher } from './dispatcher';
import { EffectSubscription } from './effectSubscription';
import { Actions } from './actions';
import { Subscription } from 'rxjs';
import { STATE_METADATA_KEY, EFFECT_METADATA_KEY } from './tokens';
import { setKeys, setActionsAndEffects } from './decorators/altdecoretors';
import { withLatestFrom, map } from 'rxjs/operators';
import { copyObj } from './utils';

var StoreContext = function () {
    function StoreContext(states) {
        _classCallCheck(this, StoreContext);

        this.subs = {};
        this.dispatcher = new Dispatcher();
        this.actions = new Actions(this.dispatcher);
        this.store = new Store(states, this.dispatcher);
        this.effSubs = new EffectSubscription(this.store);
        this.effSubs.addEffects(states, this.actions);
    }

    _createClass(StoreContext, [{
        key: 'dispatch',
        value: function dispatch(actionName, payload) {
            if ((typeof actionName === 'undefined' ? 'undefined' : _typeof(actionName)) === 'object') {
                this.dispatcher.dispatch(actionName);
                return this;
            }
            this.dispatcher.dispatch({ type: actionName, payload: payload });
            return this;
        }
    }, {
        key: 'addStates',
        value: function addStates() {
            for (var _len = arguments.length, stateClassTypes = Array(_len), _key = 0; _key < _len; _key++) {
                stateClassTypes[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = stateClassTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stateClass = _step.value;

                    setActionsAndEffects(stateClass);
                    var instance = new stateClass();
                    this.store.addState(instance);
                    var key = instance[STATE_METADATA_KEY].name;
                    this._addEffectsByKey(instance, key, this.actions);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return this;
        }
    }, {
        key: 'removeStates',
        value: function removeStates() {
            for (var _len2 = arguments.length, stateNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                stateNames[_key2] = arguments[_key2];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = stateNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var stateName = _step2.value;

                    this.store.removeState(stateName);
                    this.removeEffectsByKey(stateName);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return this;
        }
    }, {
        key: 'importState',
        value: function importState(state) {
            this.store.importState(state);
            return this;
        }
    }, {
        key: 'select',
        value: function select(pathOrMapFn) {
            return this.store.select(pathOrMapFn);
        }
    }, {
        key: 'addEffect',
        value: function addEffect(callback, key) {
            if (key && typeof key === 'string') {
                this._addEffectsByKey(callback(this.actions, this.store), key);
            } else {
                this.effSubs.addEffect(callback(this.actions, this.store));
            }
            return this;
        }
    }, {
        key: 'removeEffectsByKey',
        value: function removeEffectsByKey(key) {
            if (this.subs[key]) {
                this.subs[key].unsubscribe && this.subs[key].unsubscribe();
                this.subs[key] = undefined;
            } else {
                throw 'Unknown effect key \'' + key + '\'';
            }
            return this;
        }
    }, {
        key: 'addEffects',
        value: function addEffects() {
            var _this = this;

            for (var _len3 = arguments.length, effectClassTypes = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                effectClassTypes[_key3] = arguments[_key3];
            }

            var instances = effectClassTypes.map(function (_) {
                setActionsAndEffects(_, false);
                var inst = new _();
                if (inst.effectKey) {
                    inst[EFFECT_METADATA_KEY].key = inst.effectKey;
                }
                return inst;
            });

            var globalEffects = instances.filter(function (ef) {
                return !ef[EFFECT_METADATA_KEY].key;
            });
            var keysEffects = instances.filter(function (ef) {
                return !!ef[EFFECT_METADATA_KEY].key;
            });
            globalEffects.length && this.effSubs.addEffects(globalEffects, this.actions);
            if (keysEffects.length) {
                keysEffects.forEach(function (instance) {
                    var key = instance[EFFECT_METADATA_KEY].key;
                    _this._addEffectsByKey(instance, key, _this.actions);
                });
            }
            return this;
        }
    }, {
        key: '_addEffectsByKey',
        value: function _addEffectsByKey(instance, key, actions) {
            var subscription = this.subs[key] || (this.subs[key] = new Subscription());
            if (actions) this.effSubs.addEffectsByKey(instance, actions, subscription);else this.effSubs.addEffectByKey(instance, subscription);
        }
    }, {
        key: 'exportState',
        value: function exportState() {
            return this.dispatcher.pipe(withLatestFrom(this.store), map(function (arr) {
                arr[1] = copyObj(arr[1]);
                return arr;
            }));
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this.dispatcher.dispose();
            this.store.dispose();
            this.effSubs.dispose();
            this.devTools.dispose();
        }
    }]);

    return StoreContext;
}();

var __store = undefined;

function storeContextFactory(_ref) {
    var _ref$states = _ref.states,
        states = _ref$states === undefined ? [] : _ref$states,
        _ref$effects = _ref.effects,
        effects = _ref$effects === undefined ? [] : _ref$effects,
        actionsMethodStartsWith = _ref.actionsMethodStartsWith,
        effectsMethodStartsWith = _ref.effectsMethodStartsWith,
        _ref$devTools = _ref.devTools,
        devTools = _ref$devTools === undefined ? undefined : _ref$devTools;

    setKeys(actionsMethodStartsWith, effectsMethodStartsWith);
    var ctx = new StoreContext(states.map(function (_) {
        setActionsAndEffects(_);
        return new _();
    }));
    ctx.addEffects.apply(ctx, _toConsumableArray(effects));

    if (devTools && devTools.run) {
        ctx.devTools = devTools;
        devTools.run(ctx);
    }
    return ctx;
}
export function setStoreContext(options) {
    __store = storeContextFactory(options);
}
export function getStoreContext(options) {
    return storeContextFactory(options);
}

export function getStore() {
    return __store;;
}