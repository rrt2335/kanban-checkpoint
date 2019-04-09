<template>
  <div class="boards container-fluid">
    <h1 class="mt-4"><b>Welcome to the boards!</b></h1>
    <h3>This application is to help you be more organized and productive. Let's get things done!</h3>
    <router-link to="/login"><button @click="logoutUser" class="btn m-3 btn-warning">
        <i class="fas fa-sign-out-alt"></i> Logout</button></router-link>

    <form @submit.prevent="addBoard">
      <div class="form-group text-left">
        <label>What's the name of your board?</label>
        <input class="form-control shadow" type="text" placeholder="Title..." autofocus="autofocus" v-model="newBoard.title" required>
      </div>
      <div class="form-group text-left">
        <label>What's your board about?</label>
        <input class="form-control shadow" type="text" placeholder="Description..." v-model="newBoard.description"
          required>
      </div>
      <button class="btn btn-success shadow" type="submit"><i class="fas fa-plus"></i> Create board</button>
    </form>

    <div class="board-row m-3 text-right" v-for="board in boards" :key="board._id">
      <router-link class="links" :to="{name: 'board', params: {boardId: board._id}}"><button id="board-button"
          class="btn btn-secondary m-2">{{board.title}} </button></router-link>
      <button @click="toggleEditForm(board._id)" @submit.prevent="editBoard(board._id)"
        class="btn btn-primary m-2 rounded-circle" title="Edit board"><i class="fas fa-pencil-alt"></i></button><button
        class="btn btn-danger rounded-circle shadow m-2" title="Delete board" @click="deleteBoard(board._id)"><i
          class="fas fa-trash-alt"></i></button>

      <!-- Display 'edit board' form -->
      <form v-if="showEditForm == board._id" @submit.prevent="editBoard(board._id)">
        <input type="text" class="form-control-sm" placeholder="Edit board name..." required v-model="editedBoard.title">
        <input type="text" class="form-control-sm" placeholder="Edit board description..." required
          v-model="editedBoard.description">
        <button type="submit" class="btn m-2">Submit</button>
      </form>
    </div>

  </div>
</template>

<script>
  export default {
    name: "boards",
    created() {
      // Blocks users not logged in
      if (!this.$store.state.user._id) {
        this.$router.push({ name: "login" });
      }
    },
    mounted() {
      this.$store.dispatch("getBoards");
    },
    data() {
      return {
        newBoard: {
          title: "",
          description: ""
        },
        editedBoard: {
          title: "",
          description: "",
          boardId: ""
        },
        showEditForm: -1
      };
    },
    computed: {
      boards() {
        return this.$store.state.boards
      },
      currentUser() {
        return this.$store.user
      }
    },
    methods: {
      toggleEditForm(boardId) {
        this.showEditForm == boardId ? this.showEditForm = !boardId : this.showEditForm = boardId
      },
      addBoard() {
        this.$store.dispatch("addBoard", this.newBoard);
        this.newBoard = { title: "", description: "" };
      },
      editBoard(boardId) {
        this.editedBoard.boardId = boardId;
        this.$store.dispatch("editBoard", this.editedBoard);
        this.editedBoard = { title: "", description: "" };
        this.toggleEditForm(boardId)
      },
      deleteBoard(boardId) {
        if (confirm("Are you sure you want to delete this board?")) {
          this.$store.dispatch("deleteBoard", boardId);
        }
      },
      addList() {
        this.$store.dispatch("addList", this.newList);
        this.newList = { title: "", description: "" };
      },
      logoutUser() {
        console.log('trying to logout');
        let user = this.currentUser
        this.$store.dispatch('logout', user)
      }
    }
  };
</script>

<style>
  .links {
    color: #3a8a9a;
  }

  /* Below is to space board buttons to middle of the page. Doesn't quite work for mobile, though */
  .board-row {
    padding-right: 42%;
  }
</style>