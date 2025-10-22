<script setup>
import Form from "@/components/Form.vue";
import JSON from "@/components/JSON.vue";
import BHeader from "@/components/BHeader.vue";
</script>

<template>
  <div class="main-header">
    <header>
      <BHeader />
    </header>
    <main class="main-box">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>

</style>
