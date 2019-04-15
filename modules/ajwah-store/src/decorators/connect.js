import { storeCtx } from '../storeContext';
import { Subscription } from 'rxjs';
import { CONNECT_METADATA_KEY } from '../tokens';


function mount() {
    const meta = this[CONNECT_METADATA_KEY];
    meta.mount.call(this);
    Object.keys(meta.mapState).forEach(key => {
        meta.subscription.add(
            this.storeCtx.select(meta.mapState[key])
                .subscribe(res => { this.setState({ [key]: res }); }));
    });
}
function unmount() {
    const meta = this[CONNECT_METADATA_KEY];
    meta.unmount.call(this);
    meta.subscription.unsubscribe()
}
function subscriber(mapState, componentInstance) {
    componentInstance.storeCtx = storeCtx();
    const mapKeys = Object.keys(mapState);
    if (mapKeys.length === 0) return;

    let config = {
        mount: () => { },
        unmount: () => { },
        subscription: new Subscription(),
        mapState
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
export function Connect(mapState = {}, component) {
    if (!mapState) { mapState = {}; }
    if (component) { subscriber(mapState, component); return; }
    return function (target) {
        target = target.prototype;

        Object.defineProperty(target, 'storeCtx', {
            get() { return storeCtx(); },
            enumerable: true,
            configurable: true
        });

        const mapKeys = Object.keys(mapState);
        if (mapKeys.length === 0) return;

        let config = {
            mount: () => { },
            unmount: () => { },
            subscription: new Subscription(),
            mapState
        };

        if (target.hasOwnProperty('componentWillMount')) {
            config.mount = target.componentWillMount;
        }
        Object.defineProperty(target, 'componentWillMount', {
            value: mount,
        });

        if (target.hasOwnProperty('componentWillUnmount')) {
            config.unmount = target.componentWillUnmount;
        }
        Object.defineProperty(target, 'componentWillUnmount', {
            value: unmount,
        });

        Object.defineProperty(target, CONNECT_METADATA_KEY, {
            value: config,
            writable: false
        });
    }
}

