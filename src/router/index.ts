import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import SearchPage from '@/views/SearchPage.vue'; // Make sure this import is correct

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/profile', component: ProfilePage },
  { path: '/search', component: SearchPage, name: 'SearchPage' } // Ensure this route is defined
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
