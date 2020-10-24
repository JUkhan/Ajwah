<template>
  <div>
    <div class="float-left">{{ activeItem }}</div>
    <div class="float-right">
      <button
        class="mr-2 text-blue-500 hover:text-blue-800"
        v-bind:class="{ active: sc === 1 }"
        @click="all()"
      >
        All
      </button>
      <button
        class="mr-2 text-blue-500 hover:text-blue-800"
        v-bind:class="{ active: sc === 2 }"
        @click="active()"
      >
        Active
      </button>
      <button
        class="mr-2 text-blue-500 hover:text-blue-800"
        v-bind:class="{ active: sc === 3 }"
        @click="completed()"
      >
        Completed
      </button>
    </div>
    <div class="clear-both"></div>
  </div>
</template>

<script>
import store from "../states/store";
import { useStream } from "../states/useStream";
import {
  TodoActions,
  SearchCategory,
  searchCategory$,
  activeItem$,
} from "../services/todoService";
export default {
  name: "toolbar",
  setup() {
    const sc = useStream(searchCategory$, 1);
    const activeItem = useStream(activeItem$, "");
    function all() {
      store.dispatch(TodoActions.searchCategory, SearchCategory.all);
    }
    function active() {
      store.dispatch(TodoActions.searchCategory, SearchCategory.active);
    }
    function completed() {
      store.dispatch(TodoActions.searchCategory, SearchCategory.completed);
    }
    return { all, active, completed, sc, activeItem };
  },
};
</script>

<style>
.active {
  color: yellowgreen;
}
</style>