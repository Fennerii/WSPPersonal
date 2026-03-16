import {defineStore} from 'pinia'
import {ref, computed} from 'vue'

interface user{
    id: string
    name :string
    username: string
    role: 'admin' | 'user'
    friends: string[]
}

export const UseAuthStore = defineStore('a{uth', () => {
     const currentUser = ref<user | null>(null)

     const isAdmin = computed(() => currentUser.value?.role === 'admin')

     function login(user: user){
        currentUser.value =user
     }

     function logout(){
        currentUser.value =null
     }

     return {
        currentUser, isAdmin, login, logout }
     }

    )
