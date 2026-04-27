import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DataListEnvelope, Activity } from '../../../server/types/index'
import useSessionStore from './session'

export const useActivitiesStore = defineStore('activities', () => {
    const activities = ref<Activity[]>([])
    const sessionStore = useSessionStore()

    function load() {
        sessionStore.api<DataListEnvelope<Activity>>('/api/v1/activities')
            .then((response) => {
                activities.value = response.data
            })
    }
    load()

    function getByUser(userId: number) {
        return activities.value.filter(a => a.userId === userId)
    }

    function create(item: Activity) {
        return sessionStore.api<{ data: Activity }>('/api/v1/activities', item)
            .then((response) => {
                activities.value.push(response.data)
            })
    }

    function update(id: number, item: Partial<Activity>) {
        return sessionStore.api<{ data: Activity }>(`/api/v1/activities/${id}`, item, { method: 'PATCH' })
            .then((response) => {
                const i = activities.value.findIndex(a => a.id === id)
                if (i !== -1) activities.value[i] = response.data
            })
    }

    function remove(id: number) {
        return sessionStore.api(`/api/v1/activities/${id}`, undefined, { method: 'DELETE' })
            .then(() => {
                activities.value = activities.value.filter(a => a.id !== id)
            })
    }

    return { activities, getByUser, create, update, remove }
})