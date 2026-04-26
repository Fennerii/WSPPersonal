import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  username: string
  role: 'admin' | 'user'
  friends: string[]
  photo: string
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function login(user: User) {
    currentUser.value = user
  }

  function logout() {
    currentUser.value = null
  }

  return { currentUser, isLoggedIn, isAdmin, login, logout }
})