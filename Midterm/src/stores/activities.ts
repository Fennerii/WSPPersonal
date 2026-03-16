import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Activity {
  id: string
  userId: string
  type: string
  name: string
  date: string
  duration: number
  calories: number
  notes: string
}

export const useActivitiesStore = defineStore('activities', () => {

  const activities = ref<Activity[]>([
    { id: '1', userId: '1', type: 'running',name: 'Running around the fountain', date: '2026-03-01', duration: 30, calories: 300, notes: 'felt great'},
    { id: '2', userId: '1', type: 'gym',name: 'PPL Cycle 1', date: '2026-03-02', duration: 60, calories: 400, notes: ''},
    { id: '3', userId: '2', type: 'cycling',name: 'park park park ride ride ride', date: '2026-03-01', duration: 45, calories: 350, notes: ''},
    { id: '4', userId: '2', type: 'swimming',name: 'swimmin in circles', date: '2026-03-03', duration: 40, calories: 320, notes: 'new pb'},
    { id: '5', userId: '3', type: 'yoga', name: 'Upwards and Downwards Dog', date: '2026-03-02', duration: 30, calories: 150, notes: ''},
    { id: '6', userId: '4', type: 'hiking', name: 'Trailing The Mountain', date: '2026-03-01', duration: 90, calories: 600, notes: 'beautiful views'},
  ])

  function generateId(): string {
    if (activities.value.length === 0) return '1'
    const ids = activities.value.map(a => parseInt(a.id))
    const maxId = Math.max(...ids)
    return String(maxId + 1)
  }

  function getActivitiesByUser(userId: string) {
    return activities.value.filter(a => a.userId === userId)
  }

  function addActivity(data: Omit<Activity, 'id'>) {
    activities.value.push({ id: generateId(), ...data })
  }

  function updateActivity(id: string, data: Partial<Activity>) {
    const i = activities.value.findIndex(a => a.id === id)
    if (i !== -1) activities.value[i] = { ...activities.value[i], ...data }
  }

  function deleteActivity(id: string) {
    activities.value = activities.value.filter(a => a.id !== id)
  }

  return {activities, getActivitiesByUser, addActivity, updateActivity, deleteActivity}
})