import { Subscription, Observable } from "rxjs";
export const CONNECT_METADATA_KEY = "ajwah/connect";

function mount() {
  const meta = this[CONNECT_METADATA_KEY];
  meta.mount.call(this);
  Object.keys(meta.mapState).forEach((key) => {
    meta.subscription.add(
      meta.mapState[key].subscribe((res: any) => {
        this.setState({ [key]: res });
      })
    );
  });
}

function unmount() {
  const meta = this[CONNECT_METADATA_KEY];
  meta.unmount.call(this);
  meta.subscription.unsubscribe();
}
function subscriber(
  mapState: { [key: string]: Observable<any> },
  componentInstance: any
) {
  //componentInstance.store = store();
  const mapKeys = Object.keys(mapState);
  if (mapKeys.length === 0) return;

  let config = {
    mount: () => {},
    unmount: () => {},
    subscription: new Subscription(),
    mapState,
  };
  componentInstance.state = mapKeys.reduce((a: any, b: string) => {
    a[b] = {};
    return a;
  }, {});

  if (componentInstance.componentDidMount) {
    config.mount = componentInstance.componentDidMount;
  }
  componentInstance.componentDidMount = mount;

  if (componentInstance.componentWillUnmount) {
    config.unmount = componentInstance.componentWillUnmount;
  }
  componentInstance.componentWillUnmount = unmount;
  componentInstance[CONNECT_METADATA_KEY] = config;
}
export function Connect(
  mapState: { [key: string]: Observable<any> },
  component?: any
) {
  if (!mapState) {
    mapState = {};
  }
  if (component) {
    subscriber(mapState, component);
    return;
  }
  return function (target: any) {
    target = target.prototype;

    /*Object.defineProperty(target, "store", {
      get() {
        return store();
      },
      enumerable: true,
      configurable: true,
    });*/

    const mapKeys = Object.keys(mapState);
    if (mapKeys.length === 0) return;

    target.state = mapKeys.reduce((a: any, b: string) => {
      a[b] = {};
      return a;
    }, {});

    let config = {
      mount: () => {},
      unmount: () => {},
      subscription: new Subscription(),
      mapState,
    };

    if (target.hasOwnProperty("componentDidMount")) {
      config.mount = target.componentDidMount;
    }
    Object.defineProperty(target, "componentDidMount", {
      value: mount,
    });

    if (target.hasOwnProperty("componentWillUnmount")) {
      config.unmount = target.componentWillUnmount;
    }
    Object.defineProperty(target, "componentWillUnmount", {
      value: unmount,
    });

    Object.defineProperty(target, CONNECT_METADATA_KEY, {
      value: config,
      writable: false,
    });
  };
}
