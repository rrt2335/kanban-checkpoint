<template>
  <div id="app">
    <nav>
      <p>{{time}}</p>
      <h4><img id="nav-icon" src="icon.png">Kanban Checkpoint!</h4>
    </nav>
    <router-view />
  </div>
</template>

<script>
  import Moment from 'moment'
  export default {
    name: 'App',
    data() {
      return {
        time: ''
      }
    },
    mounted() {
      // Authenticate on startup
      this.$store.dispatch('authenticate')
      this.formatTime()
    },
    methods: {
      formatTime() {
        let date = new Date()
        this.time = Moment(String(date)).format('MMMM Do YYYY, h:mm:ss a')
        setTimeout(this.formatTime, 1000)
      }
    }
  }
</script>

<style>
  body {
    background-image: url(https://i.pinimg.com/originals/8b/b8/b7/8bb8b79022645b41fda832d29bf7a128.jpg);
    background-position: center;
    background-attachment: fixed;
  }

  #app {
    font-family: 'Varela Round', sans-serif;
    ;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #3a8a9a;
  }

  nav {
    color: white;
    text-shadow: 0 1px 0 black;
    background-color: #3a8a9a;
    box-shadow: 0 0 10px black;
    padding-top: 10px;
  }

  #board-button {
    background-color: #3a8a9a;
    color: white;
  }

  #nav-icon {
    height: 50px;
    width: 50px;
    margin: 10px;
  }
</style>