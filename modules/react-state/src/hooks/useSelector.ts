// import React from "react";
// import { MonoStore } from "../store";
// import { ReactMonoContext } from "../components/context";
// import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";
// import { useMonoContext as useDefaultMonoContext } from "./useMonoContext";

// const refEquality = (a: any, b: any) => a === b;

// function useSelectorHelper(selector: any, store: MonoStore, equalityFn: any) {
//   const [, forceRender] = React.useReducer((s) => s + 1, 0);

//   const latestSelectedState = React.useRef();

//   let selectedState: any;
//   if (latestSelectedState.current === undefined) {
//     selectedState = selector(store.getState());
//   } else {
//     selectedState = latestSelectedState.current;
//   }

//   useIsomorphicLayoutEffect(() => {
//     latestSelectedState.current = selectedState;
//   });

//   useIsomorphicLayoutEffect(() => {
//     const sub = store.select(selector).subscribe((newSelectedState) => {
//       if (!equalityFn(newSelectedState, latestSelectedState.current)) {
//         latestSelectedState.current = newSelectedState;
//         console.log(newSelectedState);
//         forceRender();
//       }
//     });
//     return function () {
//       sub?.unsubscribe();
//     };
//   }, [store]);
//   return selectedState;
// }

// export function createSelectorHook(context = ReactMonoContext) {
//   const useMonoContext =
//     context === ReactMonoContext
//       ? useDefaultMonoContext
//       : () => React.useContext<MonoStore>(context);
//   return function useSelector<S = any, R = any>(
//     selector: (state: S) => R,
//     equalityFn = refEquality
//   ) {
//     const store = useMonoContext();

//     const selectedState = useSelectorHelper(selector, store, equalityFn);
//     return selectedState;
//   };
// }
// export const useSelector = createSelectorHook();

import React from "react";
import { useStore } from "./useStore";
import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";

export function useSelector<S = any, R = any>(selector: (state: S) => R) {
  const store = useStore();
  const [selectedState, setState] = React.useState(selector(store.getState()));
  useIsomorphicLayoutEffect(() => {
    const sub = store.select(selector).subscribe((newSelectedState) => {
      setState(newSelectedState);
    });
    return function () {
      sub === null || sub === void 0 ? void 0 : sub.unsubscribe();
    };
  }, [store]);

  return selectedState;
}
