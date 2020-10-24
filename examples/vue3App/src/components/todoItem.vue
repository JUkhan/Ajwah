<template>
  <div class="flex bg-white border p-2 justify-between">
    <div>
      <input
        class="align-middle mr-1"
        type="checkbox"
        v-model="todo.completed"
        @change="updateTodo()"
      />
      <span
        style="cursor: pointer"
        @dblclick="isDblclick = true"
        v-if="!isDblclick"
      >
        {{ todo?.description }}
      </span>
      <form v-else class="inline-block" @submit.prevent="updateTodo()">
        <input
          class="ml-1 pl-2 border"
          @blur="isDblclick = false"
          autofocus
          type="text"
          name="description"
          v-model="todo.description"
        />
      </form>
    </div>
    <div>
      <button class="text-red-200 hover:text-red-600" @click="removeTodo()">
        Remove
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import store from "../states/store";
import { TodoActions } from "../services/todoService";
import { useStream } from "../states/useStream";

export default {
  name: "todoItem",
  props: {
    todo: Object,
  },
  setup() {
    let isDblclick = ref(false);
    const updated = useStream(store.actions.whereType(TodoActions.updateEnd));
    watch(
      () => updated.value,
      (nv, ov) => {
        console.log(nv.value);
        isDblclick.value = false;
      }
    );
    function removeTodo() {
      store.dispatch(TodoActions.removeTodo, this.todo.id);
    }
    function updateTodo() {
      store.dispatch(TodoActions.updateTodo, this.todo);
    }

    return { removeTodo, updateTodo, isDblclick };
  },
};
</script>

<style>
</style>