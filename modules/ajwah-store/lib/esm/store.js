var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { BehaviorSubject, queueScheduler } from 'rxjs';
import { map, scan, distinctUntilChanged, pluck, observeOn } from 'rxjs/operators';
import { combineStates } from './combineStates';
import { STATE_METADATA_KEY } from './decorators/metakeys';

var Store = function (_BehaviorSubject) {
    _inherits(Store, _BehaviorSubject);

    function Store(initStates, dispatcher) {
        _classCallCheck(this, Store);

        var _this = _possibleConstructorReturn(this, (Store.__proto__ || Object.getPrototypeOf(Store)).call(this, {}));

        _this.states = {};

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = initStates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var state = _step.value;

                _this._mapState(state);
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

        _this.dispatcher = dispatcher;

        _this.subscription = _this.dispatcher.pipe(observeOn(queueScheduler), scan(function (state, action) {
            return action.type === '@@importState' ? action.payload : combineStates(state, action, _this.states);
        }, {})).subscribe(function (newState) {
            _get(Store.prototype.__proto__ || Object.getPrototypeOf(Store.prototype), 'next', _this).call(_this, newState);
        });

        return _this;
    }

    _createClass(Store, [{
        key: 'dispatch',
        value: function dispatch(action) {
            this.dispatcher.next(action);
        }
    }, {
        key: 'select',
        value: function select(pathOrMapFn) {

            var mapped$ = void 0;

            if (typeof pathOrMapFn === 'string') {
                mapped$ = this.pipe(pluck(pathOrMapFn));
            } else if (typeof pathOrMapFn === 'function') {
                mapped$ = this.pipe(map(function (source) {
                    return pathOrMapFn(source);
                }));
            } else {
                throw new TypeError('Unexpected type \'' + (typeof pathOrMapFn === 'undefined' ? 'undefined' : _typeof(pathOrMapFn)) + '\' in select operator,' + ' expected \'string\' or \'function\'');
            }

            return mapped$.pipe(distinctUntilChanged());
        }
    }, {
        key: 'next',
        value: function next(action) {
            this.dispatcher.next(action);
        }
    }, {
        key: 'error',
        value: function error(_error) {
            this.dispatcher.error(_error);
        }
    }, {
        key: 'complete',
        value: function complete() {
            this.dispatcher.complete();
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this.subscription.unsubscribe();
            this.complete();
        }
    }, {
        key: 'addState',
        value: function addState(stateClass) {
            var name = this._mapState(stateClass);
            this.next({ type: 'add_state(' + name + ')' });
        }
    }, {
        key: 'removeState',
        value: function removeState(stateName) {
            if (!this.states[stateName]) {
                console.error('Unknown state name \'' + stateName + '\'');
                return;
            }

            delete this.states[stateName];
            this.next({ type: 'remove_state(' + stateName + ')' });
        }
    }, {
        key: '_mapState',
        value: function _mapState(inst) {
            var meta = inst[STATE_METADATA_KEY];
            if (!meta.name) {
                meta.name = inst.name;
            }
            if (!meta.initialState) {
                meta.initialState = inst.initialState;
            }
            this.states[meta.name] = inst;
            return meta.name;
        }
    }, {
        key: 'importState',
        value: function importState(state) {
            var _this2 = this;

            //state = Object.assign({}, state);
            Object.keys(this.states).forEach(function (key) {
                if (!state[key]) {
                    var metaProp = _this2.states[key][STATE_METADATA_KEY];
                    var initData = Array.isArray(metaProp.initialState) ? [].concat(_toConsumableArray(metaProp.initialState)) : _extends({}, metaProp.initialState);
                    state[key] = initData;
                }
            });
            this.next({ type: '@@importState', payload: state });
        }
    }]);

    return Store;
}(BehaviorSubject);

export { Store };