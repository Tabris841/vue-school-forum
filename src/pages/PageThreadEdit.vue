<template>
  <div v-if="asyncDataStatus_ready" class="col-full">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor :text="text" :title="thread.title" @save="save" @cancel="cancel" />
  </div>
</template>

<script>
import ThreadEditor from '../components/ThreadEditor';
import { mapActions } from 'vuex';
import asyncDataStatus from '../mixins/asyncDataStatus';

export default {
  name: 'PageThreadEdit',
  components: { ThreadEditor },

  mixins: [asyncDataStatus],

  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    thread() {
      return this.$store.state.threads.items[this.id];
    },

    text() {
      const post = this.$store.state.posts.items[this.thread.firstPostId];

      return post ? post.text : null;
    }
  },

  methods: {
    ...mapActions('threads', ['updateThread', 'fetchThread']),
    ...mapActions('posts', ['fetchPost']),

    async save({ title, text }) {
      await this.updateThread({
        id: this.id,
        title,
        text
      });

      this.$router.push({ name: 'ThreadShow', params: { id: this.id } });
    },

    cancel() {
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } });
    }
  },

  async created() {
    const thread = await this.fetchThread({ id: this.id });

    await this.fetchPost({ id: thread.firstPostId });

    this.asyncDataStatus_fetched();
  }
};
</script>

<style scoped></style>
