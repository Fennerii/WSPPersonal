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

        <RouterLink to="/friends" class="navbar-item">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-users"></i></span>
            <span>Friends</span>
          </span>
        </RouterLink>

        <RouterLink to="/stats" class="navbar-item">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-chart-bar"></i></span>
            <span>Stats</span>
          </span>
        </RouterLink>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <span class="icon-text has-text-grey-light">
            <span class="icon"><i class="fas fa-user-circle"></i></span>
            <span>Main</span>
          </span>
        </div>
        <div class="navbar-item">
          <button class="button is-danger is-light is-small">
            <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
            <RouterLink to="/login">
            <span>Sign out</span>
            </RouterLink>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar , .navbar-item, .navbar-item{
    font-family: 'Noto';
}
</style>
<script setup>
</script>