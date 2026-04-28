<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-4">
            <div class="box">
              <h1 class="title has-text-centered">HeavyLifting</h1>
              <p class="subtitle has-text-centered has-text-grey">One Rep At A Time</p>

              <div class="tabs is-centered mb-4">
                <ul>
                  <li :class="{ 'is-active': mode === 'login' }">
                    <a @click="mode = 'login'">Sign In</a>
                  </li>
                  <li :class="{ 'is-active': mode === 'register' }">
                    <a @click="mode = 'register'">Create Account</a>
                  </li>
                </ul>
              </div>

              <!-- Sign In -->
              <div v-if="mode === 'login'">
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

              <!-- Create Account -->
              <div v-if="mode === 'register'">
                <div class="field">
                  <label class="label">Name</label>
                  <div class="control">
                    <input class="input" type="text" v-model="registerForm.name" placeholder="Full name" />
                  </div>
                </div>
                <div class="field">
                  <label class="label">Username</label>
                  <div class="control has-icons-left">
                    <input class="input" type="text" v-model="registerForm.username" placeholder="Choose a username" />
                    <span class="icon is-left"><i class="fas fa-user"></i></span>
                  </div>
                </div>
                <p v-if="error" class="has-text-danger mb-3">{{ error }}</p>
                <button type="button" class="button is-primary is-fullwidth mt-4" @click="handleRegister">
                  Create Account
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import useSessionStore from '../stores/session'
import * as usersService from '../services/users.ts'
import type { User } from '../../../server/types/index'

const router = useRouter()
const sessionStore = useSessionStore()

const mode = ref<'login' | 'register'>('login')
const username = ref('')
const error = ref('')

const registerForm = reactive({
  name: '',
  username: '',
})

async function handleLogin() {
  if (!username.value.trim()) {
    error.value = 'Please enter a username.'
    return
  }
  try {
    await sessionStore.login(username.value)
    if (sessionStore.user) {
      router.push('/dashboard')
    } else {
      error.value = 'User not found. Please try again.'
    }
  } catch (e) {
    error.value = 'User not found. Please try again.'
  }
}

async function handleRegister() {
  if (!registerForm.name.trim() || !registerForm.username.trim()) {
    error.value = 'Please fill in name and username.'
    return
  }
  try {
    const response = await usersService.create({
      name: registerForm.name,
      username: registerForm.username,
      role: 'user',
      photo: '/dumbell.jpg',
    } as User)
    if (response.isSuccess) {
      await sessionStore.login(registerForm.username)
      if (sessionStore.user) {
        router.push('/dashboard')
      }
    } else {
      error.value = 'Could not create account. Try a different username.'
    }
  } catch (e) {
    error.value = 'Could not create account. Try a different username.'
  }
}
</script>