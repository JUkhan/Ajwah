'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dispatch = dispatch;
exports.subscribe = subscribe;

var _storeContext = require('./storeContext');

var _rxjs = require('rxjs');

function dispatch(actionName, payload) {
    try {
        return (0, _storeContext.getStore)().dispatch(actionName, payload);
    } catch (error) {
        throw 'This dispatch() function should not work in vue. please use this.store.dispatch()';
    }
}

function subscribe(obj) {
    var subs = new _rxjs.Subscription();
    Object.keys(obj).forEach(function (stateName) {
        return subs.add((0, _storeContext.getStore)().select(stateName).subscribe(function (data) {
            return obj[stateName](data);
        }));
    });
    return function () {
        return subs.unsubscribe();
    };
}