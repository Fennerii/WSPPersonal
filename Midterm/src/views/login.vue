<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-4">
            <div class="box">

              <h1 class="title has-text-centered">
                HeavyLifting
              </h1>
              <p class="subtitle has-text-centered has-text-grey">One Rep At A Time</p>

              <div class="field">
                <label class="label">Sign in as</label>
                <div class="control has-icons-left">
                  <div class="select is-fullwidth">
                    <select v-model="selectedUser">
                      <option value="">Select a user...</option>
                        <option v-for="user in usersStore.users" :key="user.id" :value="user">                        
                          {{ user.name }} ({{ user.role }})
                      </option>
                    </select>
                  </div>
                  <span class="icon is-left"><i class="fas fa-user"></i></span>
                </div>
              </div>

              <p v-if="error" class="has-text-danger">Please select a user.</p>

              <button class="button is-primary is-fullwidth mt-4" @click="login">
                Sign In
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUsersStore } from '../stores/users'

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()

const selectedUser = ref(null)
const error = ref(false)

function login() {
  if (!selectedUser.value) {
    error.value = true
    return
  }
  authStore.login(selectedUser.value)
  router.push('/dashboard')
}
</script>