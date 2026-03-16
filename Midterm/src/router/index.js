import {createRouter, createWebHashHistory} from 'vue-router'
import LoginView from '../views/login.vue'
import AppLayout from '../components/layout.vue'
import DashboardView from '../views/dashboard.vue'
import ActivitiesView from '../views/activity.vue'
import FriendsView from '../views/friends.vue'
import StatsView from '../views/stats.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: LoginView},
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: 'dashboard', component: DashboardView },
        { path: 'activities', component: ActivitiesView },
        { path: 'friends', component: FriendsView },
        { path: 'stats', component: StatsView },
      ]
    }
  ]
})

export default router