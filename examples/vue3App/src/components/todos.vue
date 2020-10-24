<template>
  <div class="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
    <loading />
    <addTodo />
    <toolBar />
    <todoItem
      v-for="todo in todos"
      :key="todo.id"
      v-bind:todo="todo"
    ></todoItem>
  </div>
</template>

<script>
import addTodo from "./addTodo.vue";
import todoItem from "./todoItem.vue";
import loading from "./loading.vue";
import toolBar from "./toolBar.vue";
import "../states/todoState";
import { todos$, TodoActions } from "../services/todoService";
import { useStream } from "../states/useStream";
import store from "../states/store";

export default {
  name: "todos",
  components: {
    addTodo,
    todoItem,
    loading,
    toolBar,
  },
  setup() {
    store.dispatch(TodoActions.loadtodos);
    const todos = useStream(todos$, []);
    return { todos };
  },
};
</script>

<style>
</style>