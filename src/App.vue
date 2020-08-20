<template>
  <div id="app">
    <!-- <home /> -->
    <component :is="selectedComponent" />
  </div>
</template>

<script>
import Home from './views/Home.vue';
import Auth from './components/auth/Auth.vue';
import {mapGetters} from 'vuex';

export default {
  components: {
    home: Home,
    auth: Auth
  },
  computed: {
    ...mapGetters({
      user: 'getUser'
    }),
    selectedComponent() {
      if(this.user) {
        return "home";
      } else {
        return "auth";
      }
    }
  }
}
</script>
