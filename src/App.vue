<script setup lang="ts">
import { onMounted } from 'vue'
import NavCard from './components/NavCard.vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/users'

const { getUser } = useUserStore()

onMounted(() => {
  getUser()
})
</script>

<template>
  <main>
    <NavCard />
    <RouterView />
  </main>
</template>
