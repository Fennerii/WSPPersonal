<template>
  <div>
    <h1 class="title">My Stats</h1>

    <div class="columns">
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
      <div class="column">
        <div class="box has-text-centered">
          <p class="heading">Avg Duration</p>
          <p class="title">{{ avgDuration }} mins</p>
        </div>
      </div>
    </div>

    <h2 class="title is-5 mt-5">By Activity Type</h2>

    <div v-if="userActivities.length === 0" class="box has-text-grey">
      No activities yet.
    </div>
    <div v-else class="columns is-multiline">
      <div v-for="(data, type) in byType" :key="type" class="column is-4">
        <div class="box">
          <p class="has-text-weight-bold is-capitalized">{{ type }}</p>
          <p class="is-size-7 mt-2">Sessions: {{ data.count }}</p>
          <p class="is-size-7">Minutes: {{ data.minutes }}</p>
          <p class="is-size-7">Calories: {{ data.calories }}</p>
        </div>
      </div>
    </div>

    <h2 class="title is-5 mt-5">Most Recent</h2>

    <div v-if="mostRecent" class="box">
      <p class="has-text-weight-bold">{{ mostRecent.name }}</p>
      <p class="has-text-grey is-size-7">{{ mostRecent.type }} · {{ mostRecent.date }}</p>
      <div class="mt-2">
        <span class="tag is-primary is-light mr-2">{{ mostRecent.duration }} mins</span>
        <span class="tag is-warning is-light">{{ mostRecent.calories }} kcal</span>
      </div>
    </div>
    <div v-else class="box has-text-grey">
      No activities yet.
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

const totalMinutes = computed(() => userActivities.value.reduce((sum, a) => sum + a.duration, 0))
const totalCalories = computed(() => userActivities.value.reduce((sum, a) => sum + a.calories, 0))

const avgDuration = computed(() => {
  if (!userActivities.value.length) return 0
  return Math.round(totalMinutes.value / userActivities.value.length)
})

const byType = computed(() => {
  const result: Record<string, { count: number; minutes: number; calories: number }> = {}
  for (const a of userActivities.value) {
    if (!result[a.type]) result[a.type] = { count: 0, minutes: 0, calories: 0 }
    result[a.type].count++
    result[a.type].minutes += a.duration
    result[a.type].calories += a.calories
  }
  return result
})

const mostRecent = computed(() => {
  if (!userActivities.value.length) return null
  // slice first so we don't mutate the original array
  return [...userActivities.value].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0]
})
</script>