<script setup lang="ts">
import ContainerCardVue from './ContainerCard.vue'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import CardsComponent from './CardsComponent.vue'
import LogInMessage from './LogInMessage.vue'

const { user, isLoadingUser } = storeToRefs(useUserStore())
</script>

<template>
  <ContainerCardVue>
    <div v-if="!isLoadingUser">
      <CardsComponent v-if="user" :user="user" />
      <LogInMessage v-else />
    </div>
    <div v-else class="spinner flex items-center justify-center h-[90vh]">
      <ASpin />
    </div>
  </ContainerCardVue>
</template>
