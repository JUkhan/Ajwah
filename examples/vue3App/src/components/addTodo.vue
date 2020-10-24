<template>
  <form @submit.prevent="newTodo()" class="mb-4">
    <h1 class="text-grey-darkest">Todo List</h1>
    <div class="flex mt-4">
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
        type="text"
        name="descroption"
        v-model="description"
        placeholder="What needs to be done?"
      />
    </div>
  </form>
</template>

<script>
import { ref, watch, computed } from "vue";
import { TodoActions, addEnd$ } from "../services/todoService";
import store from "../states/store";
import { useStream } from "../states/useStream";

export default {
  nane: "addTodo",
  setup() {
    const description = ref("");
    const addEnd = useStream(addEnd$);
    watch(
      () => addEnd.value,
      (newValue, onlValue) => {
        description.value = "";
      }
    );
    function newTodo() {
      store.dispatch({
        type: TodoActions.addTodo,
        payload: { description: description.value, completed: false },
      });
    }
    return { description, newTodo };
  },
};
</script>

<style>
</style>