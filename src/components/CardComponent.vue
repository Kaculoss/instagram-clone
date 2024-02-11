<script setup lang="ts">
import type { TimeLinePost } from '@/types'

defineProps<{ post: TimeLinePost }>()

const { VITE_BASE_PHOTO_URL } = import.meta.env
</script>

<template>
  <ACard hoverable style="width: 240px" class="card mb-5">
    <template #cover>
      <img alt="example" :src="`${VITE_BASE_PHOTO_URL}${post.url}`" />
    </template>
    <ACardMeta v-if="!Array.isArray(post.users)" :title="post.users.username">
      <template #description>{{ post.caption }}</template>
    </ACardMeta>
  </ACard>
</template>
