import Vue from 'vue';
import firebase from 'firebase';
import Vuelidate from 'vuelidate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import VueProgressBar from 'vue-progressbar';
import App from './App.vue';
import router from './router';
import store from './store';

import AppDate from './components/AppDate';

library.add(faUserCircle, faEdit, faGoogle);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.component('AppDate', AppDate);

Vue.config.productionTip = false;

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID
};

console.log(config);

firebase.initializeApp(config);

const options = {
  color: '#57ad8d',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  position: 'relative',
  autoRevert: true,
  location: 'top',
  inverse: false
};

Vue.use(VueProgressBar, options);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
