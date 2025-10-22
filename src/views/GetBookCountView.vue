<script lang="ts">
import axios from 'axios'
export default {
  data() {
    return {
      count: null,
      error: null,
    };
  },
  methods: {
    async fetchBookCount() {
      try {
        const response = await axios.get('https://countbooks-3e2mknb2qq-uc.a.run.app/')
        this.count = response.data.count
        this.error = null
      } catch (err) {
        this.error = err.message
        this.count = null
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <h1>Get Book Count</h1>
    <p>This is the Get Book Count view.</p>
    <button class="btn btn-primary" @click="fetchBookCount">
      Fetch Book Count
    </button>
    <div v-if="count !== null" class="mt-3">
      <p>Total number of books: {{ count }}</p>
      <p v-if="error" class="text-danger">Error: {{ error }}</p>
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

</style>