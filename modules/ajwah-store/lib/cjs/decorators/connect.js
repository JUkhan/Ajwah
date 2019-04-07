'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Connect = Connect;

var _storeContext = require('../storeContext');

var _rxjs = require('rxjs');

var _metakeys = require('.//metakeys');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function mount() {
    var _this = this;

    var meta = this[_metakeys.CONNECT_METADATA_KEY];
    meta.mount.call(this);
    Object.keys(meta.mapState).forEach(function (key) {
        meta.subscription.add(_this.store.select(meta.mapState[key]).subscribe(function (res) {
            _this.setState(_defineProperty({}, key, res));
        }));
    });
}
function unmount() {
    var meta = this[_metakeys.CONNECT_METADATA_KEY];
    meta.unmount.call(this);
    meta.subscription.unsubscribe();
}
function subscriber(mapState, componentInstance) {
    componentInstance.store = (0, _storeContext.getStore)();
    var mapKeys = Object.keys(mapState);
    if (mapKeys.length === 0) return;

    var config = {
        mount: function mount() {},
        unmount: function unmount() {},
        subscription: new _rxjs.Subscription(),
        mapState: mapState
    };

    if (componentInstance.componentWillMount) {
        config.mount = componentInstance.componentWillMount;
    }

    componentInstance.componentWillMount = mount;

    if (componentInstance.componentWillUnmount) {
        config.unmount = componentInstance.componentWillUnmount;
    }
    componentInstance.componentWillUnmount = unmount;
    componentInstance[_metakeys.CONNECT_METADATA_KEY] = config;
}
function Connect() {
    var mapState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var component = arguments[1];

    if (component) {
        subscriber(mapState, component);return;
    }
    return function (target) {
        target = target.prototype;

        Object.defineProperty(target, 'store', {
            get: function get() {
                return (0, _storeContext.getStore)();
            },

            enumerable: true,
            configurable: true
        });

        var mapKeys = Object.keys(mapState);
        if (mapKeys.length === 0) return;

        var config = {
            mount: function mount() {},
            unmount: function unmount() {},
            subscription: new _rxjs.Subscription(),
            mapState: mapState
        };

        if (target.hasOwnProperty('componentWillMount')) {
            config.mount = target.componentWillMount;
        }
        Object.defineProperty(target, 'componentWillMount', {
            value: mount
        });

        if (target.hasOwnProperty('componentWillUnmount')) {
            config.unmount = target.componentWillUnmount;
        }
        Object.defineProperty(target, 'componentWillUnmount', {
            value: unmount
        });

        Object.defineProperty(target, _metakeys.CONNECT_METADATA_KEY, {
            value: config,
            writable: false
        });
    };
}