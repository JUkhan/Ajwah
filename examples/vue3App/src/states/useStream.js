import store from "./store";
import { onMounted, onUnmounted, ref } from "vue";

export function useStreamByStateName(stateName) {
  let subs = null;
  let state = ref(store.getState(stateName));
  onMounted(() => {
    subs = store.select(stateName).subscribe((res) => {
      state.value = res;
    });
  });
  onUnmounted(() => {
    subs && subs.unsubscribe();
  });
  return state;
}

export function useStream(stream$, defaultValue = {}) {
  let subs = null;
  let state = ref(defaultValue);
  onMounted(() => {
    subs = stream$.subscribe((res) => {
      state.value = res;
    });
  });
  onUnmounted(() => {
    subs && subs.unsubscribe();
  });
  return state;
}
