<template>
  <div>
    <div class="row">
      <h1 class="todo-app-title">Todos</h1>
    </div>
    <form @submit.prevent="getTodoList(loadListName).then(clearLoad)" >
      <div class="form-group row justify-content-center">
        <div class="col-sm-3">
          <vue-bootstrap-typeahead
            ref="listAutocomplete"
            v-model="loadListName"
            placeholder="Load a Todo list..."
            :data="listNames"
          />
        </div>
        <button type="submit" class="btn btn-dark" :disabled="loadListName === ''">Load</button>
      </div>
    </form>
    <form @submit.prevent="createNewTodoList(newListName).then(clearNew)">
      <div class="form-group row justify-content-center">
        <div class="col-sm-3">
          <input v-model="newListName" type="text" class="form-control" placeholder="Todo list title...">
        </div>
        <button type="submit" class="btn btn-success" :disabled="newListName === ''">Create New</button>
      </div>
    </form>
    <div class="row justify-content-center">
      <div class="col-sm-8 offset-sm-2">
      <section class="todoapp">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <div v-for="todolist in todoLists" :key="todolist.id">
              <a :class="{ active: todolist === activeTodoList }" class="nav-item nav-link" :id="todolist.id + '-tab'" data-toggle="tab"
                :href="'#' + todolist.id + 'content'" role="tab" aria-controls="nav-home"
                @click="setActiveTodoList(todolist)" aria-selected="true">{{todolist.name}}</a>
            </div>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div v-for="todolist in todoLists" :class="{ active: todolist === activeTodoList }" class="tab-pane fade show" :key="todolist.id"
            :id="todolist.id + + 'content'" role="tabpanel" :aria-labelledby="todolist.id + '-tab'">
            <div class="row">
              <div class="col">
                <ul class="list-group">
                  <li class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col-2">
                          <span class="fas fa-chevron-circle-down fa-2x" style="color: LightBlue; cursor: pointer;"
                            @click="setAllComplete(remaining > 0)"></span>
                        </div>
                        <div class="col" align="left">
                          <input class="new-todo"
                            autofocus autocomplete="on"
                            placeholder="What needs to be done?"
                            v-model="newTodo"
                            @keyup.enter="addTodoItem()">
                        </div>
                    </div>
                  </li>
                  <li v-for="todo in filteredTodos"
                    v-show="filteredTodos.length" v-cloak
                    class="list-group-item todo"
                    :key="todo.id"
                    :class="{ completed: todo.completed, editing: todo == editedTodo }">
                    <div class="row align-items-center">
                      <div class="col-2">
                        <span v-if="todo.completed" class="fas fa-check-circle fa-2x" style="color: Green; cursor: pointer;"
                          @click="toggleCompleted(todo)"></span>
                        <span v-else class="far fa-circle fa-2x" style="cursor: pointer;"
                          @click="toggleCompleted(todo)"></span>
                      </div>
                      <div class="todo-item col" align="left">
                        <label v-if="todo !== editedTodo"
                          @dblclick="editTodo(todo)">{{ todo.title }}</label>
                        <input class="edit" type="text"
                          v-else
                          v-model="todo.title"
                          v-todo-focus="todo == editedTodo"
                          @blur="doneEdit(todo)"
                          @keyup.enter="doneEdit(todo)"
                          @keyup.esc="cancelEdit(todo)">
                      </div>
                      <div class="col-1" align="right">
                        <span class="fas fa-times-circle fa" style="color: DarkRed; cursor: pointer;"
                          @click="deleteTodoItemIfSaved(todo)"></span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <footer class="footer" v-show="filteredTodos.length" v-cloak>
              <div class="row">
                <div class="col">
                  <span class="todo-count">
                    <strong>{{ remaining }}</strong> {{ remaining | pluralize }}
                  </span>
                  <ul class="filters">
                    <li><a href="#/all" :class="{ selected: visibility == 'all' }">All</a></li>
                    <li><a href="#/active" :class="{ selected: visibility == 'active' }">Active</a></li>
                    <li><a href="#/completed" :class="{ selected: visibility == 'completed' }">Completed</a></li>
                  </ul>
                </div>

                <div class="col-md-7" align="right">
                  <button class="clear-completed-button" @click="removeCompleted()" v-show="filteredTodos.length > remaining">
                    Clear Completed
                  </button>
                  <button type="button" class="save-button" @click="saveTodoList()">
                    Save List
                  </button>
                  <button type="button" class="delete-button" @click="deleteTodoList()">
                    Delete List
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </section>
    </div>
    <div class="col-sm-2" align="left">
      <button type="button" class="undo-button" @click="undoState()" v-show="canUndo">
        Undo
      </button>
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
