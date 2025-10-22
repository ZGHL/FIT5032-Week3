<script setup lang="ts">
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import db from '../firebase/init.js';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const email = ref('');
const password = ref('');
const selectedRole = ref('student');
const auth = getAuth();
const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    
    // Store user role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: selectedRole.value,
      createdAt: new Date(),
      lastLoginAt: null
    });
    
    console.log('Registration successful');
    console.log('User registered:', user);
    console.log('User role saved to Firestore:', selectedRole.value);
    
    // Redirect to login page after successful registration
    router.push('/FireLogin');
  } catch (error) {
    console.error('Error registering user:', error);
    // Handle registration errors (e.g., display error messages to the user)
  }
};

</script>

<template>
  <div class="container">
    <h1>Create An Account</h1>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password"/></p>
    
    <div class="role-selection">
      <label class="role-label">Select Role:</label>
      <div class="role-options">
        <label class="role-option" :class="{ 'selected': selectedRole === 'student' }">
          <input 
            type="radio" 
            value="student" 
            v-model="selectedRole"
            style="display: none;"
          />
          <span class="role-icon">🎓</span>
          <span class="role-text">Student</span>
        </label>
        <label class="role-option" :class="{ 'selected': selectedRole === 'teacher' }">
          <input 
            type="radio" 
            value="teacher" 
            v-model="selectedRole"
            style="display: none;"
          />
          <span class="role-icon">👨‍🏫</span>
          <span class="role-text">Teacher</span>
        </label>
      </div>
    </div>
    
    <p><button @click="register">Register</button></p>
    <p>Already have an account? <router-link :to="{ name: 'FireLogin', query: { redirect: route.query.redirect } }">Login here</router-link></p>
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

.role-selection {
  margin-bottom: 1.5rem;
}

.role-label {
  display: block;
  margin-bottom: 0.75rem;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.role-options {
  display: flex;
  gap: 1rem;
}

.role-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.role-option:hover {
  border-color: #4285f4;
  transform: translateY(-1px);
}

.role-option.selected {
  border-color: #4285f4;
  background: rgba(66, 133, 244, 0.05);
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.2);
}

.role-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.role-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.role-option.selected .role-text {
  color: #4285f4;
  font-weight: 600;
}
</style>