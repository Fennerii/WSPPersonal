<template>
  <div>
    <div class="columns is-vcentered mb-5">
      <div class="column is-narrow">
        <figure class="image is-64x64">
          <img class="is-square" :src="authStore.currentUser?.photo" />
        </figure>
      </div>
      <div class="column">
        <h1 class="title">Welcome, {{ authStore.currentUser?.name }}</h1>
        <p class="subtitle has-text-grey">{{ authStore.currentUser?.role }}</p>
      </div>
    </div>

    <div class="columns mb-5">
      <div class="column">
        <div class="box has-text-centered">
          <p class="heading">Sessions</p>
          <p class="title">{{ userActivities.length }}</p>
        </div>
      </div>
      <div class="column">
        <div class="box has-text-centered">
          <p class="heading">Minutes</p>
          <p class="title">{{ totalMinutes }}</p>
        </div>
      </div>
      <div class="column">
        <div class="box has-text-centered">
          <p class="heading">Calories</p>
          <p class="title">{{ totalCalories }}</p>
        </div>
      </div>
    </div>

    <h2 class="title is-4">Recent Activities</h2>

    <div v-if="userActivities.length === 0" class="box has-text-grey">
      No activities yet.
    </div>

    <div v-for="activity in userActivities" :key="activity.id" class="box mb-2">
      <div class="columns is-vcentered">
        <div class="column">
          <p class="has-text-weight-bold">{{ activity.name }}</p>
          <p class="has-text-grey is-size-7">{{ activity.type }} · {{ activity.date }}</p>
        </div>
        <div class="column is-narrow">
          <span class="tag is-primary is-light mr-2">{{ activity.duration }} mins</span>
          <span class="tag is-warning is-light">{{ activity.calories }} kcal</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useActivitiesStore } from '../stores/activities'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const userActivities = computed(() =>
  activitiesStore.getActivitiesByUser(authStore.currentUser!.id)
)

// just summing up for the stat cards
const totalMinutes = computed(() => userActivities.value.reduce((sum, a) => sum + a.duration, 0))
const totalCalories = computed(() => userActivities.value.reduce((sum, a) => sum + a.calories, 0))
</script>