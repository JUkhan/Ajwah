<template>
  <Counter />
  <todos />
</template>

<script>
import store from "./states/store";
import { devTools } from "ajwah-devtools";
import Counter from "./components/counter.vue";
import todos from "./components/todos.vue";
devTools({ store, name: "Hi tools" });
export default {
  name: "App",
  components: {
    Counter,
    todos,
  },
};
</script>
