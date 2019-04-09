<template>
  <div class="board container-fluid">

    <router-link to="/"><button class="go-back btn m-3 btn-primary shadow rounded-circle" title="Go back">
        <i class="fas fa-arrow-left"></i></button></router-link>
    <router-link to="/login"><button @click="logoutUser" class="btn m-3 btn-warning shadow">
        Logout <i class="fas fa-sign-out-alt"></i></button></router-link>
    <h1>{{board.title}}</h1>
    <h3>{{board.description}}</h3>
    <p>Created on {{board.createdAt | formatTime}} ~ Updated on {{board.updatedAt | formatTime}}</p>

    <form @submit.prevent="addList">
      <div class="form-group d-flex justify-content-center">
        <input class="form-control-lg shadow" type="text" placeholder="Add a list..." autofocus="autofocus" v-model="newList.title" required>
      </div>
      <button class="btn btn-success m-2" type="submit"><i class="fas fa-plus"></i> Create list</button>
    </form>

    <div class="row d-flex justify-content-center">
      <list v-for="list in lists" :listData="list" class="list col-md-3 card m-4 d-flex justify-content-center">

      </list>
    </div>

  </div>
</template>

<script>
  import Moment from 'moment'
  import List from '@/components/List.vue'
  export default {
    name: "board",
    props: ["boardId"],
    mounted() {
      this.$store.dispatch("getLists", this.boardId);
      //*getTasks TODO
    },
    data() {
      return {
        newList: {
          title: "",
          boardId: this.boardId
        },
        newTask: {
          title: ""
        }
      };
    },
    computed: {
      board() {
        return this.$store.state.boards.find(b => b._id == this.boardId) || { title: 'Loading...' }
      },
      lists() {
        return this.$store.state.lists;
      },
    },
    methods: {
      addList() {
        this.$store.dispatch("addList", this.newList);
        this.newList = { title: "", boardId: this.boardId };
      },
      logoutUser() {
        console.log('trying to logout');
        let user = this.currentUser
        this.$store.dispatch('logout', user)
      },
      deleteNote() {
        if (confirm("Are you sure you want to delete this note?")) {
          this.$store.dispatch("deleteNote", boardId);
        }
      },
      deleteTask() {
        confirm("Are you sure you want to delete this task?")
      }
    },
    components: {
      List
    },
    filters: {
      formatTime(date) {
        return Moment(String(date)).format('MM/DD/YYYY, LT')
      }
    }
  };
</script>

<style>
  .card {
    color: #3a8a9a;
    width: 75%;
    background-color: #fcfff8;
  }

  .list,
  .task {
    box-shadow: 0 2px 5px black;
    border-radius: 20px;
  }

  i {
    cursor: pointer;
  }
</style>