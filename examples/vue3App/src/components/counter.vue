<template>
  <p>
    <button class="btn" @click="inc()">+</button>
    <button class="btn" @click="dec()">-</button>
    <button class="btn" @click="async_inc()">async(+)</button>
    {{ counter.msg || counter.count }}
  </p>
</template>

<script>
import store from "../states/store";
import "../states/counterState";
import { useStreamByStateName } from "../states/useStream";

export default {
  name: "Counter",
  setup() {
    console.log("setup---");
    const counter = useStreamByStateName("counter", { count: 0, msg: "" });

    function inc() {
      store.dispatch("inc");
    }
    function dec() {
      store.dispatch("dec");
    }
    function async_inc() {
      store.dispatch("asyncInc");
    }

    return { inc, dec, async_inc, counter };
  },
};
</script>
