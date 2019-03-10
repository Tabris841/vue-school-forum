import firebase from 'firebase';

export default {
  namespaced: true,

  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },

  getters: {
    authUser(state, getters, rootState) {
      return state.authId ? rootState.users.items[state.authId] : null;
    }
  },

  actions: {
    initAuthentication({ dispatch, commit, state }) {
      return new Promise(resolve => {
        if (state.unsubscribeAuthObserver) {
          state.unsubscribeAuthObserver();
        }

        const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
          if (user) {
            const dbUser = await dispatch('fetchAuthUser');
            resolve(dbUser);
          } else {
            resolve(null);
          }
        });

        commit('setUnsubscribeAuthObserver', unsubscribe);
      });
    },

    async registerUserWithEmailAndPassword(
      { dispatch },
      { email, name, username, password, avatar = null }
    ) {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const id = firebase.auth().currentUser.uid;

      await dispatch(
        'users/createUser',
        { id, email, name, username, password, avatar },
        { root: true }
      );
      dispatch('fetchAuthUser');
    },

    signInWithEmailAndPassword(context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    },

    async signInWithGoogle({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider();
      const { user } = await firebase.auth().signInWithPopup(provider);

      firebase
        .database()
        .ref('users')
        .child(user.uid)
        .once('value', async snapshot => {
          if (!snapshot.exists()) {
            await dispatch(
              'users/createUser',
              {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                username: user.email,
                avatar: user.photoURL
              },
              { root: true }
            );
            dispatch('fetchAuthUser');
          }
        });
    },

    async signOut({ commit }) {
      await firebase.auth().signOut();

      commit('setAuthId', null);
    },

    async fetchAuthUser({ dispatch, commit }) {
      const userId = firebase.auth().currentUser.uid;

      return new Promise(resolve => {
        firebase
          .database()
          .ref('users')
          .child(userId)
          .once('value', async snapshot => {
            if (snapshot.exists()) {
              const user = await dispatch('users/fetchUser', { id: userId }, { root: true });

              commit('setAuthId', userId);
              resolve(user);
            } else {
              resolve(null);
            }
          });
      });
    }
  },

  mutations: {
    setAuthId(state, id) {
      state.authId = id;
    },

    setUnsubscribeAuthObserver(state, unsubscribe) {
      state.unsubscribe = unsubscribe;
    }
  }
};
