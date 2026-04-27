import { api } from './myFetch'
import type { DataEnvelope, DataListEnvelope, User } from '../../../server/types/index'

export function getAll() {
    return api<DataListEnvelope<User>>('/api/v1/users')
}

export function get(id: number) {
    return api<DataEnvelope<User>>(`/api/v1/users/${id}`)
}

export function login(username: string) {
    return api<DataEnvelope<User>>('/api/v1/users/login', { username })
}

export function create(user: User) {
    return api<DataEnvelope<User>>('/api/v1/users', user)
}

export function update(id: number, user: Partial<User>) {
    return api<DataEnvelope<User>>(`/api/v1/users/${id}`, user, { method: 'PATCH' })
}

export function remove(id: number) {
    return api<DataEnvelope<User>>(`/api/v1/users/${id}`, undefined, { method: 'DELETE' })
}
