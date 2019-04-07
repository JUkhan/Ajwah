import { filter } from 'rxjs/operators';

export var ofType = function ofType() {
    for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
        types[_key] = arguments[_key];
    }

    return function (source) {
        return source.pipe(filter(function (_ref) {
            var type = _ref.type;

            return types.some(function (_type) {
                return _type === type;
            });
        }));
    };
};