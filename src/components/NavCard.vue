<script lang="ts" setup>
import ContainerCard from './ContainerCard.vue'
import AuthModal from './AuthModal.vue'

import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const router = useRouter()
const searchUsername = ref<string>('')

const { user, isLoadingUser } = storeToRefs(useUserStore())
const { handleLogout } = useUserStore()

const onSearch = () => {
  if (searchUsername.value) {
    router.push(`/profile/${searchUsername.value}`)
    searchUsername.value = ''
  }
}

const logout = async () => {
  await handleLogout()
  searchUsername.value = ''
  router.push('/')
}

const goToUserProfile = () => {
  if (user.value) {
    router.push(`/profile/${user.value.username}`)
  }
}
</script>

<template>
  <ALayoutHeader class="bg-slate-800 leading-[64px]">
    <ContainerCard>
      <div class="nav-container flex justify-between">
        <div class="right-content flex items-center">
          <RouterLink to="/" class="text-blue-400 no-underline mr-2.5">Instagram</RouterLink>
          <AInputSearch
            v-model:value="searchUsername"
            placeholder="username..."
            @search="onSearch"
            style="width: 200px"
            class="bg-white"
          />
        </div>
        <div v-if="!isLoadingUser" class="content flex items-center">
          <div v-if="!user" class="left-content flex items-center ml-2.5 gap-2.5">
            <AuthModal :isLogin="false" />
            <AuthModal :isLogin="true" />
          </div>
          <div v-else class="left-content flex items-center ml-2.5 gap-2.5">
            <AButton type="primary" @click="goToUserProfile">Profile</AButton>
            <AButton type="primary" @click="logout">Logout</AButton>
          </div>
        </div>
      </div>
    </ContainerCard>
  </ALayoutHeader>
</template>
