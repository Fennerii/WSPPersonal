<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-4">
            <div class="box">
              <h1 class="title has-text-centered">HeavyLifting</h1>
              <p class="subtitle has-text-centered has-text-grey">One Rep At A Time</p>
              <div class="field">
                <label class="label">Username</label>
                <div class="control has-icons-left">
                  <input class="input" type="text" v-model="username" placeholder="Enter your username" />
                  <span class="icon is-left"><i class="fas fa-user"></i></span>
                </div>
              </div>
              <p v-if="error" class="has-text-danger mb-3">{{ error }}</p>
              <button type="button" class="button is-primary is-fullwidth mt-4" @click="handleLogin">
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
import useSessionStore from '../stores/session'
import * as usersService from '../services/users.ts'

const router = useRouter()
const sessionStore = useSessionStore()

const username = ref('')
const error = ref('')

async function handleLogin() {
  console.log('usersService:', usersService)
  if (!username.value.trim()) {
    error.value = 'Please enter a username.'
    return
  }
  try {
    const response = await usersService.login(username.value)
    console.log('response:', response)
    if (response.isSuccess) {
      sessionStore.user = response.data
      router.push('/dashboard')
    } else {
      error.value = 'User not found. Please try again.'
    }
  } catch (e) {
    console.log('error:', e)
    error.value = 'User not found. Please try again.'
  }
}
</script>