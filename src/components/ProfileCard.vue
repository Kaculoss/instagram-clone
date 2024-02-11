<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import ContainerCard from './ContainerCard.vue'
import ImageGallery from './ImageGallery.vue'
import UserBar from './UserBar.vue'
import type { ProfileInfo, Post, User } from '@/types'
import { supabase } from '@/superbase'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const route = useRoute()

const posts = ref<Post[]>([])
const user = ref<User | null>(null)
const isLoading = ref<boolean>(false)
const isFollowing = ref<boolean>(false)

const profileInfo = reactive<ProfileInfo>({ followers: null, following: null, posts: null })

const { username } = route.params

const { user: loggedInUser } = storeToRefs(useUserStore())

const addNewPost = (post: Post) => {
  posts.value.unshift(post)
}

const fetchIsFollowing = async (follower_id: number) => {
  if (loggedInUser.value && loggedInUser.value.id !== follower_id) {
    const { data: followwingUser } = await supabase
      .from('followers_following')
      .select()
      .eq('follower_id', loggedInUser.value.id)
      .eq('following_id', follower_id)
      .single()

    if (followwingUser) isFollowing.value = true
    else isFollowing.value = false
  }
}

const updateIsFollowing = (follow: boolean) => {
  isFollowing.value = follow
}

const fetchFollowersCount = async () => {
  if (user.value) {
    const { count } = await supabase
      .from('followers_following')
      .select('*', { count: 'exact' })
      .eq('following_id', user.value.id)

    return count
  }
}

const fetchFollowingCount = async () => {
  if (user.value) {
    const { count } = await supabase
      .from('followers_following')
      .select('*', { count: 'exact' })
      .eq('follower_id', user.value.id)

    return count
  }
}

const fetchData = async () => {
  isLoading.value = true
  const { data: userData } = await supabase.from('users').select().eq('username', username).single()

  if (!userData) {
    isLoading.value = false
    return (user.value = null)
  }

  user.value = userData

  if (user.value) {
    fetchIsFollowing(user.value.id)

    profileInfo.followers = await fetchFollowersCount()
    profileInfo.following = await fetchFollowingCount()
    const { data: postData } = await supabase.from('posts').select().eq('owner_id', user.value.id)
    if (postData) {
      posts.value = postData
      profileInfo.posts = postData.length
    }
  }

  isLoading.value = false
}

watch(loggedInUser, () => {
  if (user.value) fetchIsFollowing(user.value.id)
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <ContainerCard>
    <div class="profile-container py-5 px-0" v-if="!isLoading">
      <div v-if="typeof $route.params.username === 'string'">
        <UserBar
          :key="$route.params.username"
          :profileUser="user"
          :userInfo="profileInfo"
          :addNewPost="addNewPost"
          :isFollowing="isFollowing"
          :updateIsFollowing="updateIsFollowing"
        />
        <ImageGallery :posts="posts" :key="$route.params.username" />
      </div>
    </div>
    <div v-else class="spinner flex items-center justify-center h-[85vh]"><ASpin /></div>
  </ContainerCard>
</template>
