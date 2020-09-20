<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Counter />
</template>

<script>
import store from "./states/store";
import { devTools } from "ajwah-devtools";
import Counter from "./components/counter.vue";
devTools({ store, name: "Hi tools" });
export default {
  name: "App",
  components: {
    Counter,
  },
};
</script>
