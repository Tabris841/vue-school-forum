<template>
  <div id="app">
    <TheNavbar />
    <vue-progress-bar></vue-progress-bar>
    <div class="container">
      <router-view :key="$route.path" v-show="showPage" @ready="pageReady" />
      <AppSpinner v-show="!showPage" />
    </div>
  </div>
</template>

<script>
import TheNavbar from './components/TheNavbar';
import AppSpinner from './components/AppSpinner';

export default {
  components: { AppSpinner, TheNavbar },

  data() {
    return {
      showPage: false
    };
  },

  methods: {
    pageReady() {
      this.showPage = true;
      this.$Progress.finish();
    }
  },

  created() {
    this.$Progress.start();

    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start();
      this.showPage = false;
      next();
    });
  }
};
</script>

<style lang="scss">
@import 'assets/style';
</style>
