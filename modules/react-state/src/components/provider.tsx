import React from 'react';
import { MonoStore } from '../store';
import { ReactMonoContext } from '../components/context';
import { useIsomorphicLayoutEffect } from '../utils/useIsomorphicLayoutEffect';
interface StoreProps {
    store: MonoStore,
    context?: React.Context<MonoStore>
}

export const Provider: React.FC<StoreProps> = ({ store, context, children }) => {
    const storeValue = React.useMemo(() => {
        return store;
    }, [store]);
    useIsomorphicLayoutEffect(() => {

        return () => {
            storeValue?.dispose();
        }
    }, [storeValue]);
    const Context = context || ReactMonoContext
    return <Context.Provider value={storeValue}>{children}</Context.Provider>;
}
