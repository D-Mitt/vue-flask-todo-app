import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import _ from 'lodash'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

export const store = new Vuex.Store({
  state: {
    todoLists: [],
    todoListNames: [],
    listNames: [],
    todoItems: [],
    allDone: false,
    activeTodoList: {},
    newTodo: '',
    uid: 0,
    visibility: 'all',
    activeTodoListAllItems: [],
    activeTodoListActiveItems: [],
    activeTodoListCompletedItems: [],
    filteredTodos: [],
    editedTodo: {},
    todoEditCache: ''
  },
  actions: {
    updateTodoLists (context) {
      axios.get('http://localhost:5000/todo_lists')
        .then(response => {
          if (response.status === 200) {
            return response.data
          }
        })
        .then(data => {
          context.dispatch('setUID', data)
          context.dispatch('getTodoListNames', data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    createNewTodoList (context, newListName) {
      if (_.find(this.state.todoLists, todoList => {
        return todoList.name === newListName
      })) {
        console.log('That name already exists for a todo list, please choose another.')
      } else {
        axios.post('http://localhost:5000/todo_lists', {
          name: newListName
        })
          .then(response => {
            if (response.status === 201) {
              return response.data
            }
          })
          .then(data => {
            context.commit('addTodoList', data)
            context.dispatch('setActiveTodoList', data)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    getTodoList (context, todoListName) {
      var todoList = _.find(this.state.todoListNames, (listName) => {
        return listName.name === todoListName
      })

      axios.get(`http://localhost:5000/todo_lists/${todoList.id}`)
        .then(response => {
          if (response.status === 200) {
            return response.data
          }
        })
        .then(data => {
          context.commit('addTodoList', data)
          context.dispatch('getTodoListItems', data.todos)
          context.dispatch('setActiveTodoList', data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteTodoList (context) {
      axios.delete(`http://localhost:5000/todo_lists/${this.state.activeTodoList.id}`)
        .then(response => {
          if (response.status === 204) {
            return response
          }
        })
        .then(resp => {
          context.commit('deleteTodoList', this.state.activeTodoList)
          context.dispatch('setActiveTodoList', {})
        })
        .catch(error => {
          console.log(error)
        })
    },
    saveTodoItem (context, postMsg) {
      axios.post('http://localhost:5000/todo', postMsg)
        .then(response => {
          if (response.status === 201) {
            return response.data
          }
        })
        .then(data => {
          context.commit('saveTodoItem', data)
          context.dispatch('recalculateTodoLists')
        })
        .catch(error => {
          console.log(error)
        })
    },
    getAllTodoListItems (context, todoLists) {
      _.forEach(todoLists, (todoList) => {
        context.dispatch('getTodoListItems', todoList.todos)
      })
    },
    getTodoListItems (context, todoListIds) {
      _.forEach(todoListIds, (id) => {
        context.dispatch('getTodoItem', id)
      })
    },
    getTodoItem (context, todoItemId) {
      axios.get(`http://localhost:5000/todo/${todoItemId}`)
        .then(response => {
          if (response.status === 200) {
            return response.data
          }
        })
        .then(data => {
          context.dispatch('setExistingTodoItem', data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateTodoItem (context, patch) {
      var todoItem = _.find(this.state.todoItems, item => {
        return item.title === patch.title
      })
      axios.patch(`http://localhost:5000/todo/${todoItem.id}`, {
        title: todoItem.title,
        completed: todoItem.completed
      })
        .then(response => {
          if (response.status === 200) {
            return response.data
          }
        })
        .then(data => {
          context.commit('saveTodoItem', data)
          context.dispatch('recalculateTodoLists')
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteTodoItem (context, todo) {
      axios.delete(`http://localhost:5000/todo/${todo.id}`)
        .then(response => {
          if (response.status === 204) {
            return response
          }
        })
        .then(resp => {
          context.dispatch('removeTodo', todo)
        })
        .catch(error => {
          console.log(error)
        })
    },
    setActiveTodoList (context, todoList) {
      context.commit('setActiveTodoList', todoList)
      context.dispatch('recalculateTodoLists')
    },
    setExistingTodoItem (context, existingTodoItem) {
      existingTodoItem = {...existingTodoItem, isNew: false, isUpdated: false}
      context.commit('setExistingTodoItem', existingTodoItem)
      context.dispatch('recalculateTodoListsWithoutSavingState')
    },
    addTodoItem (context) {
      var value = context.getters.newTodo && context.getters.newTodo.trim()

      if (!value) {
        return
      }
      context.commit('incrementUID')
      context.commit('addNewTodoItem', value)
      context.commit('resetNewTodo', value)
      context.dispatch('recalculateTodoLists')
    },
    recalculateTodoLists (context) {
      context.commit('setActiveTodoListAllItems')
      context.commit('setActiveTodoListActiveItems')
      context.commit('setActiveTodoListCompletedItems')
      context.commit('setFilteredTodos')
      context.commit('saveState')
    },
    recalculateTodoListsWithoutSavingState (context) {
      context.commit('setActiveTodoListAllItems')
      context.commit('setActiveTodoListActiveItems')
      context.commit('setActiveTodoListCompletedItems')
      context.commit('setFilteredTodos')
    },
    setUID ({ commit }, todoLists) {
      var highestUID = 0
      _.forEach(todoLists, function (todoList) {
        _.forEach(todoList.todos, function (value) {
          if (value > highestUID) {
            highestUID = value
          }
        })
      })
      commit('setHighestUID', highestUID)
    },
    saveTodoList (context) {
      _.forEach(this.state.activeTodoListAllItems, (item) => {
        if (item.isNew) {
          context.dispatch('saveTodoItem', {title: item.title, todo_list_id: this.state.activeTodoList.id})
        } else if (item.isUpdated) {
          context.dispatch('updateTodoItem', {title: item.title, todo_list_id: this.state.activeTodoList.id})
        }
      })
    },
    getTodoListNames (context, todoLists) {
      var names = []
      _.forEach(todoLists, (todo) => {
        names.push({id: todo.id, name: todo.name})
      })
      context.commit('updateTodoListNames', names)
    },
    editTodo (context, todo) {
      context.commit('setTodoEditCache', todo.title)
      context.commit('setEditedTodo', todo)
    },
    doneEdit (context, todo) {
      if (this.state.editedTodo) {
        context.commit('setEditedTodo', null)
        todo.title = todo.title.trim()
        context.commit('setUpdatedFlag', todo)
        if (!todo.title) {
          context.dispatch('removeTodo', todo)
        }
      }
    },
    removeTodo (context, todo) {
      context.commit('deleteTodoItem', todo)
      context.commit('deleteTodoItemFromTodoList', todo)
      context.commit('deleteTodoItemFromActiveList', todo)
      context.dispatch('recalculateTodoLists')
    },
    cancelEdit (context, todo) {
      context.commit('setEditedTodo', null)
      todo.title = this.state.todoEditCache
      context.commit('setTodoEditCache', '')
    },
    setAllComplete (context, setToCompleted) {
      context.commit('setAllCompleted', setToCompleted)
      context.dispatch('recalculateTodoLists')
    },
    toggleCompleted (context, todo) {
      context.commit('toggleCompleted', todo)
      context.dispatch('recalculateTodoLists')
    },
    removeCompleted (context) {
      _.forEach(this.state.activeTodoListCompletedItems, (completedItem) => {
        var todo = _.find(this.state.todoItems, (todoItem) => {
          return todoItem.id === completedItem.id
        })
        context.dispatch('deleteTodoItemIfSaved', todo)
      })
    },
    deleteTodoItemIfSaved (context, todo) {
      if (todo) {
        // Only make delete call to backend if it has been saved at some point
        if (!todo.isNew) {
          context.dispatch('deleteTodoItem', todo)
        } else {
          context.dispatch('removeTodo', todo)
        }
      } else {
        console.log('todo item', todo.title, 'not found!')
      }
    },
    setVisibility (context, visibility) {
      context.commit('setVisibility', visibility)
      context.dispatch('recalculateTodoLists')
    }
  },
  mutations: {
    updateTodoListNames (state, todoListNames) {
      state.todoListNames = todoListNames
      var listNames = []
      _.forEach(todoListNames, listName => {
        listNames.push(listName.name)
      })
      state.listNames = listNames
    },
    addTodoList (state, todoList) {
      var foundTodoList = _.find(state.todoLists, (storedTodoList) => {
        return storedTodoList.id === todoList.id
      })
      if (foundTodoList) {
        console.log('Todo List has already been loaded!')
      } else {
        state.todoLists.push(todoList)
      }
    },
    deleteTodoList (state, todoList) {
      _.remove(state.todoLists, (list) => {
        return list.id === todoList.id
      })
    },
    saveTodoItem (state, todoItem) {
      var index = _.findIndex(state.todoItems, (item) => {
        // Doing by title rather than id because an item may not have a valid id yet
        return item.title === todoItem.title
      })

      if (index !== -1) {
        state.todoItems[index] = {...todoItem, isNew: false, isUpdated: false}
      }
    },
    setActiveTodoListAllItems: (state) => {
      var todoItems = []

      _.forEach(state.activeTodoList.todos, (id) => {
        var item = _.find(state.todoItems, todo => {
          if (todo) {
            return todo.id === id
          }
          return false
        })
        if (item) {
          todoItems.push(item)
        }
      })

      state.activeTodoListAllItems = todoItems
    },
    setActiveTodoListActiveItems: (state) => {
      state.activeTodoListActiveItems = _.filter(state.activeTodoListAllItems, function (todo) {
        if (todo) {
          return !todo.completed
        } else {
          return false
        }
      })
    },
    setActiveTodoListCompletedItems: (state) => {
      state.activeTodoListCompletedItems = _.filter(state.activeTodoListAllItems, (todo) => {
        if (todo) {
          return todo.completed
        } else {
          return false
        }
      })
    },
    setFilteredTodos (state) {
      if (state.visibility === 'all') {
        state.filteredTodos = state.activeTodoListAllItems
      } else if (state.visibility === 'active') {
        state.filteredTodos = state.activeTodoListActiveItems
      } else if (state.visibility === 'completed') {
        state.filteredTodos = state.activeTodoListCompletedItems
      }
    },
    deleteTodoItem (state, todoItem) {
      _.remove(state.todoItems, (todo) => {
        return todo.id === todoItem.id
      })
    },
    deleteTodoItemFromTodoList (state, todoItem) {
      var todoList = _.find(state.todoLists, (todoList) => {
        return todoItem.todo_list_id === todoList.id
      })
      if (todoList) {
        _.remove(todoList.todos, (id) => {
          return id === todoItem.id
        })
      }
    },
    deleteTodoItemFromActiveList (state, todoItem) {
      _.remove(state.activeTodoList.todos, (id) => {
        return id === todoItem.id
      })
    },
    setActiveTodoList (state, todoList) {
      state.activeTodoList = todoList
    },
    setHighestUID (state, highestUID) {
      state.uid = highestUID
    },
    resetNewTodo (state) {
      state.newTodo = ''
    },
    incrementUID (state) {
      state.uid = state.uid + 1
    },
    setExistingTodoItem (state, existingTodoItem) {
      var foundTodoItem = _.find(state.todoItems, {
        'id': existingTodoItem.id
      })

      if (foundTodoItem) {
        foundTodoItem = existingTodoItem
      } else {
        state.todoItems.push(existingTodoItem)
      }
    },
    addNewTodoItem (state, value) {
      state.todoItems.push({
        id: state.uid,
        title: value,
        completed: false,
        isUpdated: false,
        isNew: true
      })
      state.activeTodoList.todos.push(state.uid)
    },
    setNewTodo (state, value) {
      state.newTodo = value
    },
    setVisibility (state, value) {
      state.visibility = value
    },
    setTodoEditCache (state, text) {
      state.todoEditCache = text
    },
    setEditedTodo (state, todo) {
      state.editedTodo = todo
    },
    setAllCompleted (state, setToCompleted) {
      _.forEach(state.activeTodoListAllItems, (activeTodoItem) => {
        var todoItem = _.find(state.todoItems, (todo) => {
          return activeTodoItem.id === todo.id
        })
        if (todoItem) {
          todoItem.completed = setToCompleted
          todoItem.isUpdated = true
        }
      })
    },
    toggleCompleted (state, todo) {
      todo.completed = !todo.completed
      todo.isUpdated = true
    },
    setUpdatedFlag (state, todo) {
      todo.isUpdated = true
    },
    saveState (state) {
      // plugin is recording state
    }
  },
  getters: {
    todoLists: state => state.todoLists,
    todoItems: state => state.todoItems,
    allDone: state => state.allDone,
    uid: state => state.uid,
    newTodo: state => state.newTodo,
    activeTodoList: state => state.activeTodoList,
    visibility: state => state.visibility,
    activeTodoListAllItems: state => state.activeTodoListAllItems,
    activeTodoListActiveItems: state => state.activeTodoListActiveItems,
    activeTodoListCompleteItems: state => state.activeTodoListCompletedItems,
    remaining: state => state.activeTodoListActiveItems.length
  }
})
