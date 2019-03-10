<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', id: this.id }"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By
      <a href="#" class="link-unstyled">{{ user.name }}</a
      >,
      <AppDate :timestamp="thread.publishedAt" />
      <span style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small">
        {{ repliesCount }} replies by {{ contributorsCount }} contributors
      </span>
    </p>
    <PostList :posts="posts" />
    <PostEditor v-if="authUser" :threadId="id" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to="{ name: 'SignIn', query: { redirectTo: $route.path } }"
        >Sign In</router-link
      >
      <router-link :to="{ name: 'Register' }">Register</router-link> to post a reply.
    </div>
  </div>
</template>

<script>
import PostList from '../components/PostList';
import PostEditor from '../components/PostEditor';
import { countObjectProperties } from '../utils';
import { mapActions, mapGetters } from 'vuex';
import asyncDataStatus from '../mixins/asyncDataStatus';

export default {
  name: 'PageThreadShow',
  components: {
    PostList,
    PostEditor
  },

  mixins: [asyncDataStatus],

  props: {
    id: {
      required: true,
      type: String
    }
  },

  computed: {
    ...mapGetters({ authUser: 'auth/authUser' }),
    thread() {
      return this.$store.state.threads.items[this.id];
    },

    repliesCount() {
      return this.$store.getters['threads/threadRepliesCount'](this.thread['.key']);
    },

    user() {
      return this.$store.state.users.items[this.thread.userId];
    },

    contributorsCount() {
      return countObjectProperties(this.thread.contributors);
    },

    posts() {
      const postIds = Object.values(this.thread.posts);

      return Object.values(this.$store.state.posts.items).filter(post =>
        postIds.includes(post['.key'])
      );
    }
  },

  methods: {
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('users', ['fetchUser']),
    ...mapActions('posts', ['fetchPosts'])
  },

  async created() {
    const thread = await this.fetchThread({ id: this.id });

    this.fetchUser({ id: thread.userId });

    const posts = await this.fetchPosts({ ids: Object.keys(thread.posts) });

    await Promise.all(
      posts.map(async post => {
        this.fetchUser({ id: post.userId });
      })
    );

    this.asyncDataStatus_fetched();
  }
};
</script>

<style scoped></style>
