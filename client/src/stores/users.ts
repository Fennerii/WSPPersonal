import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DataListEnvelope, User } from '../../../server/types/index'
import useSessionStore from './session'

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([])
    const sessionStore = useSessionStore()

    function load() {
        sessionStore.api<DataListEnvelope<User>>('/api/v1/users')
            .then((response) => {
                users.value = response.data
            })
    }
    load()

    function getById(id: number) {
        return users.value.find(u => u.id === id)
    }

    function create(user: User) {
        return sessionStore.api<{ data: User }>('/api/v1/users', user)
            .then((response) => {
                users.value.push(response.data)
            })
    }

    function update(id: number, user: Partial<User>) {
        return sessionStore.api<{ data: User }>(`/api/v1/users/${id}`, user, { method: 'PATCH' })
            .then((response) => {
                const i = users.value.findIndex(u => u.id === id)
                if (i !== -1) users.value[i] = response.data
            })
    }

    function remove(id: number) {
        return sessionStore.api(`/api/v1/users/${id}`, undefined, { method: 'DELETE' })
            .then(() => {
                users.value = users.value.filter(u => u.id !== id)
            })
    }

    return { users, getById, create, update, remove }
})