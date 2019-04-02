<template>
  <div class="home">
    <Counter/>
    <div class="todo-container">
      <header class="header">Todo List</header>
      <Todos/>
    </div>
    <div class="row">
      <div class="col-6">
        <AddTutorial/>
      </div>
      <div class="col-6">
        <TutorialList/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import Counter from "@/components/Counter.vue";
import TutorialList from "@/components/TutorialList.vue";
import AddTutorial from "@/components/AddTutorial.vue";
import Todos from "@/components/Todos.vue";

export default {
  name: "home",
  components: {
    Counter,
    TutorialList,
    AddTutorial,
    Todos
  }
};
</script>
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}
.btn {
  display: inline-block;
  border: none;
  background: #555;
  color: #fff;
  padding: 7px 20px;
  cursor: pointer;
}
.btn:hover {
  background: #666;
}
.header {
  background: #333;
  color: #fff;
  text-align: center;
  padding: 10px;
}
.todo-container {
  display: inline-block;
  width: 450px;
  margin: 0 auto;
}
</style>