<script lang="ts">
import { ref } from 'vue'
import db from '../firebase/init'
import { collection, addDoc } from 'firebase/firestore'
import axios from "axios";

import BkList from '@/components/BookList.vue'

export default {
  setup() {
    const isbn = ref('');
    const name = ref('');
    const bookListRef = ref();

    const addBook = async () => {
      try {
        // Frontend validation
        if (!isbn.value.trim() || !name.value.trim()) {
          alert("Please fill in all required fields");
          return;
        }

        const isbnNumber = Number(isbn.value);
        if (isNaN(isbnNumber)) {
          alert("ISBN must be a number");
          return;
        }

        // Call cloud function to add book
        const response = await axios.post('https://addbook-3e2mknb2qq-uc.a.run.app', {
          isbn: isbn.value,
          name: name.value
        });

        console.log("Response from server: ", response.data);
        
        // Check response status
        if (response.data.success) {
          alert(response.data.message || "Book added successfully!");
          
          // Clear input fields after successful addition
          isbn.value = '';
          name.value = '';
          
          // Refresh the book list
          if (bookListRef.value) {
            bookListRef.value.fetchBooks();
          }
        } else {
          alert("Failed to add book: " + (response.data.error || "Unknown error"));
        }

      } catch (error) {
        console.error("Error adding book: ", error);
        
        // Handle different types of errors
        if (error.response) {
          // Server returned an error status code
          const errorMessage = error.response.data?.error || error.response.data?.message || "Server error";
          alert("Failed to add book: " + errorMessage);
        } else if (error.request) {
          // Request was sent but no response received
          alert("Network error: Unable to connect to server");
        } else {
          // Other errors
          alert("Failed to add book: " + error.message);
        }
      }
    };

    const handleBookUpdated = () => {
      console.log("Book updated successfully");
    };

    const handleBookDeleted = () => {
      console.log("Book deleted successfully");
    };

    return {
      isbn, 
      name, 
      addBook, 
      bookListRef,
      handleBookUpdated,
      handleBookDeleted
    };
  },
  components: {
    BkList
  }
};
</script>

<template>
  <div class="main-container">
    <h1>Book Management</h1>
    <div class="content-wrapper">
      <!-- Left side - Add Book Form -->
      <div class="left-panel">
        <div class="form-container">
          <h2>Add New Book</h2>
          <form @submit.prevent="addBook">
            <div class="form-group">
              <label for="ISBN">ISBN:</label>
              <input type="text" id="ISBN" v-model="isbn" placeholder="Enter ISBN number" required />
            </div>
            <div class="form-group">
              <label for="name">Book Name:</label>
              <input type="text" id="name" v-model="name" placeholder="Enter book name" required />
            </div>
            <button type="submit" class="submit-btn">Add Book</button>
          </form>
        </div>
      </div>
      
      <!-- Right side - Book List -->
      <div class="right-panel">
        <BkList ref="bookListRef" @bookUpdated="handleBookUpdated" @bookDeleted="handleBookDeleted" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  min-height: 600px;
}

.left-panel {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.right-panel {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-container h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

input {
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

.submit-btn {
  padding: 12px 16px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  background: #3367d6;
  transform: translateY(-1px);
}

.submit-btn:active {
  background: #2d5aa0;
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .main-container {
    padding: 0 0.5rem;
  }
  
  .left-panel, .right-panel {
    padding: 1.5rem;
  }
}
</style>