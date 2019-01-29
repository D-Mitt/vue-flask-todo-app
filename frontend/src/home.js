import axios from 'axios'
import { mapGetters, mapActions, mapState } from 'vuex'

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

export default {
  data () {
    return {
      randomNumber: 0,
      todos: todoStorage.fetch(),
      editedTodo: null,
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
      'uid',
      'remaining'
    ]),
    ...mapState([
      'newTodo',
      'visibility',
      'filteredTodos',
      'activeTodoListAllItems',
      'activeTodoListActiveItems',
      'activeTodoListCompletedItems',
      'todoListNames',
      'listNames'
    ]),
    newTodo: {
        get(){ return this.$store.getters.newTodo; },
        set( value ){ this.$store.commit('setNewTodo', value );}
    },
    visibility: {
        get(){ return this.$store.getters.visibility; },
        set( value ){ this.$store.commit('setVisibility', value );}
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
      'setActiveTodoList',
      'saveTodoList'
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
    isVaildVisibilityFilter(visibility) {
      return visibility === 'all' || visibility === 'active' || visibility === 'completed'
    },
    // handle routing
    onHashChange: function () {
      var visibility = window.location.hash.replace(/#\/?/, '')

      if (this.isVaildVisibilityFilter(visibility)) {
        this.visibility = visibility
      } else {
        window.location.hash = ''
        this.visibility = 'all'
      }
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
