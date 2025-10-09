<script lang="ts">
import axios from 'axios'
export default {
  data() {
    return {
      jsondata: null,
      allbooks: null,
      count: null,
      error: null,
    };
  },
  mounted() {
    this.getBookCountAPI();
    this.getAllBooks();
  },
  methods: {
    async getBookCountAPI() {
      try {
        const response = await axios.get('https://countbooks-3e2mknb2qq-uc.a.run.app/')
        this.jsondata = response.data
        this.error = null
      } catch (err) {
        this.error = err.message
        this.count = null
      }
    },
    async getAllBooks() {
      try {
        const response = await axios.get('https://getallbooks-3e2mknb2qq-uc.a.run.app')
        this.allbooks = response.data
        this.error = null
      } catch (err) {
        this.error = err.message
        this.allbooks = null
      }
    },
  },
};
</script>

<template>
<div class="container">
  <h2 class="mb-4">Book Count from API</h2>
  <div v-if="error" class="alert alert-danger">
    Error: {{ error }}
  </div>
  <div v-else-if="jsondata">
    <p>Total Books: <strong>{{ jsondata.count }}</strong></p>
    <pre>{{ jsondata }}</pre>
    <pre>{{allbooks}}</pre>
  </div>
  <div v-else>
    <p>Loading...</p>
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