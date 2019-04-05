<template>
  <div>
    <h3>{{todo.message}}</h3>
    <div v-bind:key="todo.id" v-for="todo in todo.data">
      <TodoItem v-bind:todo="todo" v-on:del-todo="$emit('del-todo', todo.id)"/>
    </div>
  </div>
</template>

<script>
import TodoItem from "./TodoItem.vue";
import { LOAD_TODOS } from "../states/actions";
export default {
  name: "Todos",
  components: {
    TodoItem
  },
  subscriptions() {
    return {
      todo: this.store.select("todo")
    };
  },
  created() {
    this.store.dispatch({ type: LOAD_TODOS });
  }
};
</script>

<style scoped>
</style>