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
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  device_name: 'web_browser'
})

const loading = ref(false)
const error = ref<string | null>(null)
const validationErrors = ref<{ [key: string]: string[] }>({})

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = null
    validationErrors.value = {}

    const response = await authService.register(formData)

    console.log('Registration successful:', response.user)

    // Redirect to dashboard or home
    router.push('/dashboard')
  } catch (err: any) {
    console.error('Registration error:', err)

    if (err.errors) {
      validationErrors.value = err.errors
      error.value = err.message || 'Validation error'
    } else {
      error.value = err.message || 'Registration failed. Please try again.'
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
          Create Account
        </CardTitle>
        <CardDescription class="text-center">
          Fill in the details to create your account
        </CardDescription>
      </CardHeader>

      <form @submit.prevent="handleRegister">
        <CardContent class="space-y-4">
          <!-- Error Message -->
          <div v-if="error" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Name Field -->
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <Input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="John Doe"
              required
              :class="getFieldError('name') ? 'border-red-500' : ''"
              autocomplete="name"
            />
            <p v-if="getFieldError('name')" class="text-sm text-red-600 dark:text-red-400">
              {{ getFieldError('name') }}
            </p>
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="user@example.com"
              required
              :class="getFieldError('email') ? 'border-red-500' : ''"
              autocomplete="email"
            />
            <p v-if="getFieldError('email')" class="text-sm text-red-600 dark:text-red-400">
              {{ getFieldError('email') }}
            </p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="••••••••"
              required
              :class="getFieldError('password') ? 'border-red-500' : ''"
              autocomplete="new-password"
            />
            <p v-if="getFieldError('password')" class="text-sm text-red-600 dark:text-red-400">
              {{ getFieldError('password') }}
            </p>
          </div>

          <!-- Password Confirmation Field -->
          <div class="space-y-2">
            <label for="password_confirmation" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <Input
              id="password_confirmation"
              v-model="formData.password_confirmation"
              type="password"
              placeholder="••••••••"
              required
              :class="getFieldError('password_confirmation') ? 'border-red-500' : ''"
              autocomplete="new-password"
            />
            <p v-if="getFieldError('password_confirmation')" class="text-sm text-red-600 dark:text-red-400">
              {{ getFieldError('password_confirmation') }}
            </p>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              type="checkbox"
              required
              class="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label for="terms" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
              I agree to the
              <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms and Conditions</a>
              and
              <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>
            </label>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col space-y-4">
          <Button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl btn btn-primary"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
            <span v-else class="flex items-center justify-center">
              <Icon name="pen-line" :size="16" class="mr-2" />
              Create Account
            </span>
          </Button>

          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <router-link to="/login" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
              Sign in
            </router-link>
          </p>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
