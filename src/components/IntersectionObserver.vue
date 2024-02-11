<script setup lang="ts">
import { onMounted, ref } from 'vue'

const observer = ref<IntersectionObserver | null>(null)
const root = ref<Element | null>(null)

const emit = defineEmits<{
  intersect: []
}>()

onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emit('intersect')
    }
  })
  root.value && observer.value.observe(root.value)
})
</script>

<template>
  <div class="observer h-2.5 w-2.5" ref="root"></div>
</template>
