import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Credentials, SignupCredentials, User } from '@/types'
import { supabase } from '@/superbase'

export const useUserStore = defineStore('users', () => {
  const user = ref<null | User>(null)
  const errorMessage = ref<string>('')
  const isLoading = ref<boolean>(false)
  const isLoadingUser = ref<boolean>(false)

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  const clearErrorMessage = () => {
    errorMessage.value = ''
  }

  const handleSignup = async (credentials: SignupCredentials) => {
    const { email, password, username } = credentials

    if (password.length < 6) return (errorMessage.value = 'Password length is too short')

    if (username.length < 4) return (errorMessage.value = 'Username length is too short')

    if (!validateEmail(email)) return (errorMessage.value = 'Email is invalid')

    isLoading.value = true

    const { data: userWithUsername } = await supabase
      .from('users')
      .select()
      .eq('username', username)
      .single()

    if (userWithUsername) {
      isLoading.value = false
      return (errorMessage.value = 'User already registered')
    }

    errorMessage.value = ''

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      isLoading.value = false
      return (errorMessage.value = error.message)
    }

    await supabase.from('users').insert({ username, email })

    const { data: newUser } = await supabase.from('users').select().eq('email', email).single()

    user.value = newUser

    isLoading.value = false
    errorMessage.value = ''
  }

  const handleLogin = async (credentials: Credentials) => {
    const { email, password } = credentials

    if (password.length < 1) return (errorMessage.value = 'Password cannot be empty')

    if (!validateEmail(email)) return (errorMessage.value = 'Email is invalid')

    isLoading.value = true

    const {error} = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      isLoading.value = false
      return (errorMessage.value = error.message)
    }

    const { data: existingUser } = await supabase.from('users').select().eq('email', email).single()

    user.value = existingUser

    isLoading.value = false
    errorMessage.value = ''
  }

  const getUser = async () => {
    isLoadingUser.value = true

    const {data} = await supabase.auth.getUser()

    if(!data.user)  {
      isLoadingUser.value = false
      return user.value = null
    }

    const { data: userWithEmail } = await supabase.from('users').select().eq('email', data.user?.email).single()

    user.value = userWithEmail

    isLoadingUser.value = false
  }

  const handleLogout = async() => {
    await supabase.auth.signOut()
    user.value = null
  }


  return {
    user,
    errorMessage,
    isLoading,
    isLoadingUser,
    clearErrorMessage,
    handleSignup,
    handleLogin,
    handleLogout,
    getUser
  }
})
