<template>
  <div>
    <div class="row">
      <h1 class="todo-app-title">Todos</h1>
    </div>
    <form>
      <div class="form-group row justify-content-center">
        <div class="col-sm-3">
          <input type="text" class="form-control" placeholder="Load a Todo list...">
        </div>
        <button type="submit" class="btn btn-dark" :disabled="newListName === ''">Load</button>
      </div>
    </form>
    <form>
      <div class="form-group row justify-content-center">
        <div class="col-sm-3">
          <input v-model="newListName" type="text" class="form-control" placeholder="Todo list title...">
        </div>
        <button type="submit" class="btn btn-success" :disabled="newListName === ''">Create New</button>
      </div>
    </form>
    <div class="row justify-content-center">
      <div class="col-sm-5">
      <section class="todoapp">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <div v-for="todolist in filteredTodos" :key="todolist.id">
              <a class="nav-item nav-link active" :id="todolist.id + '-tab'" data-toggle="tab"
                :href="'#' + todolist.id + + 'content'" role="tab" aria-controls="nav-home" aria-selected="true">{{todolist.title}}</a>
            </div>
          </div>
        </nav>
        <!-- <div class="tab-content" id="nav-tabContent">
          <div v-for="todolist in filteredTodos" class="tab-pane fade show active" :key="todolist.id"
            :id="todolist.id + + 'content'" role="tabpanel" :aria-labelledby="todolist.id + '-tab'"> -->

            <header class="header">
              <input class="new-todo"
                autofocus autocomplete="off"
                placeholder="What needs to be done?"
                v-model="newTodo"
                @keyup.enter="addTodo">
            </header>
            <section class="main" v-show="todos.length" v-cloak>
              <input class="toggle-all" type="checkbox" v-model="allDone">
              <ul class="todo-list">
                <li v-for="todo in filteredTodos"
                  class="todo"
                  :key="todo.id"
                  :class="{ completed: todo.completed, editing: todo == editedTodo }">
                  <div class="view">
                    <input class="toggle" style="left: 0;right: 0;"
                    type="checkbox" v-model="todo.completed">
                    <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
                    <button class="destroy" @click="removeTodo(todo)"></button>
                  </div>
                  <input class="edit" type="text"
                    v-model="todo.title"
                    v-todo-focus="todo == editedTodo"
                    @blur="doneEdit(todo)"
                    @keyup.enter="doneEdit(todo)"
                    @keyup.esc="cancelEdit(todo)">
                </li>
              </ul>
            </section>
            <footer class="footer" v-show="todos.length" v-cloak>
              <span class="todo-count">
                <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
              </span>
              <ul class="filters">
                <li><a href="#/all" :class="{ selected: visibility == 'all' }">All</a></li>
                <li><a href="#/active" :class="{ selected: visibility == 'active' }">Active</a></li>
                <li><a href="#/completed" :class="{ selected: visibility == 'completed' }">Completed</a></li>
              </ul>
              <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
                Clear completed
              </button>
            </footer>
          <!-- </div> -->
        <!-- </div> -->
      </section>
    </div>
  </div>
  <div class="row">
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>Written by <a href="http://evanyou.me">Evan You</a></p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      <p>Modified by Dan Mitton</p>
    </footer>
  </div>
</div>
</template>

<script>
// for testing
if (navigator.userAgent.indexOf('PhantomJS') > -1) localStorage.clear()
</script>
<!-- Delete ".min" for console warnings in development -->
<script src="../../dist/vue.min.js"></script>
<script src="../home.js"></script>

<style>
  @import '../assets/styles/styles.css';
</style>
