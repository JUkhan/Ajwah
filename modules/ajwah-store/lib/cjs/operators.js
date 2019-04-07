'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ofType = undefined;

var _operators = require('rxjs/operators');

var ofType = exports.ofType = function ofType() {
    for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
        types[_key] = arguments[_key];
    }

    return function (source) {
        return source.pipe((0, _operators.filter)(function (_ref) {
            var type = _ref.type;

            return types.some(function (_type) {
                return _type === type;
            });
        }));
    };
};