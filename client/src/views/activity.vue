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
                <select v-model="form.typeId">
                  <option value="">Select type...</option>
                  <option v-for="type in activityTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
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

    <div v-if="activities.length === 0 && !isLoading" class="box has-text-grey">
      No activities yet. Add one above!
    </div>

    <div ref="scrollContainer">
      <div v-for="activity in activities" :key="activity.id" class="box mb-3">
        <div class="columns is-vcentered">
          <div class="column">
            <p class="has-text-weight-bold">{{ activity.name }}</p>
            <p class="has-text-grey is-size-7">{{ activity.typeId }} · {{ activity.date }}</p>
            <p v-if="activity.notes" class="is-size-7 mt-1">{{ activity.notes }}</p>
          </div>
          <div class="column is-narrow">
            <span class="tag is-primary is-light mr-2">{{ activity.duration }} mins</span>
            <span class="tag is-warning is-light mr-2">{{ activity.calories }} kcal</span>
            <button class="button is-small is-info is-light mr-1" @click="editActivity(activity)">
              <span class="icon"><i class="fas fa-edit"></i></span>
            </button>
            <button class="button is-small is-danger is-light" @click="deleteActivity(activity.id)">
              <span class="icon"><i class="fas fa-trash"></i></span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="has-text-centered mt-4 mb-4">
        <span class="loader"></span>
        <p class="has-text-grey mt-2">Loading... {{ activities.length }} of {{ totalCount }} activities</p>
      </div>

      <p v-if="noMore && activities.length > 0" class="has-text-grey has-text-centered mt-4 mb-4">
        You've seen all {{ totalCount }} activities!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import useSessionStore from '../stores/session'
import { useActivityTypesStore } from '../stores/activityTypes'
import type { Activity } from '../../../server/types/index'

const sessionStore = useSessionStore()
const activityTypesStore = useActivityTypesStore()
const activityTypes = computed(() => activityTypesStore.activityTypes)

const activities = ref<Activity[]>([])
const page = ref(1)
const limit = 5
const totalCount = ref(0)
const isLoading = ref(false)
const noMore = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

async function loadMore() {
  if (isLoading.value || noMore.value) return
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  try {
    const userId = sessionStore.user!.id
    const res = await sessionStore.api<{ data: Activity[], total: number }>(
      `/api/v1/activities/user/${userId}?page=${page.value}&limit=${limit}`
    )
    const newItems = res.data
    totalCount.value = res.total ?? 0
    activities.value.push(...newItems)
    if (activities.value.length >= totalCount.value) {
      noMore.value = true
    } else {
      page.value++
    }
  } catch {
    noMore.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadMore()
})

useInfiniteScroll(
  window,
  async () => { await loadMore() },
  { distance: 100, canLoadMore: () => !noMore.value && !isLoading.value }
)

const showForm = ref(false)
const editingActivity = ref<Activity | null>(null)
const formError = ref(false)
const defaultForm = { name: '', typeId: 0, date: '', duration: 0, calories: 0, notes: '' }
const form = reactive({ ...defaultForm })

async function saveActivity() {
  if (!form.name.trim() || !form.typeId || !form.date) {
    formError.value = true
    return
  }
  if (editingActivity.value) {
    await sessionStore.api(`/api/v1/activities/${editingActivity.value.id}`, form, { method: 'PATCH' })
    const idx = activities.value.findIndex(a => a.id === editingActivity.value!.id)
    if (idx !== -1) activities.value[idx] = { ...activities.value[idx], ...form }
  } else {
    const res = await sessionStore.api<{ data: Activity }>('/api/v1/activities', {
      ...form,
      userId: sessionStore.user!.id,
      duration: Number(form.duration),
      calories: Number(form.calories)
    })
    activities.value.unshift(res.data)
    totalCount.value++
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

async function deleteActivity(id: number) {
  await sessionStore.api(`/api/v1/activities/${id}`, undefined, { method: 'DELETE' })
  activities.value = activities.value.filter(a => a.id !== id)
  totalCount.value--
}
</script>

<style scoped>
.loader {
  width: 24px;
  height: 24px;
  border: 3px solid #dbdbdb;
  border-top-color: #3273dc;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>