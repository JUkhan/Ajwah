'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dispatch = dispatch;
exports.subscriptions = subscriptions;

var _storeContext = require('./storeContext');

var _rxjs = require('rxjs');

function dispatch(actionName, payload) {
    try {
        return (0, _storeContext.getStore)().dispatch(actionName, payload);
    } catch (error) {
        throw 'usually dispatch() function does not work in vue. You need to set the \'exposeStore\' boolean option \'true\' to make it workable. ex: Vue.use(AjwahStore, {exposeStore:true})';
    }
}

function subscriptions(obj) {
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