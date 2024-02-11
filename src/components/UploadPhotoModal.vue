<script lang="ts" setup>
import { useUserStore } from '@/stores/users'
import { supabase } from '@/superbase'
import type { Post } from '@/types'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { user } = storeToRefs(useUserStore())
const open = ref<boolean>(false)
const caption = ref<string>('')
const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)
const file = ref()

const props = defineProps<{
  addNewPost: (post: Post) => void
}>()

const showModal = () => {
  open.value = true
}

const handleOk = async () => {
  isLoading.value = true
  const fileName = Math.floor(Math.random() * 1000000000000000)
  if (file.value) {
    const { data, error } = await supabase.storage
      .from('images')
      .upload('public/' + fileName, file.value)

    if (error) {
      isLoading.value = false
      return (errorMessage.value = 'Unable to upload image')
    }

    if (data && user.value) {
      await supabase
        .from('posts')
        .insert({ url: data.path, caption: caption.value, owner_id: user.value.id })

      props.addNewPost({ url: data.path, caption: caption.value })
    }
  }
  isLoading.value = false
  open.value = false
  caption.value = ''
}

const handleUploadChange = ($event: Event) => {
  const target = $event.target as HTMLInputElement
  if (target && target.files) {
    file.value = target.files[0]
  }
}
</script>

<template>
  <div>
    <AButton @click="showModal">Upload Photo</AButton>
    <AModal v-model:open="open" title="Upload Photo" @ok="handleOk">
      <div v-if="!isLoading">
        <input
          type="file"
          accept=".jpeg,.png,.jpg"
          class="mt-8"
          @change="handleUploadChange($event)"
        />
        <AInput placeholder="Caption..." v-model:value="caption" :maxLength="50" class="mt-2.5" />
        <ATypographyText v-if="errorMessage" type="danger">{{ errorMessage }}</ATypographyText>
      </div>
      <div v-else class="spinner flex items-center justify-center"><ASpin /></div>
    </AModal>
  </div>
</template>
