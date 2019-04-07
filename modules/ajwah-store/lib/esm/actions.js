var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Observable } from "rxjs";
import { ofType as _ofType } from "./operators";

export var Actions = function (_Observable) {
    _inherits(Actions, _Observable);

    function Actions(dispatcher) {
        _classCallCheck(this, Actions);

        var _this = _possibleConstructorReturn(this, (Actions.__proto__ || Object.getPrototypeOf(Actions)).call(this));

        if (dispatcher) _this.source = dispatcher;
        return _this;
    }

    _createClass(Actions, [{
        key: "lift",
        value: function lift(operator) {
            var observable = new Actions(this);
            observable.operator = operator;
            return observable;
        }
    }, {
        key: "ofType",
        value: function ofType() {
            return _ofType.apply(undefined, arguments)(this);
        }
    }]);

    return Actions;
}(Observable);