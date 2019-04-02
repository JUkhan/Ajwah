<template>
  <p>
    <button class="btn" @click="inc()">+</button>
    <button class="btn" @click="dec()">-</button>
    <button class="btn" @click="async_inc()">async(+)</button>
    {{counter.msg||counter.count}}
  </p>
</template>

<script>
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../states/actions";
export default {
  name: "Counter",
  subscriptions() {
    return {
      counter: this.$tore.select("counter")
    };
  },

  methods: {
    inc() {
      this.$tore.dispatch({ type: INCREMENT });
    },
    dec() {
      this.$tore.dispatch({ type: DECREMENT });
    },
    async_inc() {
      this.$tore.dispatch({ type: ASYNC_INCREMENT });
    }
  }
};
</script>

