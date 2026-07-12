<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService.ts'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Label from '@admin/components/ui/Label.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import InputField from '@admin/components/ui/InputField.vue'

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

// Determine if we're in admin context
const isAdminRoute = computed(() => {
  return router.currentRoute.value.path.startsWith('/admin')
})

// Compute the correct login path based on context
const loginPath = computed(() => {
  return isAdminRoute.value ? '/admin/login' : '/login'
})

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = null
    validationErrors.value = {}

    const response = await authService.register(formData)

    console.log('Registration successful:', response.user)

    // Redirect to appropriate dashboard
    const redirectPath = isAdminRoute.value ? '/admin' : '/dashboard'
    router.push(redirectPath)
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
        <CardTitle class="text-center">
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
          <InputField
            id="name"
            label="Full Name"
            v-model="formData.name"
            type="text"
            placeholder="John Doe"
            required
            autocomplete="name"
            :errors="validationErrors.name"
          />

          <!-- Email Field -->
          <InputField
            id="email"
            label="Email"
            v-model="formData.email"
            type="email"
            placeholder="user@example.com"
            required
            autocomplete="email"
            :errors="validationErrors.email"
          />

          <!-- Password Field -->
          <InputField
            id="password"
            label="Password"
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="new-password"
            :errors="validationErrors.password"
          />

          <!-- Password Confirmation Field -->
          <InputField
            id="password_confirmation"
            label="Confirm Password"
            v-model="formData.password_confirmation"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="new-password"
            :errors="validationErrors.password_confirmation"
          />

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              type="checkbox"
              required
              class="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label for="terms" variant="checkbox" class="ml-2">
              I agree to the
              <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms and Conditions</a>
              and
              <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>
            </Label>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col space-y-4">
           <Button
             type="submit"
             :disabled="loading"
             class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl btn btn-primary"
           >
             <span v-if="loading" class="flex items-center justify-center">
               <Icon name="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
               Creating account...
             </span>
             <span v-else class="flex items-center justify-center">
               <Icon name="pen-line" :size="16" class="mr-2" />
               Create Account
             </span>
           </Button>

          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <router-link :to="loginPath" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
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
