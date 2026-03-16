<template>
  <div>
    <div class="columns is-vcentered mb-4">
      <div class="column">
        <h1 class="title">My Activities</h1>
      </div>
      <div class="column is-narrow">
        <button class="button is-primary" @click="showForm = true">
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>Add Activity</span>
        </button>
      </div>
    </div>

    <div v-if="showForm" class="box mb-4">
      <h2 class="title is-5">{{ editingActivity ? 'Edit Activity' : 'New Activity' }}</h2>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" v-model="form.name" placeholder="e.g. Morning Run" />
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Type</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="form.type">
                  <option value="">Select type...</option>
                  <option value="running">Running</option>
                  <option value="gym">Gym</option>
                  <option value="cycling">Cycling</option>
                  <option value="swimming">Swimming</option>
                  <option value="yoga">Yoga</option>
                  <option value="hiking">Hiking</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Date</label>
            <div class="control">
              <input class="input" type="date" v-model="form.date" />
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Duration (mins)</label>
            <div class="control">
              <input class="input" type="number" v-model="form.duration" placeholder="30" />
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Calories</label>
            <div class="control">
              <input class="input" type="number" v-model="form.calories" placeholder="200" />
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Notes</label>
        <div class="control">
          <textarea class="textarea" v-model="form.notes" placeholder="Optional notes..."></textarea>
        </div>
      </div>

      <p v-if="formError" class="has-text-danger mb-3">Please fill in all required fields.</p>

      <div class="buttons">
        <button class="button is-primary" @click="saveActivity">
          {{ editingActivity ? 'Save Changes' : 'Add Activity' }}
        </button>
        <button class="button" @click="showForm = false; editingActivity = null">Cancel</button>
      </div>
    </div>

    <div v-if="userActivities.length === 0" class="box has-text-grey">
      No activities yet. Add one above!
    </div>

    <div v-for="activity in userActivities" :key="activity.id" class="box mb-3">
      <div class="columns is-vcentered">
        <div class="column">
          <p class="has-text-weight-bold">{{ activity.name }}</p>
          <p class="has-text-grey is-size-7">{{ activity.type }} · {{ activity.date }}</p>
          <p v-if="activity.notes" class="is-size-7 mt-1">{{ activity.notes }}</p>
        </div>
        <div class="column is-narrow">
          <span class="tag is-primary is-light mr-2">{{ activity.duration }} mins</span>
          <span class="tag is-warning is-light mr-2">{{ activity.calories }} kcal</span>
          <button class="button is-small is-info is-light mr-1" @click="editActivity(activity)">
            <span class="icon"><i class="fas fa-edit"></i></span>
          </button>
          <button class="button is-small is-danger is-light" @click="activitiesStore.deleteActivity(activity.id)">
            <span class="icon"><i class="fas fa-trash"></i></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useActivitiesStore } from '../stores/activities'
import type { Activity } from '../types/activity'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const userActivities = computed(() =>
  activitiesStore.getActivitiesByUser(authStore.currentUser!.id)
)

const showForm = ref(false)
const editingActivity = ref<Activity | null>(null)
const formError = ref(false)

const defaultForm = { name: '', type: '', date: '', duration: 0, calories: 0, notes: '' }
const form = reactive({ ...defaultForm })

function saveActivity() {
  if (!form.name.trim() || !form.type || !form.date) {
    formError.value = true
    return
  }

  if (editingActivity.value) {
    activitiesStore.updateActivity(editingActivity.value.id, { ...form })
  } else {
    activitiesStore.addActivity({
      ...form,
      userId: authStore.currentUser!.id,
      duration: Number(form.duration),
      calories: Number(form.calories)
    })
  }

  showForm.value = false
  editingActivity.value = null
  Object.assign(form, defaultForm)
  formError.value = false
}

function editActivity(activity: Activity) {
  editingActivity.value = activity
  Object.assign(form, activity)
  showForm.value = true
}
</script>