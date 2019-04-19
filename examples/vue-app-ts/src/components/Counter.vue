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
import { dispatch, storeCtx } from "ajwah-store";

export default {
  name: "Counter",
  subscriptions() {
    return {
      counter: this.storeCtx.select("counter")
    };
  },

  methods: {
    inc() {
      //this.store.dispatch({ type: INCREMENT });
      dispatch(INCREMENT);
    },
    dec() {
      this.storeCtx.dispatch({ type: DECREMENT });
    },
    async_inc() {
      this.storeCtx.dispatch({ type: ASYNC_INCREMENT });
    }
  }
};
</script>

