<template>
  <div class="col-2">
    <form @submit.prevent="signIn" class="card card-form">
      <h1 class="text-center">Login</h1>

      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="form.email" id="email" type="email" class="form-input" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="form.password" id="password" type="password" class="form-input" />
      </div>

      <div class="push-top">
        <button type="submit" class="btn-blue btn-block">Log in</button>
      </div>

      <div class="form-actions text-right">
        <a href="">Create an account?</a>
      </div>
    </form>

    <div class="text-center push-top">
      <button class="btn-red btn-xsmall" @click="signInWithGoogle">
        <font-awesome-icon class="fa-btn" :icon="['fab', 'google']" />Sign up with Google
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageSignin',
  data() {
    return {
      form: {
        email: null,
        password: null
      }
    };
  },

  methods: {
    async signIn() {
      try {
        this.$store.dispatch('auth/signInWithEmailAndPassword', {
          email: this.form.email,
          password: this.form.password
        });

        this.successRedirect();
      } catch (e) {
        alert('⚠' + e.message);
      }
    },

    async signInWithGoogle() {
      try {
        await this.$store.dispatch('auth/signInWithGoogle');

        this.$router.push('/');
      } catch (e) {
        alert('⚠' + e.message);
      }
    },

    successRedirect() {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' };
      this.$router.push(redirectTo);
    }
  },

  created() {
    this.$emit('ready');
  }
};
</script>

<style scoped></style>
