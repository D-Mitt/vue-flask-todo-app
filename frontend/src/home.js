import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

// localStorage persistence
var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}

export default {
  data () {
    return {
      todos: todoStorage.fetch(),
      editedTodo: null,
      visibility: 'all',
      newListName: '',
      loadListName: ''
    }
  },
  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },

  // computed properties
  // https://vuejs.org/guide/computed.html
  computed: {
    ...mapGetters([
      'todoLists',
      'todoItems',
      'allDone',
      'activeTodoList',
      'todoItems',
      'newTodo',
      'uid'
    ]),
    filteredTodos: function () {
      return filters[this.visibility](this.todos)
    },
    remaining: function () {
      return filters.active(this.todos).length
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    ...mapActions([
      'createNewTodoList',
      'getTodoList',
      'deleteTodoList',
      'saveTodoItem',
      'addTodoItem',
      'updateTodoItem',
      'deleteTodoItem',
      'setActiveTodoList'
    ]),
    setAllComplete: function (value) {
      this.todos.forEach(function (todo) {
        todo.completed = value
      })
    },
    toggleCompleted: function(todo) {
      todo.completed = !todo.completed
    },
    clearNew() {
      this.newListName = ''
    },
    clearLoad() {
      this.loadListName = ''
    },

    addListTitle: function() {

    },

    removeTodo: function (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    removeCompleted: function () {
      this.todos = filters.active(this.todos)
    },
    // handle routing
    onHashChange: function () {
      var visibility = window.location.hash.replace(/#\/?/, '')

      if (filters[visibility]) {
        this.visibility = visibility
      } else {
        window.location.hash = ''
        this.visibility = 'all'
      }
    },
    editHandler: function () {
      var t = $(this);
      t.css("visibility", "hidden");
      $(this).prev().attr("contenteditable", "true").focusout(function() {
        $(this).removeAttr("contenteditable").off("focusout");
        t.css("visibility", "visible");
      });
    }
  },
  mounted() {
    window.addEventListener('hashchange', this.onHashChange)
    this.onHashChange()

  },
  created() {
    this.$store.dispatch('updateTodoLists')
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // https://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
}
