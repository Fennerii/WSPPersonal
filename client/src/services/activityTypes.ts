import { api } from './myFetch'
import type { DataEnvelope, DataListEnvelope, ActivityType } from '../../../server/types/index'

export function getAll() {
    return api<DataListEnvelope<ActivityType>>('/api/v1/activity-types')
}

export function get(id: number) {
    return api<DataEnvelope<ActivityType>>(`/api/v1/activity-types/${id}`)
}

export function create(item: ActivityType) {
    return api<DataEnvelope<ActivityType>>('/api/v1/activity-types', item)
}

export function update(id: number, item: Partial<ActivityType>) {
    return api<DataEnvelope<ActivityType>>(`/api/v1/activity-types/${id}`, item, { method: 'PATCH' })
}

export function remove(id: number) {
    return api<DataEnvelope<ActivityType>>(`/api/v1/activity-types/${id}`, undefined, { method: 'DELETE' })
}