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
    filteredTodos: []
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
          context.commit('updateTodoLists', data)
          context.dispatch('setUID', data)
          context.dispatch('getTodoListNames', data)
          // context.dispatch('getAllTodoListItems', data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    createNewTodoList (context, newListName) {
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
    deleteTodoList ({ commit }, todoList) {
      axios.delete(`http://localhost:5000/todo_lists/${todoList.id}`)
        .then(response => {
          if (response.status === 204) {
            // TODO: show success message
            return response
          }
        })
        .then(resp => {
          commit('deleteTodoList', todoList)
        })
        .catch(error => {
          console.log(error)
        })
    },
    saveTodoItem ({ commit }, postMsg) {
      axios.post('http://localhost:5000/todo', postMsg)
        .then(response => {
          if (response.status === 201) {
            return response.data
          }
        })
        .then(data => {
          commit('saveTodoItem', data)
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
    updateTodoItem ({ commit }, todoItemName) {
      var todoItem = _.find(this.state.todoItems, item => {
        return item.name === todoItemName
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
          commit('patchTodoItem', data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteTodoItem ({ commit }, todo) {
      axios.delete(`http://localhost:5000/todo/${todo.id}`)
        .then(response => {
          if (response.status === 204) {
            // TODO: show success message
            return response
          }
        })
        .then(resp => {
          commit('deleteTodoItem', todo)
        })
        .catch(error => {
          console.log(error)
        })
    },
    setActiveTodoList ({ commit }, todoList) {
      commit('setActiveTodoList', todoList)
      commit('setActiveTodoListAllItems')
      commit('setActiveTodoListActiveItems')
      commit('setActiveTodoListCompletedItems')
      commit('setFilteredTodos')
    },
    setExistingTodoItem (context, existingTodoItem) {
      context.commit('setExistingTodoItem', existingTodoItem)
      context.commit('setActiveTodoListAllItems')
      context.commit('setActiveTodoListActiveItems')
      context.commit('setActiveTodoListCompletedItems')
      context.commit('setFilteredTodos')
    },
    addTodoItem (context) {
      var value = context.getters.newTodo && context.getters.newTodo.trim()

      if (!value) {
        return
      }
      context.commit('incrementUID')
      context.commit('addNewTodoItem', value)
      context.commit('setActiveTodoListAllItems')
      context.commit('setActiveTodoListActiveItems')
      context.commit('setActiveTodoListCompletedItems')
      context.commit('setFilteredTodos')
      context.commit('resetNewTodo', value)
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
        }
        if (item.isUpdated) {
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
    }
  },
  mutations: {
    updateTodoLists (state, todoLists) {
      // todoLists = _.map(todoLists, (todoList) => {
      //   return {
      //     id: todoList.id,
      //     name: todoList.name,
      //     todo: todoList.todos,
      //     isLoaded: false
      //   }
      // })
      // state.todoLists = todoLists
    },
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
      state.todoLists.splice(state.todoLists.indexOf(todoList), 1)
    },
    saveTodoItem (state, todoItem) {
      state.todoItems.push(todoItem)
    },
    patchTodoItem (state, todoItem) {
      if (_.includes(state.todoItems, todoItem)) {
        var index = state.todoItems.indexOf(todoItem)
        state.todoItems[index] = {...todoItem, isUpdated: false}
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
    updateTodoItem (state, todoItem) {
    },
    deleteTodoItem (state, todoItem) {
      state.todoItems.splice(state.todoItems.indexOf(todoItem), 1)
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
