<template>
  <div class="about" v-if="user">
    <h1 v-if="user.loading">loading...</h1>
    <h3 v-for="user in user.data" v-bind:key="user.id">{{user.name}}</h3>
  </div>
</template>
<script>
import UserState from "../states/userState";
import { LOAD_USERS } from "../states/actions";

export default {
  subscriptions() {
    return {
      user: this.$tore.select("user")
    };
  },

  created() {
    this.$tore.addState(UserState);
    this.$tore.dispatch({ type: LOAD_USERS });
  },
  beforeDestroy() {
    this.$tore.removeState("user");
  }
};
</script>
