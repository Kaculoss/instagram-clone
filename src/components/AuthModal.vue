<script lang="ts" setup>
import { useUserStore } from '@/stores/users'
import type { SignupCredentials } from '@/types'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'

const { errorMessage, isLoading, user } = storeToRefs(useUserStore())
const { handleSignup, clearErrorMessage, handleLogin } = useUserStore()

const userCredentials: SignupCredentials = reactive({ email: '', password: '', username: '' })

const props = defineProps<{ isLogin: boolean }>()

const title = props.isLogin ? 'Login' : 'Signup'

const open = ref<boolean>(false)

const showModal = () => {
  open.value = true
}

const clearUserCredentialInputs = () => {
  userCredentials.email = ''
  userCredentials.password = ''
  userCredentials.username = ''
  clearErrorMessage()

  open.value = false
}

const handleOk = async () => {
  if (props.isLogin) {
    await handleLogin({ password: userCredentials.password, email: userCredentials.email })
  } else {
    await handleSignup(userCredentials)
  }

  if (user.value) {
    clearUserCredentialInputs()
  }
}

const handleCancel = () => {
  clearErrorMessage()
  open.value = false
}
</script>

<template>
  <div>
    <AButton type="primary" @click="showModal" class="btn">{{ title }}</AButton>
    <AModal v-model:open="open" :title="title" @ok="handleOk">
      <template #footer>
        <AButton key="back" @click="handleCancel">Cancel</AButton>
        <AButton
          key="submit"
          :disabled="isLoading"
          :loading="isLoading"
          type="primary"
          @click="handleOk"
          >Submit</AButton
        >
      </template>
      <div v-if="!isLoading" class="input-container h-32">
        <AInput
          class="input mb-[5px]"
          v-if="!isLogin"
          placeholder="Username"
          v-model:value="userCredentials.username"
        />
        <AInput class="input mb-[5px]" placeholder="Email" v-model:value="userCredentials.email" />
        <AInput
          class="input mb-[5px]"
          placeholder="Password"
          type="password"
          v-model:value="userCredentials.password"
        />
      </div>
      <div v-else class="spinner flex items-center justify-center h-32">
        <ASpin />
      </div>
      <ATypographyText v-if="errorMessage" type="danger">{{ errorMessage }}</ATypographyText>
    </AModal>
  </div>
</template>
