import Vue from 'vue';
import VueRouter from 'vue-router';
// import HomeView from '../views/HomeView.vue';
import ExploreView from '../views/ExploreView.vue';
import LoginView from '../views/LoginView.vue';
import Library from '../views/LibraryView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: ExploreView,
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: () => import('../views/PlaylistView.vue'),
    props: true,
  },
  {
    path: '/album/:id',
    name: 'album',
    component: () => import('../views/AlbumView.vue'),
    props: true,
  },
  {
    path: '/explore',
    name: 'explore',
    component: ExploreView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/library/:id',
    name: 'library',
    component: Library,
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
