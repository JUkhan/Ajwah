'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AjwahStore = undefined;

var _storeContext = require('./storeContext');

var AjwahStore = exports.AjwahStore = {
    install: function install(Vue, options) {
        var _store = (0, _storeContext.getStoreContext)(options);
        Vue.prototype.store$ = _store;
        Vue.prototype.store = _store;
    }
};