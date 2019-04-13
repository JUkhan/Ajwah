function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { getStore } from '../storeContext';
import { Subscription } from 'rxjs';
import { CONNECT_METADATA_KEY } from '../tokens';

function mount() {
    var _this = this;

    var meta = this[CONNECT_METADATA_KEY];
    meta.mount.call(this);
    Object.keys(meta.mapState).forEach(function (key) {
        meta.subscription.add(_this.store.select(meta.mapState[key]).subscribe(function (res) {
            _this.setState(_defineProperty({}, key, res));
        }));
    });
}
function unmount() {
    var meta = this[CONNECT_METADATA_KEY];
    meta.unmount.call(this);
    meta.subscription.unsubscribe();
}
function subscriber(mapState, componentInstance) {
    componentInstance.store = getStore();
    var mapKeys = Object.keys(mapState);
    if (mapKeys.length === 0) return;

    var config = {
        mount: function mount() {},
        unmount: function unmount() {},
        subscription: new Subscription(),
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
    componentInstance[CONNECT_METADATA_KEY] = config;
}
export function Connect() {
    var mapState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var component = arguments[1];

    if (component) {
        subscriber(mapState, component);return;
    }
    return function (target) {
        target = target.prototype;

        Object.defineProperty(target, 'store', {
            get: function get() {
                return getStore();
            },

            enumerable: true,
            configurable: true
        });

        var mapKeys = Object.keys(mapState);
        if (mapKeys.length === 0) return;

        var config = {
            mount: function mount() {},
            unmount: function unmount() {},
            subscription: new Subscription(),
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

        Object.defineProperty(target, CONNECT_METADATA_KEY, {
            value: config,
            writable: false
        });
    };
}