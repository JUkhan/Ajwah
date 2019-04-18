var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { withLatestFrom } from 'rxjs/operators';
import { parse } from 'jsan';

export function devTools() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { maxAge: 8, name: 'Ajwah DevTools' },
        maxAge = _ref.maxAge,
        name = _ref.name;

    var withDevtools = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && typeof window['__REDUX_DEVTOOLS_EXTENSION__'] !== 'undefined';
    return withDevtools ? new _DevTools({ name: name, maxAge: maxAge }) : null;
}

var _DevTools = function () {
    function _DevTools(config) {
        _classCallCheck(this, _DevTools);

        this.config = config;
    }

    _createClass(_DevTools, [{
        key: 'run',
        value: function run(ctx) {
            var _this = this;

            this.ctx = ctx;

            this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(this.config);
            this.unsubscribe = this.devTools.subscribe(function (message) {
                return _this.dispatchMonitorAction(message);
            });
            ctx.dispatcher.pipe(withLatestFrom(ctx.store)).subscribe(function (_ref2) {
                var _ref3 = _slicedToArray(_ref2, 2),
                    action = _ref3[0],
                    state = _ref3[1];

                if (action.type === '@@importState' || action.___isCalLiftedState) {
                    return;
                }
                if (action.type === 'INIT') {
                    _this.initValue = state;
                }
                //console.log(action, state);
                _this.sendStatusToDevTools(action, state);
            });
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this.unsubscribe();
            window.devToolsExtension.disconnect();
        }
    }, {
        key: 'sendStatusToDevTools',
        value: function sendStatusToDevTools(action, state) {
            this.devTools.send(action, state);
        }
    }, {
        key: 'setAppState',
        value: function setAppState(state) {
            this.ctx.store.importState(state);
        }
    }, {
        key: 'getAppState',
        value: function getAppState() {
            return this.copyObj(this.ctx.store.getValue());
        }
    }, {
        key: 'copyObj',
        value: function copyObj(obj) {
            return _extends({}, obj);
        }
    }, {
        key: 'getInitState',
        value: function getInitState() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


            return {
                actionsById: {
                    0: {
                        action: { type: "@@INIT" },
                        stack: undefined,
                        timestamp: +Date.now(),
                        type: "PERFORM_ACTION"
                    }
                },
                computedStates: [{ state: state }],
                currentStateIndex: 0,
                nextActionId: 1,
                skippedActionIds: [],
                stagedActionIds: [0]
            };
        }
    }, {
        key: 'dispatchMonitorAction',
        value: function dispatchMonitorAction(message) {

            if (message.type === 'DISPATCH') {
                var state = void 0;
                switch (message.payload.type) {
                    case 'RESET':
                        this.setAppState({});
                        this.devTools.init(this.getAppState());
                        break;;
                    case 'COMMIT':
                        this.devTools.init(this.getAppState());
                        break;
                    case 'ROLLBACK':
                        state = parse(message.state);
                        this.setAppState(state);
                        this.devTools.init(state);
                        break;
                    case 'SWEEP':
                        state = this.liftedState;
                        state.skippedActionIds.forEach(function (id) {
                            delete state.actionsById[id];
                            state.computedStates.splice(id, 1);
                            state.stagedActionIds.splice(id, 1);
                        });
                        state.currentStateIndex -= state.skippedActionIds.length;
                        state.nextActionId -= state.skippedActionIds.length;
                        state.skippedActionIds = [];
                        var actionsById = {};
                        Object.keys(state.actionsById).forEach(function (id, index) {
                            actionsById[index] = state.actionsById[id];
                        });
                        state.actionsById = actionsById;
                        for (var i = 0; i < state.stagedActionIds.length; i++) {
                            state.stagedActionIds[i] = i;
                        }
                        this.devTools.send(null, state);
                        break;
                    case 'JUMP_TO_STATE':
                    case 'JUMP_TO_ACTION':
                        this.setAppState(parse(message.state));
                        break;
                    case 'TOGGLE_ACTION':
                        this.toggleAction(message.payload.id, message.state);
                        break;
                    case 'IMPORT_STATE':
                        {
                            var nextLiftedState = message.payload.nextLiftedState;
                            var computedStates = nextLiftedState.computedStates;

                            this.setAppState(this.copyObj(computedStates[computedStates.length - 1].state));
                            this.devTools.send(null, nextLiftedState);
                            break;
                        }
                    default:
                        break;
                }
            } else if (message.type === 'ACTION') {
                try {
                    var action = parse(message.payload);
                    this.ctx.store.next(action);
                } catch (err) {
                    console.error('Incorrect json format: ' + message.payload + ' ex: {"type":"Inc"}');
                }
            }
        }
    }, {
        key: 'findStartIndex',
        value: function findStartIndex(liftedState, index) {
            index--;
            while (index > 0) {
                if (liftedState.skippedActionIds.indexOf(index) !== -1) {
                    index--;
                } else {
                    return index;
                }
            }
            return index;
        }
    }, {
        key: 'toggleAction',
        value: function toggleAction(id, strState) {
            var liftedState = parse(strState);
            var skippedIndex = liftedState.skippedActionIds.indexOf(id);
            var skipped = skippedIndex !== -1;
            var start = liftedState.stagedActionIds.indexOf(id);
            if (start === -1) {
                this.devTools.send(null, liftedState);
                return;
            }
            this.setAppState(this.copyObj(liftedState.computedStates[this.findStartIndex(liftedState, start)].state));
            for (var i = skipped ? start : start + 1; i < liftedState.stagedActionIds.length; i++) {
                if (i !== start && liftedState.skippedActionIds.indexOf(liftedState.stagedActionIds[i]) !== -1) continue; // it's already skipped

                var action = liftedState.actionsById[liftedState.stagedActionIds[i]].action;
                this.ctx.store.dispatch(action);
                liftedState.computedStates[i].state = this.getAppState();
            }

            if (skipped) {
                liftedState.skippedActionIds.splice(skippedIndex, 1);
            } else {
                liftedState.skippedActionIds.push(id);
            }
            this.liftedState = liftedState;
            this.devTools.send(null, liftedState);
        }
    }]);

    return _DevTools;
}();