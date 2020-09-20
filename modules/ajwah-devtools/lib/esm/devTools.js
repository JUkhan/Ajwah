var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { filter, withLatestFrom } from "rxjs/operators";
import { parse } from "jsan";

export function devTools() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { maxAge: 8, name: "Ajwah DevTools" },
      store = _ref.store,
      maxAge = _ref.maxAge,
      name = _ref.name;

  if (!store) return;
  var withDevtools = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && typeof window["__REDUX_DEVTOOLS_EXTENSION__"] !== "undefined";
  return withDevtools ? new _DevTools({ name: name, maxAge: maxAge }, store) : runLog(store);
}

function runLog(store) {
  store.exportState().subscribe(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        action = _ref3[0],
        state = _ref3[1];

    console.group(action.type);
    console.info("payload: ", action.payload);
    console.info(state);
    console.groupEnd();
  });
}

var _DevTools = function () {
  function _DevTools(config, store) {
    _classCallCheck(this, _DevTools);

    this.config = config;
    this.ctx = { store: store };
    this.run();
  }

  _createClass(_DevTools, [{
    key: "run",
    value: function run() {
      var _this = this;

      this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(this.config);
      this.unsubscribe = this.devTools.subscribe(function (message) {
        return _this.dispatchMonitorAction(message);
      });

      this.ctx.store.exportState().pipe(filter(function (arr) {
        return arr[0].type && arr[0].type !== "@importState";
      })).subscribe(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
            action = _ref5[0],
            state = _ref5[1];

        _this.devTools.send(action, state);
      });
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.unsubscribe();
      window.devToolsExtension.disconnect();
    }
  }, {
    key: "setAppState",
    value: function setAppState(state) {
      this.ctx.store.importState(state);
    }
  }, {
    key: "getAppState",
    value: function getAppState() {
      return this.copyObj(this.ctx.store.getValue());
    }
  }, {
    key: "copyObj",
    value: function copyObj(obj) {
      return _extends({}, obj);
    }
  }, {
    key: "dispatchMonitorAction",
    value: function dispatchMonitorAction(message) {
      if (message.type === "DISPATCH") {
        var state = void 0;
        switch (message.payload.type) {
          case "RESET":
            this.setAppState({});
            this.devTools.init(this.getAppState());
            break;
          case "COMMIT":
            this.devTools.init(this.getAppState());
            break;
          case "ROLLBACK":
            state = parse(message.state);
            this.setAppState(state);
            this.devTools.init(state);
            break;
          case "SWEEP":
            state = this.liftedState;
            state.skippedActionIds.forEach(function (id) {
              delete state.actionsById[id];
              state.computedStates.splice(id, 1);
            });
            state.currentStateIndex -= state.skippedActionIds.length;
            state.nextActionId -= state.skippedActionIds.length;
            state.skippedActionIds = [];
            var actionsById = {};
            state.stagedActionIds = [];
            Object.keys(state.actionsById).forEach(function (id, index) {
              actionsById[index] = state.actionsById[id];
              state.stagedActionIds.push(index);
            });
            state.actionsById = actionsById;
            this.devTools.send(null, state);
            break;
          case "JUMP_TO_STATE":
          case "JUMP_TO_ACTION":
            this.setAppState(parse(message.state));
            break;
          case "TOGGLE_ACTION":
            this.toggleAction(message.payload.id, message.state);
            break;
          case "IMPORT_STATE":
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
      } else if (message.type === "ACTION") {
        try {
          var action = parse(message.payload);
          this.ctx.store.next(action);
        } catch (err) {
          console.error("Incorrect json format: " + message.payload + " ex: {\"type\":\"Inc\"}");
        }
      }
    }
  }, {
    key: "findStartIndex",
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
    key: "toggleAction",
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