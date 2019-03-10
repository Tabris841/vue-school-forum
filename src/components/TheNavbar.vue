<template>
  <header class="header" id="header">
    <router-link :to="{ name: 'Home' }" class="logo">
      <img src="../assets/img/vueschool-logo.svg" />
    </router-link>

    <nav class="navbar">
      <ul v-if="user">
        <li class="navbar-user">
          <a @click.prevent="userDropdownOpen = !userDropdownOpen">
            <img class="avatar-small" :src="user.avatar" />
            <span>
              {{ user.name }}
              <img class="icon-profile" src="../assets/img/arrow-profile.svg" alt="" />
            </span>
          </a>

          <div id="user-dropdown" :class="{ 'active-drop': userDropdownOpen }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link :to="{ name: 'Profile' }">
                  View Profile
                </router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="$store.dispatch('auth/signOut')">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <ul v-else>
        <li class="navbar-item">
          <router-link :to="{ name: 'SignIn' }">Sign In</router-link>
        </li>
        <li class="navbar-item">
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TheNavbar',
  data() {
    return {
      userDropdownOpen: false
    };
  },

  computed: {
    ...mapGetters({
      user: 'auth/authUser'
    })
  }
};
</script>

<style scoped></style>
