<template>
  <div class="forum-list">
    <h2 class="list-title">
      <router-link :to="{ name: 'Category', params: { id: category['.key'] } }">{{
        category.name
      }}</router-link>
    </h2>

    <ForumList :forums="categoryForum" />
  </div>
</template>

<script>
import ForumList from './ForumList';

export default {
  name: 'CategoryListItem',
  components: { ForumList },

  props: {
    category: {
      required: true,
      type: Object
    }
  },

  computed: {
    categoryForum() {
      return Object.values(this.$store.state.forums.items).filter(
        forum => forum.categoryId === this.category['.key']
      );
    }
  }
};
</script>

<style scoped></style>
