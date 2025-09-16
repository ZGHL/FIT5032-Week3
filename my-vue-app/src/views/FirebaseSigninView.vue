<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const router = useRouter();
const auth = getAuth();
const email = ref('');
const password = ref('');
const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    console.log('Login successful');
    console.log('User logged in:', auth.currentUser);
    
    // Redirect to profile page or intended page after successful login
    const redirectPath = (router.currentRoute.value.query.redirect as string) || '/profile';
    router.push(redirectPath);
  } catch (error) {
    console.error('Error logging in:', error);
    // Handle login errors (e.g., display error messages to the user)
  }
}
</script>

<template>
  <div class="container">
    <h1>Firebase Login</h1>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password"/></p>
    <p><button @click="login">Login</button></p>
    <p>Don't have an account? <router-link :to="{ name: 'FireRegister', query: { redirect: router.currentRoute.value.query.redirect } }">Register here</router-link></p>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
}

p {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}

button {
  width: 100%;
  padding: 12px 16px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background: #3367d6;
}

button:active {
  background: #2d5aa0;
}

a {
  color: #4285f4;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

p:last-child {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 14px;
}
</style>