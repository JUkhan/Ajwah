<template>
  <div class="home">
    <Counter/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue";
import Counter from "@/components/Counter.vue";

@Component({
  components: {
    Counter
  }
})
export default class Home extends Vue {
  /**
   *
   */
  constructor() {
    super();
  }
}
</script>
