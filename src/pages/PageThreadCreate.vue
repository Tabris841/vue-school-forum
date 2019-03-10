<template>
  <div v-if="asyncDataStatus_ready" class="col-full">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor ref="editor" @save="save" @cancel="cancel" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ThreadEditor from '../components/ThreadEditor';
import asyncDataStatus from '../mixins/asyncDataStatus';

export default {
  name: 'PageThreadCreate',
  components: { ThreadEditor },

  mixins: [asyncDataStatus],

  props: {
    forumId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      saved: false
    };
  },

  computed: {
    forum() {
      return this.$store.state.forums.items[this.forumId];
    },

    hasUnsavedChanges() {
      const editor = this.$refs.editor;

      return (editor.form.title || editor.form.text) && !this.saved;
    }
  },

  methods: {
    ...mapActions(['createThread', 'fetchForum']),
    async save({ title, text }) {
      const thread = await this.createThread({
        forumId: this.forum['.key'],
        title,
        text
      });

      this.saved = true;
      this.$router.push({ name: 'ThreadShow', params: { id: thread['.key'] } });
    },

    cancel() {
      this.$router.push({ name: 'Forum', params: { id: this.forum['.key'] } });
    }
  },

  async created() {
    await this.fetchForum({ id: this.forumId });
    this.asyncDataStatus_fetched();
  },

  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirm = window.confirm(
        'Are you sure you want to leave? Unsaved changes will be lost.'
      );

      if (confirm) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  }
};
</script>

<style scoped></style>
