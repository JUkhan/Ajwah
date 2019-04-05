<template>
  <div class="list-group">
    <a href="#" class="list-group-item list-group-item-action active">Tutorials</a>
    <a
      v-for="t in tutorial.data"
      href="#"
      class="list-group-item list-group-item-action"
      @click="onRemove(t.name)"
      v-bind:key="t.name"
    >{{t.name}}</a>
  </div>
</template>

<script>
import { REMOVE_TUTORIAL } from "../states/actions";
export default {
  name: "TutorialList",
  subscriptions() {
    return {
      tutorial: this.store.select("tutorial")
    };
  },
  methods: {
    onRemove(name) {
      this.store.dispatch({ type: REMOVE_TUTORIAL, payload: name });
    }
  }
};
</script>
