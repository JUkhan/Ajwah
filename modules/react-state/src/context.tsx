import React from "react";
import { MonoStore } from './store';
const AppContext = React.createContext({} as any);
export interface StoreProps {
  store: MonoStore
}
export const Provider: React.FC<StoreProps> = ({ store, children }) => {
  const [state, setState] = React.useState(store.value);
  React.useEffect(() => {
    const sub = store
      .select()
      .subscribe((res: any) => {
        setState(res);
      });
    return () => {
      sub?.unsubscribe();
      store.dispose();
    };
  }, [store]);
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export function useStore<S = any, T = any>(fn: (state: S) => T): T {
  const state = React.useContext<S>(AppContext);
  return fn(state);
}
