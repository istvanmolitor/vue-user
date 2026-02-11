<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService.ts'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Button from '@admin/components/ui/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import Input from '@admin/components/ui/Input.vue'

const router = useRouter()

const formData = reactive({
  email: ''
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const validationErrors = ref<{ [key: string]: string[] }>({})

const handleForgotPassword = async () => {
  try {
    loading.value = true
    error.value = null
    success.value = false
    validationErrors.value = {}

    await authService.forgotPassword(formData.email)

    success.value = true

    console.log('Password reset email sent to:', formData.email)
  } catch (err: any) {
    console.error('Forgot password error:', err)

    if (err.errors) {
      validationErrors.value = err.errors
      error.value = err.message || 'Validation error'
    } else {
      error.value = err.message || 'Failed to send password reset email. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const getFieldError = (field: string): string | null => {
  return validationErrors.value[field]?.[0] || null
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
    <Card class="w-full max-w-md shadow-2xl">
      <CardHeader class="space-y-1">
        <CardTitle class="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Forgot Password
        </CardTitle>
        <CardDescription class="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <form @submit.prevent="handleForgotPassword">
        <CardContent class="space-y-4">
          <!-- Success Message -->
          <div v-if="success" class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                  Email Sent Successfully!
                </h3>
                <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                  We've sent a password reset link to <strong>{{ formData.email }}</strong>.
                  Please check your inbox and follow the instructions.
                </p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error && !success" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="user@example.com"
              required
              :class="getFieldError('email') ? 'border-red-500' : ''"
              autocomplete="email"
              :disabled="success"
            />
            <p v-if="getFieldError('email')" class="text-sm text-red-600 dark:text-red-400">
              {{ getFieldError('email') }}
            </p>
          </div>

          <!-- Info Text -->
          <div v-if="!success" class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <svg class="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              The password reset link will be valid for 60 minutes.
            </p>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col space-y-4">
          <Button
            v-if="!success"
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl btn btn-primary"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending email...
            </span>
            <span v-else class="flex items-center justify-center">
              <Icon name="mail" :size="16" class="mr-2" />
              Send Reset Link
            </span>
          </Button>

          <Button
            v-else
            type="button"
            @click="success = false; formData.email = ''"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl btn btn-primary"
          >
            <Icon name="refresh" :size="16" class="mr-2" />
            Send Another Email
          </Button>

          <div class="flex items-center justify-center space-x-4 text-sm">
            <router-link to="/login" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
              Back to Login
            </router-link>
            <span class="text-gray-400">|</span>
            <router-link to="/register" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
              Create Account
            </router-link>
          </div>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
