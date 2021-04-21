import { createStore, RegisterState } from "./store";

import { Action } from "./action";

import { useActionHandler } from "./hooks/useActionHandler";
import { useStore, createStoreHook } from "./hooks/useStore";
import { useStoreEffect } from "./hooks/useStoreEffecct";
import { useSelector } from "./hooks/useSelector";
import { useDispatch } from "./hooks/useDispatch";

import { Provider } from "./components/provider";

export {
  createStore,
  RegisterState,
  Action,
  useStore,
  useActionHandler,
  useStoreEffect,
  useSelector,
  createStoreHook,
  useDispatch,
  Provider,
};
