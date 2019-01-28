import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

export const store = new Vuex.Store({
  state: {
    todoLists: [],
    todoItems: [],
    allDone: false,
    activeTodoList: {}
  },
  actions: {
    updateTodoLists ({ commit }) {
      axios.get('http://localhost:5000/todo_lists')
        .then(response => {
          if (response.status === 200) {
            return response.data
          }
        })
        .then(data => {
          commit('updateTodoLists', data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    createNewTodoList ({ commit }, newListName) {
      axios.post('http://localhost:5000/todo_lists', {
        name: newListName
      })
        .then(response => {
          if (response.status === 201) {
            return response.data
          }
        })
        .then(data => {
          commit('addTodoList', data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTodoList ({ commit }, todoListName) {
      var id = this.state.todoLists.find(list => {
        return list.name === todoListName
      }).id

      axios.get(`http://localhost:5000/todo_lists/${id}`)
        .then(response => {
          if (response.status === 200) {
            return response.data
          }
        })
        .then(data => {
          commit('addTodoList', data)
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
    saveTodoItem ({ commit }, todoItemTitle, todoListId) {
      axios.post('http://localhost:5000/todo', {
        title: todoItemTitle,
        todo_list_id: todoListId
      })
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
    getTodoItem ({ commit }, todoItemName) {
      // TODO: check for list id?
      var id = this.state.todoLists.find(list => {
        return list.name === todoItemName
      }).id

      axios.get(`http://localhost:5000/todo/${id}`)
        .then(response => {
          if (response.status === 200) {
            return response.data
          }
        })
        .then(data => {
          commit('addTodoItem', data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateTodoItem ({ commit }, todoItemName) {
      var todoItem = this.state.todoItems.find(list => {
        return list.name === todoItem
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
          commit('updateTodoItem', data)
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
    }
  },
  mutations: {
    updateTodoLists (state, todoLists) {
      state.todoLists = todoLists
    },
    addTodoList (state, todoList) {
      state.todoLists.push(todoList)
    },
    deleteTodoList (state, todoList) {
      state.todoLists.splice(state.todoLists.indexOf(todoList), 1)
    },
    saveTodoItem (state, todoItem) {
      state.todoItems.splice(state.todoLists.indexOf(todoItem), 1)
    },
    addTodoItem (state, todoItem) {
    },
    updateTodoItem (state, todoItem) {
    },
    deleteTodoItem (state, todoItem) {
      state.todoItems.splice(state.todoItems.indexOf(todoItem), 1)
    },
    setActiveTodoList (state, todoList) {
      state.activeTodoList = todoList
    }
  },
  getters: {
    todoLists: state => state.todoLists,
    todoItems: state => state.todoItems,
    allDone: state => state.allDone
  }
})
