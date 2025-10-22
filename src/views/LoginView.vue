<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
import { isAuthenticated } from '../auth.js'

const formData = ref({
  username: '',
  password: '',
})
const errors = ref({
  username: null,
  password: null,
})
const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}
const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must include at least one uppercase letter'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must include at least one lowercase letter'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must include at least one number'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must include at least one special character'
  } else {
    errors.value.password = null
  }
}
const submitForm = () => {
  validateName(true)
  validatePassword(true)
  if (errors.value.username || errors.value.password) {
    return
  }
  if(formData.value.username === 'admin' && formData.value.password === 'Admin@123') {
      isAuthenticated.value = true
      alert('Login successful! Redirecting to HomePage...')
      router.push('/')
  } else {
      alert('Invalid username or password')
  }
}
</script>

<template>
  <div class="d-flex justify-content-center" style="min-height: calc(100vh - 120px); padding-top: 8vh;">
    <div class="container" style="max-width: 440px;">
      <div class="card shadow-sm border-0">
        <div class="card-body p-4 p-md-5">
          <h2 class="text-center mb-2">🗄️ W5. Library Login Form</h2>
          <p class="text-center text-muted mb-4">Access your library account</p>

          <form @submit.prevent="submitForm" novalidate>
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
                placeholder="Enter your username"
                autocomplete="username"
              />
              <div v-if="errors.username" class="text-danger small mt-1">{{ errors.username }}</div>
            </div>

            <div class="mb-4">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
                placeholder="Enter your password"
                autocomplete="current-password"
              />
              <div v-if="errors.password" class="text-danger small mt-1">{{ errors.password }}</div>
            </div>

            <button type="submit" class="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
}
.btn-primary {
  height: 44px;
}
</style>