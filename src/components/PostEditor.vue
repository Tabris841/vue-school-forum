<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea name="" id="" cols="140" rows="8" class="form-input" v-model="text"></textarea>
    </div>
    <div class="form-actions">
      <button v-if="isUpdate" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn-blue">{{ isUpdate ? 'Update' : 'Submit post' }}</button>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'PostEditor',
  props: {
    threadId: {
      type: String
    },

    post: {
      type: Object,
      validator: obj => {
        const keyIsValid = typeof obj['.key'] === 'string';
        const textIsValid = typeof obj.text === 'string';

        return keyIsValid && textIsValid;
      }
    }
  },

  data() {
    return {
      text: this.post ? this.post.text : ''
    };
  },

  computed: {
    isUpdate() {
      return !!this.post;
    }
  },

  methods: {
    ...mapActions('posts', ['createPost', 'updatePost']),

    async save() {
      const post = await this.persist();

      this.$emit('save', { post });
    },

    cancel() {
      this.$emit('cancel');
    },

    create() {
      const post = {
        text: this.text,
        threadId: this.threadId
      };

      this.text = '';

      return this.createPost(post);
    },

    update() {
      const payload = {
        id: this.post['.key'],
        text: this.text
      };

      return this.updatePost(payload);
    },

    persist() {
      return this.isUpdate ? this.update() : this.create();
    }
  }
};
</script>

<style scoped></style>
