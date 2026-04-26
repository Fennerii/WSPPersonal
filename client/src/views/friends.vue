<template>
  <div>
    <h1 class="title">Friends</h1>

    <div v-if="friends.length === 0" class="box has-text-grey">
      You have no friends added yet.
    </div>

    <div v-for="friend in friends" :key="friend.id" class="box mb-4">
      
      <div class="columns is-vcentered mb-3">
        <div class="column is-narrow">
          <figure class="image is-48x48">
            <img class="is-rounded" :src="friend.photo" />
          </figure>
        </div>
        <div class="column">
          <p class="has-text-weight-bold is-size-5">{{friend.name}}</p>
          <p class="has-text-grey is-size-7">@{{friend.username}}</p>
        </div>
        <div class="column is-narrow">
          <span class="tag is-light">{{getFriendActivities(friend.id).length}} activities</span>
        </div>
      </div>

      <div v-if="getFriendActivities(friend.id).length === 0" class="has-text-grey is-size-7">
        No activities yet.
      </div>

      <div v-for="activity in getFriendActivities(friend.id)" :key="activity.id" class="box mb-2">
        <div class="columns is-vcentered">
          <div class="column">
            <p class="has-text-weight-bold">{{activity.name}}</p>
            <p class="has-text-grey is-size-7">{{activity.type}} · {{activity.date}}</p>
            <p v-if="activity.notes" class="is-size-7 mt-1">{{activity.notes}}</p>
          </div>
          <div class="column is-narrow">
            <span class="tag is-primary is-light mr-2">{{activity.duration}} mins</span>
            <span class="tag is-warning is-light">{{activity.calories}} kcal</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUsersStore } from '../stores/users'
import { useActivitiesStore } from '../stores/activities'

const authStore = useAuthStore()
const usersStore = useUsersStore()
const activitiesStore = useActivitiesStore()

const friends = computed(() => {
  const friendIds = authStore.currentUser!.friends
  return friendIds.map(id => usersStore.getUserById(id)).filter(Boolean)
})

function getFriendActivities(friendId: string) {
  return activitiesStore.getActivitiesByUser(friendId)
}
</script>