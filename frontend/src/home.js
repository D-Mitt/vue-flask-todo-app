import axios from 'axios'
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      newListName: '',
      loadListName: ''
    }
  },
  // computed properties
  // https://vuejs.org/guide/computed.html
  computed: {
    ...mapGetters([
      'todoLists',
      'todoItems',
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
      'listNames',
      'editedTodo',
      'todoEditCache',
      'activeTodoList'
    ]),
    newTodo: {
        get(){ return this.$store.getters.newTodo; },
        set( value ){ this.$store.commit('setNewTodo', value );}
    },
    visibility: {
        get(){ return this.$store.getters.visibility; },
        set( value ){
          console.log(value)
          this.$store.dispatch('setVisibility', value )
        }
    },

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
      'saveTodoList',
      'editTodo',
      'doneEdit',
      'cancelEdit',
      'recalculateTodoLists',
      'setAllComplete',
      'removeCompleted',
      'toggleCompleted',
      'deleteTodoItemIfSaved',
      'setVisibility',
    ]),
    clearNew() {
      this.newListName = ''
    },
    // Required to update autocomplete after loading
    clearLoad() {
      this.$refs.listAutocomplete.inputValue = ''
    },
    undoState () {
      this.undo()
      this.$store.commit('setActiveTodoList', {})
      this.$store.commit('setActiveTodoList', this.activeTodoList)
      this.$store.dispatch('recalculateTodoListsWithoutSavingState')
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
