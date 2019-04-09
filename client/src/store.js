import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

Vue.use(Vuex)

// Allows axios to work locally or live
let base = window.location.host.includes('localhost:8080') ? '//localhost:3000' : '/'

let auth = Axios.create({
  baseURL: base + "auth/",
  timeout: 3000,
  withCredentials: true
})

let api = Axios.create({
  baseURL: base + "api/",
  timeout: 3000,
  withCredentials: true
})

export default new Vuex.Store({
  state: {
    user: {},
    boards: [],
    lists: [],
    tasks: {},
    note: [],
    activeBoard: {}
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setBoards(state, boards) {
      state.boards = boards
    },
    setLists(state, lists) {
      state.lists = lists
    },
    setTasks(state, data) {
      //state.tasks[data.listId] = data.tasks
      Vue.set(state.tasks, data.listId, data.tasks)
    }
  },
  actions: {
    //#region -- AUTH STUFF --
    register({ commit, dispatch }, newUser) {
      auth.post('register', newUser)
        .then(res => {
          commit('setUser', res.data)
          router.push({ name: 'boards' })
        })
    },
    authenticate({ commit, dispatch }) {
      auth.get('authenticate')
        .then(res => {
          commit('setUser', res.data)
          router.push({ name: 'boards' })
        })
        .catch(res => {
          router.push({ name: 'login' })
        })
    },
    login({ commit, dispatch }, creds) {
      auth.post('login', creds)
        .then(res => {
          commit('setUser', res.data)
          router.push({ name: 'boards' })
        })
    },
    logout({ commit, dispatch }, creds) {
      auth.delete('logout', creds)
        .then(res => {
          commit('setUser', {})
          router.push({ name: 'login' })
        })
    },
    //#endregion


    //#region -- BOARDS --
    getBoards({ commit, dispatch }) {
      api.get('boards')
        .then(res => {
          res.data.forEach(b=> b.createdAt= new Date(b.createdAt))
          res.data.sort((a,b)=>{
            return b.createdAt - a.createdAt
          })
          commit('setBoards', res.data)
        })
    },
    addBoard({ commit, dispatch }, boardData) {
      api.post('boards', boardData)
        .then(serverBoard => {
          dispatch('getBoards')
        })
    }, 
    editBoard({ commit, dispatch }, boardData) {
      api.put('boards/' + boardData.boardId, boardData)
        .then(res => {
          dispatch('getBoards')
        })
    },
    deleteBoard({ commit, dispatch }, boardId) {
      api.delete('boards/' + boardId)
        .then(res => {
          dispatch('getBoards')
        })
    },
    //#endregion


    //#region -- LISTS --
    getLists({ commit, dispatch }, boardId) {
      api.get('lists/' + boardId)
        .then(res => {
          res.data.forEach(b=> b.createdAt= new Date(b.createdAt))
          res.data.sort((a,b)=>{
            return b.createdAt - a.createdAt
          })
          commit('setLists', res.data)
        })
    },
    addList({ commit, dispatch }, listData) {
      api.post('lists', listData)
        .then(serverList => {
          dispatch('getLists', listData.boardId)
        })
    },
    deleteList({ commit, dispatch }, listData) {
      api.delete('lists/' + listData.listId)
        .then(res => {
          dispatch('getLists', listData.boardId)
        })
    },

    //#endregion

    // #startregion -- TASKS --
    // TODO getTasks
    //then commit the tasks to the state and in that commit you will create a dictionary
    getTasks({ commit, dispatch }, listId) {
      api.get('tasks/' + listId)
        .then(res => {
          //response is tasks for the listId
          commit('setTasks', { listId, tasks: res.data })
        })
    },
    addTask({ commit, dispatch }, taskData) {
      api.post('tasks', taskData)
        .then(serverList => {
          dispatch('getTasks', taskData.listId)
        })
    },
    deleteTask({ commit, dispatch }, taskData) {
      api.delete('tasks/' + taskData.taskId)
        .then(res => {
          dispatch('getTasks', taskData.listId)
        })
    },
    moveTask({commit, dispatch},taskData){
      api.put('tasks/'+ taskData._id, taskData)
        .then(res=>{
          dispatch('getTasks', taskData.listId)
          dispatch('getTasks', taskData.oldListId)
        })
    },
    // COMMENTS
    // addComment({ commit, dispatch }, payload) {
    //   debugger
    //   api.put('tasks/' + payload.taskId, payload.comment)
    //     .then(serverList => {
    //       dispatch('getTasks', taskData.listId)
    //     })
    // },
    modifyComment({ commit, dispatch }, taskData) {
      api.put('tasks/' + taskData._id, taskData)
        .then(serverTask => {
          dispatch('getTasks', taskData.listId)
        })
    }

    // #endregion
  }
})
