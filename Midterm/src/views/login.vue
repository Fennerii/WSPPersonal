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
                      <option v-for="user in users" :key="user.id" :value="user">
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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const users = ref([
  { id: 'u1', name: 'Jonathan Fenner', role: 'admin' },
  { id: 'u2', name: 'Bilbo Swaggins',    role: 'user' },
  { id: 'u3', name: 'Marty Reisman' , role: 'user' },
  { id: 'u4', name: 'Kayleigh Rose Amstutz' , role: 'user'}
])

const selectedUser = ref('')
const error = ref(false)

function login() {
  if (!selectedUser.value) {
    error.value = true
    return
  }
  error.value = false
  router.push('/dashboard')
}
</script>