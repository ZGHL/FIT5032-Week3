<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from '../firebase/init.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = getAuth();
const userEmail = ref('');
const userRole = ref('');

// Get user information when component mounts
onMounted(async () => {
  if (auth.currentUser) {
    userEmail.value = auth.currentUser.email || '';
    
    try {
      // Fetch user data from Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userRole.value = userData.role || 'No role assigned';
        
        // Update last login time
        await updateDoc(userDocRef, {
          lastLoginAt: new Date()
        });
      } else {
        // If no user document exists, redirect to registration
        console.log('No user document found, redirecting to registration');
        router.push('/FireRegister');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      userRole.value = 'Error loading role';
    }
  } else {
    // Redirect to login if no user is authenticated
    router.push('/FireLogin');
  }
});

const logout = async () => {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
    // Redirect to Firebase login page
    router.push('/FireLogin');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
</script>

<template>
  <div class="container">
    <div class="profile-header">
      <div class="avatar">
        <span class="avatar-icon">👤</span>
      </div>
      <h1>User Profile</h1>
    </div>
    
    <div class="profile-info">
      <div class="info-item">
        <label>Email Address</label>
        <div class="info-value">{{ userEmail }}</div>
      </div>
      
      <div class="info-item">
        <label>User Role</label>
        <div class="role-badge" :class="userRole.toLowerCase()">
          <span class="role-icon">
            {{ userRole === 'student' ? '🎓' : userRole === 'teacher' ? '👨‍🏫' : '❓' }}
          </span>
          <span class="role-text">{{ userRole }}</span>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.avatar-icon {
  font-size: 3rem;
}

h1 {
  color: #333;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.profile-info {
  margin-bottom: 2rem;
}

.info-item {
  margin-bottom: 1.5rem;
}

.info-item label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #333;
  font-size: 16px;
  border: 2px solid #e1e5e9;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.role-badge.student {
  background: rgba(52, 168, 83, 0.1);
  color: #137333;
  border: 1px solid rgba(52, 168, 83, 0.3);
}

.role-badge.teacher {
  background: rgba(251, 188, 4, 0.1);
  color: #b06000;
  border: 1px solid rgba(251, 188, 4, 0.3);
}

.role-badge:not(.student):not(.teacher) {
  background: rgba(95, 99, 104, 0.1);
  color: #5f6368;
  border: 1px solid rgba(95, 99, 104, 0.3);
}

.role-icon {
  font-size: 16px;
}

.role-text {
  text-transform: capitalize;
}

.actions {
  text-align: center;
}

.logout-btn {
  padding: 12px 32px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.logout-btn:active {
  background: #bd2130;
  transform: translateY(0);
}
</style>
