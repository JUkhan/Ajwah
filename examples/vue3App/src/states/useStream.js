import store from "./store";
import { onMounted, onUnmounted, ref } from "vue";

export function useStreamByStateName(stateName, defaultValue = {}) {
  let subs = null;
  let state = ref(defaultValue);
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

export function useStreamBySelect(stream$, defaultValue = {}) {
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
