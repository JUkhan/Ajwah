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
                return _this.dispatchMonotorAction(message);
            });
            ctx.dispatcher.pipe(withLatestFrom(ctx.store)).subscribe(function (_ref2) {
                var _ref3 = _slicedToArray(_ref2, 2),
                    action = _ref3[0],
                    state = _ref3[1];

                if (action.type === 'INIT') {
                    _this.initValue = state;
                }
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
        key: 'setValue',
        value: function setValue(state) {
            this.ctx.store.importState(state);
            return state;
        }
    }, {
        key: 'dispatchMonotorAction',
        value: function dispatchMonotorAction(message) {

            if (message.type === 'DISPATCH') {
                switch (message.payload.type) {
                    case 'xRESET':
                        this.devTools.init(this.setValue(this.initValue));
                        break;;
                    case 'xCOMMIT':
                        this.devTools.init(this.ctx.store.getValue());
                        break;
                    case 'xROLLBACK':
                        this.devTools.init(this.setValue(parse(message.state)));
                        break;
                    case 'JUMP_TO_STATE':
                    case 'JUMP_TO_ACTION':
                        this.setValue(parse(message.state));
                        break;
                    case 'xTOGGLE_ACTION':
                        this.devTools.send(null, this.toggleAction(message.payload.id, message.state));
                        break;
                    case 'IMPORT_STATE':
                        {
                            var nextLiftedState = message.payload.nextLiftedState;
                            var computedStates = nextLiftedState.computedStates;

                            this.setValue(computedStates[computedStates.length - 1].state);
                            this.devTools.send(null, nextLiftedState);
                            break;
                        }
                    default:
                        break;
                }
            } else if (message.type === 'ACTION') {
                this.ctx.store.next(message.payload);
            }
        }
    }, {
        key: 'toggleAction',
        value: function toggleAction(id, strState) {

            var liftedState = parse(strState);

            var idx = liftedState.skippedActionIds.indexOf(id);
            var skipped = idx !== -1;
            var start = liftedState.stagedActionIds.indexOf(id);
            if (start === -1) return liftedState;

            this.setValue(liftedState.computedStates[start - 1].state);
            for (var i = skipped ? start : start + 1; i < liftedState.stagedActionIds.length; i++) {
                if (i !== start && liftedState.skippedActionIds.indexOf(liftedState.stagedActionIds[i]) !== -1) continue; // it's already skipped

                //dispatch(store, liftedState.actionsById[liftedState.stagedActionIds[i]].action);
                console.log(liftedState.actionsById[liftedState.stagedActionIds[i]].action);
                //liftedState.computedStates[i].state = this.ctx.store.getValue();
            }

            if (skipped) {
                liftedState.skippedActionIds.splice(idx, 1);
            } else {
                liftedState.skippedActionIds.push(id);
            }
            return liftedState;
        }
    }]);

    return _DevTools;
}();