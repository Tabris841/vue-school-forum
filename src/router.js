import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

import PageHome from './pages/PageHome.vue';
import PageThreadShow from './pages/PageThreadShow';
import PageNotFound from './pages/PageNotFound';
import PageForum from './pages/PageForum';
import PageCategory from './pages/PageCategory';
import PageProfile from './pages/PageProfile';
import PageThreadCreate from './pages/PageThreadCreate';
import PageThreadEdit from './pages/PageThreadEdit';
import PageRegister from './pages/PageRegister';
import PageSignin from './pages/PageSignin';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: PageHome
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: PageCategory,
      props: true
    },
    {
      path: '/thread/create/:forumId',
      name: 'ThreadCreate',
      component: PageThreadCreate,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: PageThreadShow,
      props: true
    },
    {
      path: '/thread/:id/edit',
      name: 'ThreadEdit',
      component: PageThreadEdit,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/forum/:id',
      name: 'Forum',
      component: PageForum,
      props: true
    },
    {
      path: '/me',
      name: 'Profile',
      component: PageProfile,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: PageProfile,
      props: { edit: true },
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: PageRegister,
      meta: { requiresGuest: true }
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: PageSignin,
      meta: { requiresGuest: true }
    },
    {
      path: '/logout',
      name: 'SignOut',
      meta: { requiresAuth: true },
      async beforeEnter(to, from, next) {
        await store.dispatch('signOut');
        next({ name: 'Home' });
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: PageNotFound
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  console.log(`🚦 navigation to ${to.name} from ${from.name}`);

  const user = await store.dispatch('auth/initAuthentication');

  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (user) {
      next();
    } else {
      next({ name: 'SignIn', query: { redirectTo: to.path } });
    }
  } else if (to.matched.some(route => route.meta.requiresGuest)) {
    if (!user) {
      next();
    } else {
      next({ name: 'Home' });
    }
  } else {
    next();
  }
});

export default router;
