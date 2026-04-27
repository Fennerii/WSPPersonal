import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DataListEnvelope, ActivityType } from '../../../server/types/index'
import useSessionStore from './session'

export const useActivityTypesStore = defineStore('activityTypes', () => {
    const activityTypes = ref<ActivityType[]>([])
    const sessionStore = useSessionStore()

    function load() {
        sessionStore.api<DataListEnvelope<ActivityType>>('/api/v1/activity-types')
            .then((response) => {
                activityTypes.value = response.data
            })
    }
    load()

    return { activityTypes }
})