<template>
  <div style="position: relative">
    <div style="position: absolute; left: 50%; top: 0" v-show="rotate > 0">
      <svg
        width="70"
        height="70"
        v-bind:style="{ transform: `rotate(${rotate}deg)` }"
      >
        <circle cy="35" cx="35" r="35" fill="lightgrey"></circle>
        <circle cy="15" cx="35" r="10" fill="black"></circle>
      </svg>
    </div>
  </div>
</template>

<script>
import { rotate$ } from "../services/todoService";
import { useStream } from "../states/useStream";
export default {
  name: "loading",
  setup() {
    const rotate = useStream(rotate$, 0);
    return { rotate };
  },
};
</script>

<style>
</style>