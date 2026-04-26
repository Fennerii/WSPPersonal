<template>
  <nav class="navbar is-dark" role="navigation">
    <div class="navbar-brand">
      <span class="navbar-item has-text-weight-bold has-text-primary is-size-4">
        HeavyLifting
      </span>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <RouterLink to="/dashboard" class="navbar-item">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-home"></i></span>
            <span>Dashboard</span>
          </span>
        </RouterLink>
        <RouterLink to="/activities" class="navbar-item">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-running"></i></span>
            <span>Activities</span>
          </span>
        </RouterLink>
        <RouterLink to="/stats" class="navbar-item">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-chart-bar"></i></span>
            <span>Stats</span>
          </span>
        </RouterLink>
        <RouterLink to="/friends" class="navbar-item">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-users"></i></span>
            <span>Friends</span>
          </span>
        </RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin" class="navbar-item">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-cog"></i></span>
            <span>Admin</span>
          </span>
        </RouterLink>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <span class="icon-text has-text-grey-light">
            <figure class="image is-64x128">
              <img class="is-square" :src="authStore.currentUser?.photo" />
            </figure>
            <span>{{ authStore.currentUser?.name }}</span>
          </span>
        </div>
        <div class="navbar-item">
          <button class="button is-danger is-light is-small" @click="logout">
            <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar, .navbar-item {
  font-family: 'Noto';
}
</style>