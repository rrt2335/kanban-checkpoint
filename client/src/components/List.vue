<template>
  <div class="list">
    <div class="card-body rounded">
      <h2>{{listData.title}}</h2>
      <p>{{listData.createdAt | formatTime}}</p>
      <button @click="toggleForm(listData._id)" class="btn btn-success m-2 shadow"><i class="fas fa-plus"></i> Add
        task</button>
      <form v-if="showForm == listData._id" @submit.prevent="addTask">
        <input placeholder="What is your task?" v-model="newTask.description" autofocus="autofocus" class="form-control" required>
        <button type="submit" class="btn m-2">Submit</button>
      </form>
      <task v-for="task in tasks" :taskData="task"></task>
    </div>
    <button @click="deleteList(listData._id)" class="btn btn-danger m-3"><i class="fas fa-trash-alt"></i> Delete
      list</button>
  </div>
</template>

<script>
  import Moment from 'moment'
  import Task from '@/components/Task.vue'
  export default {
    name: 'List',
    props: ['listData'],
    mounted() {
      this.$store.dispatch("getTasks", this.listData._id);
    },
    data() {
      return {
        newTask: {
          description: "",
          boardId: this.listData.boardId,
          listId: this.listData._id
        },
        showForm: -1
      };
    },
    computed: {
      lists() {
        return this.$store.state.lists;
      },
      tasks() {
        return this.$store.state.tasks[this.listData._id]
      }
    },
    methods: {
      toggleForm(listId) {
        this.showForm == listId ? this.showForm = !listId : this.showForm = listId
      },
      addTask(listId) {
        console.log(this.newTask)
        this.$store.dispatch("addTask", this.newTask);
        this.newTask = { description: "", boardId: this.listData.boardId, listId: this.listData._id };
        this.toggleForm(listId)
      },
      deleteList(listId) {
        if (confirm("Are you sure you want to delete this list? This will also delete all the tasks within it.")) {
          this.$store.dispatch("deleteList", { listId: listId, boardId: this.listData.boardId });
        }
      }
    },
    components: {
      Task
    },
    filters: {
      formatTime(date) {
        return Moment(String(date)).format('MM/DD/YYYY, LT')
      }
    }
  }
</script>

<style scoped>
</style>