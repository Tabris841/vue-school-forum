<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CategoryList from '../components/CategoryList';
import asyncDataStatus from '../mixins/asyncDataStatus';

export default {
  name: 'PageHome',
  components: { CategoryList },

  mixins: [asyncDataStatus],

  computed: {
    categories() {
      return Object.values(this.$store.state.categories.items);
    }
  },

  methods: {
    ...mapActions('categories', ['fetchAllCategories']),
    ...mapActions('forums', ['fetchForums'])
  },

  async created() {
    const categories = await this.fetchAllCategories();

    await Promise.all(
      categories.map(category => this.fetchForums({ ids: Object.keys(category.forums) }))
    );

    this.asyncDataStatus_fetched();
  }
};
</script>

<style scoped lang="scss"></style>
