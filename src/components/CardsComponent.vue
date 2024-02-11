<script setup lang="ts">
import type { TimeLinePost, User } from '@/types'
import CardComponent from './CardComponent.vue'
import { supabase } from '@/superbase'
import { onMounted, ref } from 'vue'
import IntersectionObserver from './IntersectionObserver.vue'

const props = defineProps<{ user: User }>()

const posts = ref<TimeLinePost[]>([])
const lastCardIndex = ref<number>(3)
const ownerIds = ref<number[] | undefined>()
const reachEnd = ref<boolean>(false)

const fetchData = async () => {
  const { data: followings } = await supabase
    .from('followers_following')
    .select('following_id')
    .eq('follower_id', props.user.id)

  ownerIds.value = followings?.map((following) => following.following_id)

  if (ownerIds.value) {
    const { data: postsData } = await supabase
      .from('posts')
      .select(`created_at, url, caption, id, owner_id, users(username)`)
      .in('owner_id', ownerIds.value)
      .range(0, lastCardIndex.value)
      .order('created_at', { ascending: false })

    if (postsData) posts.value = postsData
  }
}

const fetchNextSet = async () => {
  if (!reachEnd.value) {
    if (ownerIds.value) {
      const { data: postsData } = await supabase
        .from('posts')
        .select(`created_at, url, caption, id, owner_id, users(username)`)
        .in('owner_id', ownerIds.value)
        .range(lastCardIndex.value + 1, lastCardIndex.value + 4)
        .order('created_at', { ascending: false })

      if (postsData) posts.value = [...posts.value, ...postsData]

      lastCardIndex.value += 4

      if (!postsData?.length) {
        reachEnd.value = true
      }
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="timeline-container py-5 px-0 flex flex-col items-center">
    <CardComponent v-for="post in posts" :key="post.id" :post="post" />
    <IntersectionObserver v-if="posts.length" @intersect="fetchNextSet" />
  </div>
</template>
