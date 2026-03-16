<template>
  <div>
    <AppNavbar />
    <main class="section">
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import AppNavbar from './navbar.vue'
</script>