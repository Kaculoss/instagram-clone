<script setup lang="ts">
import type { Post } from '@/types'

defineProps<{ posts: Post[] }>()

const { VITE_BASE_PHOTO_URL } = import.meta.env
</script>

<template>
  <div class="image-gallery-container flex justify-start items-center flex-wrap">
    <img
      v-for="post in posts"
      :key="post.url"
      :src="`${VITE_BASE_PHOTO_URL}${post.url}`"
      class="m-[5px] w-52"
    />
  </div>
</template>
