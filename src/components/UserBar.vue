<script setup lang="ts">
import { useRoute } from 'vue-router'
import UploadPhotoModal from './UploadPhotoModal.vue'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import type { Post, ProfileInfo, User } from '@/types'
import { supabase } from '@/superbase'

const props = defineProps<{
  profileUser: User | null
  userInfo: ProfileInfo
  isFollowing: boolean
  addNewPost: (post: Post) => void
  updateIsFollowing: (follow: boolean) => void
}>()

const { user } = storeToRefs(useUserStore())

const route = useRoute()
const { username: profileUsername } = route.params

const followUnfollowUser = async () => {
  if (user.value && props.profileUser) {
    if (!props.isFollowing) {
      const { error } = await supabase.from('followers_following').insert({
        follower_id: user.value.id,
        following_id: props.profileUser.id
      })
      if (!error) props.updateIsFollowing(true)
    } else {
      const { error } = await supabase
        .from('followers_following')
        .delete()
        .eq('follower_id', user.value.id)
        .eq('following_id', props.profileUser.id)
      if (!error) props.updateIsFollowing(false)
    }
  }
}
</script>

<template>
  <div class="userbar-container pb-[75px]" v-if="profileUser">
    <div class="top-content flex justify-between items-center">
      <ATypographyTitle :level="2">{{ profileUser.username }}</ATypographyTitle>
      <div v-if="user">
        <UploadPhotoModal v-if="profileUsername === user.username" :addNewPost="addNewPost" />
        <AButton v-else @click="followUnfollowUser">{{
          isFollowing ? 'Following' : 'Follow'
        }}</AButton>
      </div>
    </div>
    <div class="bottom-content flex items-center">
      <ATypographyTitle :level="5" class="!m-0 p-0 !mr-[30px]"
        >{{ userInfo.posts }} posts</ATypographyTitle
      >
      <ATypographyTitle :level="5" class="!m-0 p-0 !mr-[30px]"
        >{{ userInfo.followers }} followers</ATypographyTitle
      >
      <ATypographyTitle :level="5" class="!m-0 p-0 !mr-[30px]"
        >{{ userInfo.following }} following</ATypographyTitle
      >
    </div>
  </div>
  <div v-else class="userbar-container pb-[75px]">
    <div class="top-content flex justify-between items-center">
      <ATypographyTitle :level="2">User Not Found</ATypographyTitle>
    </div>
  </div>
</template>
