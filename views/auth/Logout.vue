<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.ts'

const router = useRouter()
const { logout } = useAuth()

onMounted(async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Even if logout fails on backend, redirect to login
    router.push('/login')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Kijelentkezés...</p>
    </div>
  </div>
</template>
