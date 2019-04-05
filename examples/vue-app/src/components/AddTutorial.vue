<template>
  <form @submit="addTutorial($event)">
    <div class="form-group">
      <label for="name">Tutorial Name</label>
      <input
        v-model="tutorialModel.name"
        type="text"
        class="form-control"
        id="name"
        name="name"
        placeholder="Enter Name"
      >
    </div>
    <div class="form-group">
      <label for="url">URL</label>
      <input
        v-model="tutorialModel.url"
        type="text"
        class="form-control"
        id="url"
        name="url"
        placeholder="Enter url"
      >
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>
<script>
import { ADD_TUTORIAL } from "../states/actions";
export default {
  name: "AddTutorial",
  data() {
    return {
      tutorialModel: { name: "", url: "" }
    };
  },
  methods: {
    addTutorial(e) {
      e.preventDefault();
      this.store.dispatch({
        type: ADD_TUTORIAL,
        payload: { ...this.tutorialModel }
      });
      this.tutorialModel = { name: "", url: "" };
    }
  }
};
</script>
