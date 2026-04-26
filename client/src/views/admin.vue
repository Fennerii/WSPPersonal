<template>
  <div>
    <div class="columns is-vcentered mb-4">
      <div class="column">
        <h1 class="title">Admin Panel</h1>
        <p class="subtitle has-text-grey">Manage users</p>
      </div>
      <div class="column is-narrow">
        <button class="button is-primary" type="button" @click="showForm = true">
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>Add User</span>
        </button>
      </div>
    </div>

    <div v-if="showForm" class="box mb-4">
      <h2 class="title is-5">{{ editingUser ? 'Edit User' : 'New User' }}</h2>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" v-model="form.name" placeholder="Full name" />
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input class="input" type="text" v-model="form.username" placeholder="username" />
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Role</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="form.role">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Photo URL</label>
            <div class="control">
              <input class="input" type="text" v-model="form.photo" placeholder="/photo.jpg" />
            </div>
          </div>
        </div>
      </div>

      <p v-if="formError" class="has-text-danger mb-3">Please fill in name and username.</p>

      <div class="buttons">
        <button class="button is-primary" type="button" @click="saveUser">
          {{editingUser ? 'Save Changes' : 'Add User'}}
        </button>
        <button class="button" type="button" @click="showForm = false; editingUser = null">Cancel</button>
      </div>
    </div>

    <div class="box p-0">
      <table class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersStore.users" :key="user.id">
            <td>
              <figure class="image is-32x32">
                <img class="is-rounded" :src="user.photo" />
              </figure>
            </td>
            <td>{{ user.name }}</td>
            <td>@{{ user.username }}</td>
            <td>
              <span class="tag" :class="user.role === 'admin' ? 'is-warning' : 'is-info is-light'">
                {{ user.role }}
              </span>
            </td>
            <td>
              <div class="buttons">
                <button class="button is-small is-info is-light" type="button" @click="editUser(user)">
                  <span class="icon"><i class="fas fa-edit"></i></span>
                </button>
                <!-- can't delete yourself -->
                <button
                  class="button is-small is-danger is-light"
                  type="button"
                  @click="usersStore.deleteUser(user.id)"
                  :disabled="user.id === authStore.currentUser?.id"
                >
                  <span class="icon"><i class="fas fa-trash"></i></span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUsersStore } from '../stores/users'
import type { User } from '../types/user'

const authStore = useAuthStore()
const usersStore = useUsersStore()

const showForm = ref(false)
const editingUser = ref<User | null>(null)
const formError = ref(false)

const defaultForm = { name: '', username: '', role: 'user' as const, photo: '/default-avatar.jpg' }
const form = reactive({ ...defaultForm })

function saveUser() {
  if (!form.name.trim() || !form.username.trim()) {
    formError.value = true
    return
  }

  if (editingUser.value) {
    usersStore.updateUser(editingUser.value.id, { ...form })
  } else {
    usersStore.addUser({ ...form })
  }

  showForm.value = false
  editingUser.value = null
  Object.assign(form, defaultForm)
  formError.value = false
}

function editUser(user: User) {
  editingUser.value = user
  Object.assign(form, user)
  showForm.value = true
}
</script>