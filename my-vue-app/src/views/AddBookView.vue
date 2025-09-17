<script lang="ts">
import { ref } from 'vue'
import db from '../firebase/init'
import { collection, addDoc } from 'firebase/firestore'

import BkList from '@/components/BookList.vue'

export default {
  setup() {
    const isbn = ref('');
    const name = ref('');

    const addBook = async () => {
      try {
        const isbnNumber = Number(isbn.value);
        if (isNaN(isbnNumber)) {
          alert("ISBN must be a number");
          return;
        }

        await addDoc(collection(db, "books"), {
          ISBN: isbn.value,
          name: name.value,
        });
        console.log("Document written with ID: ", name.value);
        alert("Book added successfully!");
        // Clear input fields after successful addition
        isbn.value = '';
        name.value = '';
      } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error adding book: " + e.message);
      }
    };
    return {isbn, name, addBook};
  },
  components: {
    BkList
  }
};
</script>

<template>
  <div class="container">
    <h1>Add Book</h1>
    <form @submit.prevent="addBook">
      <div>
        <label for="ISBN">ISBN:</label>
        <input type="text" id="ISBN" v-model="isbn" required />
      </div>
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <button type="submit">Add Book</button>
    </form>
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

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

form > div {
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

button {
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

button:hover {
  background: #3367d6;
  transform: translateY(-1px);
}

button:active {
  background: #2d5aa0;
  transform: translateY(0);
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
</style>