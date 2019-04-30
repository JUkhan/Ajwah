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
      counter: storeCtx().select("counter")
    };
  },

  methods: {
    inc() {
      dispatch(INCREMENT);
    },
    dec() {
      dispatch({ type: DECREMENT });
    },
    async_inc() {
      dispatch({ type: ASYNC_INCREMENT });
    }
  }
};
</script>

