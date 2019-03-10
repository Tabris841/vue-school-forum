<template>
  <div class="col-full push-top">
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import CategoryList from '../components/CategoryList';
import { mapActions } from 'vuex';

export default {
  name: 'PageHome',
  components: { CategoryList },

  computed: {
    categories() {
      return Object.values(this.$store.state.categories);
    }
  },

  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },

  async created() {
    const categories = await this.fetchAllCategories();

    categories.forEach(category => this.fetchForums({ ids: Object.keys(category.forums) }));
  }
};
</script>

<style scoped lang="scss"></style>
