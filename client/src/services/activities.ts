import { api } from './myFetch'
import type { DataEnvelope, DataListEnvelope, Activity } from '../../../server/types/index'

export function getAll() {
    return api<DataListEnvelope<Activity>>('/api/v1/activities')
}

export function getByUser(userId: number) {
    return api<DataListEnvelope<Activity>>(`/api/v1/activities/user/${userId}`)
}

export function getFriendFeed(friendIds: number[]) {
    return api<DataListEnvelope<Activity>>(`/api/v1/activities/feed?friendIds=${friendIds.join(',')}`)
}

export function getUserStats(userId: number) {
    return api<DataEnvelope<{ totalDuration: number, totalCalories: number, totalSessions: number }>>(`/api/v1/activities/stats/${userId}`)
}

export function create(item: Activity) {
    return api<DataEnvelope<Activity>>('/api/v1/activities', item)
}

export function update(id: number, item: Partial<Activity>) {
    return api<DataEnvelope<Activity>>(`/api/v1/activities/${id}`, item, { method: 'PATCH' })
}

export function remove(id: number) {
    return api<DataEnvelope<Activity>>(`/api/v1/activities/${id}`, undefined, { method: 'DELETE' })
}