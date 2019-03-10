import firebase from 'firebase';
import Vue from 'vue';

export default {
  namespaced: true,

  state: {
    items: {}
  },

  getters: {},

  actions: {
    async createPost({ commit, state, rootState }, post) {
      const postId = firebase
        .database()
        .ref('posts')
        .push().key;

      post.userId = rootState.auth.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);

      const updates = {};
      updates[`posts/${postId}`] = post;
      updates[`threads/${post.threadId}/posts/${postId}`] = postId;
      updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId;
      updates[`users/${post.userId}/posts/${postId}`] = postId;

      await firebase
        .database()
        .ref()
        .update(updates);

      commit('setItem', { resource: 'posts', item: post, id: postId }, { root: true });
      commit(
        'threads/appendPostToThread',
        { parentId: post.threadId, childId: postId },
        { root: true }
      );
      commit(
        'threads/appendContributorToThread',
        { parentId: post.threadId, childId: post.userId },
        { root: true }
      );
      commit('users/appendPostToUser', { parentId: post.userId, childId: postId }, { root: true });

      return Promise.resolve(state.items[postId]);
    },

    updatePost({ state, commit, rootState }, { id, text }) {
      return new Promise(async resolve => {
        const post = state.items[id];
        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: rootState.auth.authId
        };
        const updates = { text, edited };

        await firebase
          .database()
          .ref('posts')
          .child(id)
          .update(updates);

        commit('setPost', {
          postId: id,
          post: { ...post, text, edited }
        });

        resolve(post);
      });
    },

    fetchPost: ({ dispatch }, { id }) =>
      dispatch('fetchItem', { resource: 'posts', id, emoji: '💬' }, { root: true }),

    fetchPosts: ({ dispatch }, { ids }) =>
      dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' }, { root: true })
  },

  mutations: {
    setPost(state, { post, postId }) {
      Vue.set(state.posts, postId, post);
    }
  }
};
