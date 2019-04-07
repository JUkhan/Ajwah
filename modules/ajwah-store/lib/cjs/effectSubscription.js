"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EffectSubscription = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = require("rxjs");

var _effect = require("./decorators/effect");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EffectSubscription = exports.EffectSubscription = function (_Subscription) {
    _inherits(EffectSubscription, _Subscription);

    function EffectSubscription(store) {
        _classCallCheck(this, EffectSubscription);

        var _this = _possibleConstructorReturn(this, (EffectSubscription.__proto__ || Object.getPrototypeOf(EffectSubscription)).call(this));

        _this.store = store;
        return _this;
    }

    _createClass(EffectSubscription, [{
        key: "addEffect",
        value: function addEffect(effObservable) {
            this.add(effObservable.subscribe(this.store));
        }
    }, {
        key: "addEffectByKey",
        value: function addEffectByKey(effObservable, subscription) {
            subscription.add(effObservable.subscribe(this.store));
        }
    }, {
        key: "addEffects",
        value: function addEffects(effectInstances, action$) {
            var _this2 = this;

            var sources = effectInstances.reduce(function (arr, instance) {
                arr.push((0, _effect.mergeEffects)(instance, action$, _this2.store));
                return arr;
            }, []);
            var merged = _rxjs.merge.apply(undefined, _toConsumableArray(sources));
            this.add(merged.subscribe(this.store));
        }
    }, {
        key: "addEffectsByKey",
        value: function addEffectsByKey(instance, action$, subscription) {
            var merged = (0, _effect.mergeEffects)(instance, action$, this.store);
            subscription.add(merged.subscribe(this.store));
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this.unsubscribe();
        }
    }]);

    return EffectSubscription;
}(_rxjs.Subscription);