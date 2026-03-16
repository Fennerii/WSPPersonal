import {defineStore} from 'pinia'
import {ref} from 'vue'

interface User {
  id: string
  name: string
  username: string
  role: 'admin' | 'user'
  friends: string[]
  photo: string
}

export const useUsersStore = defineStore('users', () => {

 const users = ref<User[]>([
  { id: '1', name: 'Jonathan Fenner',username: 'fennerii', role: 'admin', friends: ['2', '3'], photo: '/WSPPersonal/nightfly.jpg' },
  { id: '2', name: 'Bilbo Swaggins',username: 'FellowshipOfTheBling', role: 'user',  friends: ['1', '3'], photo: '/WSPPersonal/bilbowaggins.jpg' },
  { id: '3', name: 'Marty Reisman', username: 'MartySupreme',role: 'user',  friends: ['1', '2'], photo: '/WSPPersonal/marty.jpg' },
  { id: '4', name: 'Kayleigh Rose Amstutz', username: 'ChappellRoan', role: 'user',  friends: ['1'],      photo: '/WSPPersonal/bigchappell.jpg' },
])

  function generateId(): string {
    if (users.value.length === 0) return '1'
    const ids = users.value.map(u => parseInt(u.id))
    const maxId = Math.max(...ids)
    return String(maxId + 1)
  }

  function getUserById(id: string) {
    return users.value.find(u => u.id === id)
  }

  function addUser(data: Omit<User, 'id'>) {
    users.value.push({ id: generateId(), ...data })
  }

  function updateUser(id: string, data: Partial<User>) {
    const i = users.value.findIndex(u => u.id === id)
    if (i !== -1) users.value[i] = { ...users.value[i], ...data }
  }

  function deleteUser(id: string) {
    users.value = users.value.filter(u => u.id !== id)
  }

  return { users, getUserById, addUser, updateUser, deleteUser }
})