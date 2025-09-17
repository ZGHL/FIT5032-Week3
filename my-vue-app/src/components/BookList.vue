<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { collection, query, where, getDocs } from "firebase/firestore";
import db from '../firebase/init.js';
const books = ref<Array<{ id: string; ISBN: number; name: string }>>([]);
onMounted(async () => {
  const q = query(collection(db, "books"), where("ISBN", ">", 1000));
  const querySnapshot = await getDocs(q);
  books.value = [];
  querySnapshot.forEach((doc) => {
    books.value.push({ id: doc.id, ...(doc.data() as { ISBN: number; name: string }) });
  });
});
</script>

<template>
<div>
  <h1>Book With ISBN > 1000</h1>
  <ul>
    <li v-for="book in books" :key="book.id">
      {{ book.name }} - ISBN: {{ book.ISBN }}
    </li>
  </ul>
</div>
</template>

<style scoped>

</style>