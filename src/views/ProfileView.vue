<script setup lang="ts">
import ProfileCard from '@/components/ProfileCard.vue'
</script>

<template>
  <main>
    <div v-if="typeof $route.params.username === 'string'">
      <ProfileCard :key="$route.params.username" />
    </div>
  </main>
</template>
