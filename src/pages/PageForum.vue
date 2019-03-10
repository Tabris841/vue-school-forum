<template>
  <div v-if="asyncDataStatus_ready" class="forum-wrapper">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
        :to="{ name: 'ThreadCreate', params: { forumId: this.forum['.key'] } }"
        class="btn-green btn-small"
      >
        Start Thread
      </router-link>
    </div>
    <div class="col-full push-top"><ThreadList :threads="threads" /></div>
  </div>
</template>

<script>
import ThreadList from '../components/ThreadList';
import { mapActions } from 'vuex';
import asyncDataStatus from '../mixins/asyncDataStatus';

export default {
  name: 'PageForum',

  components: {
    ThreadList
  },

  mixins: [asyncDataStatus],

  props: {
    id: {
      required: true,
      type: String
    }
  },

  computed: {
    forum() {
      return this.$store.state.forums.items[this.id];
    },

    threads() {
      return Object.values(this.$store.state.threads.items).filter(
        thread => thread.forumId === this.id
      );
    }
  },

  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreads']),
    ...mapActions('users', ['fetchUser'])
  },

  async created() {
    const forum = await this.fetchForum({ id: this.id });
    const threads = await this.fetchThreads({ ids: forum.threads });

    await Promise.all(threads.map(thread => this.fetchUser({ id: thread.userId })));

    this.asyncDataStatus_fetched();
  }
};
</script>

<style scoped>
.forum-wrapper {
  width: 100%;
}
</style>
