<template>
  <div class="task">
    <div class="row d-flex justify-content-center m-3">
      <div class="card-body task-card rounded">
        <h4>{{taskData.description}}</h4>
        <p>{{taskData.createdAt | formatTime}}</p>
        <button @click="showForm=!showForm" class="btn btn-success m-1 shadow"><i class="fas fa-plus"></i> Add
          comment</button>
        <form v-if="showForm" @submit.prevent="addComment">
          <input type="text" class="form-control-sm" placeholder="Write a comment..." required
            v-model="newComment.description">
          <button type="submit" class="btn m-2">Submit</button>
        </form>
        <ul>
          <!-- Need v-for comment in taskData.comments -->
          <li v-for="(comment, index) in taskData.comments" class="text-left">{{comment.description}}
            <button class="btn btn-primary m-1 shadow rounded-circle" title="Edit comment"
              @click="toggleEditForm(index)"><i class="fas fa-pencil-alt"></i></button>
            <button class="btn btn-danger shadow m-1 rounded-circle" title="Delete comment"
              @click="deleteComment(index)"><i class="fas fa-trash-alt"></i></button>

            <!-- Display 'edit comment' form -->
            <form v-if="showEditForm == index" @submit.prevent="editComment(index)">
              <input type="text" class="form-control-sm" placeholder="Edit comment..." required
                v-model="newComment.description">
              <button type="submit" class="btn m-2">Submit</button>
            </form>
          </li>
        </ul>
      </div>
    </div>

    <!-- Move-to dropdown menu -->
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        Move task to...
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a v-for="list in lists" @click="moveTask(list._id)" class="dropdown-item" href="#">{{list.title}}</a>
      </div>
    </div>

    <button @click="deleteTask(taskData._id)" class="btn btn-danger m-3"><i class="fas fa-trash-alt"></i> Delete
      task</button>
  </div>
</template>

<script>
  import Moment from 'moment'
  export default {
    name: 'Task',
    props: ['taskData'],
    mounted() {
    },
    data() {
      return {
        showForm: false,
        showEditForm: -1,
        newComment: {
          description: ''
        }
      }
    },
    computed: {
      tasks() {
        return this.$store.state.tasks;
      },
      lists() {
        return this.$store.state.lists;
      }
    },
    methods: {
      toggleEditForm(index) {
        this.showEditForm == index ? this.showEditForm = -1 : this.showEditForm = index
      },
      addComment() {
        this.taskData.comments.push(this.newComment)
        this.$store.dispatch("modifyComment", this.taskData);
        this.newComment = { description: "" };
      },
      editComment(index) {
        this.taskData.comments.splice(index, 1, this.newComment)
        this.$store.dispatch("modifyComment", this.taskData);
        this.newComment = { description: "" };
        this.toggleEditForm(index)
      },
      deleteComment(index) {
        if (confirm("Are you sure you want to delete this comment?")) {
          this.taskData.comments.splice(index, 1)
          this.$store.dispatch("modifyComment", this.taskData);
        }
      },
      deleteTask(taskId) {
        if (confirm("Are you sure you want to delete this task?")) {
          this.$store.dispatch("deleteTask", { taskId: taskId, listId: this.taskData.listId });
        }
      },
      moveTask(newListId) {
        console.log(newListId)
        //save the currentId as old id
        this.taskData.oldListId = this.taskData.listId
        //set the newId to the currentId
        this.taskData.listId = newListId
        this.$store.dispatch('moveTask', this.taskData)
      }
    },
    components: {
    },
    filters: {
      formatTime(date) {
        return Moment(String(date)).format('MM/DD/YYYY, LT')
      }
    }
  }

</script>

<style scoped>
  .task {
    background-color: white;
    color: rgb(128, 85, 128);
  }
</style>