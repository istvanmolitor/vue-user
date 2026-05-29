<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService, type LoginCredentials } from '../../services/authService.ts'
import { AuthLayout, InputError } from "@admin"
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Label from '@admin/components/ui/Label.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import Input from '@admin/components/ui/Input.vue'

const router = useRouter()

const credentials = reactive<LoginCredentials>({
  email: '',
  password: '',
  device_name: 'web_browser'
})

const loading = ref(false)
const error = ref<string | null>(null)
const validationErrors = ref<{ [key: string]: string[] }>({})

// Determine if we're in admin context
const isAdminRoute = computed(() => {
  return router.currentRoute.value.path.startsWith('/admin')
})

// Compute the correct auth routes based on context
const forgotPasswordPath = computed(() => {
  return isAdminRoute.value ? '/admin/forgot-password' : '/forgot-password'
})

const registerPath = computed(() => {
  return isAdminRoute.value ? '/admin/register' : '/register'
})

const getFieldError = (field: string): string | null => {
  return validationErrors.value[field]?.[0] || null
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = null
    validationErrors.value = {}

    const response = await authService.login(credentials)

    console.log('Login successful:', response.user)

    // Redirect to appropriate dashboard
    const redirectPath = isAdminRoute.value ? '/admin' : '/dashboard'
    router.push(redirectPath)
  } catch (err: any) {
    console.error('Login error:', err)

    if (err.errors) {
      validationErrors.value = err.errors
      error.value = err.message || 'Validation error'
    } else {
      error.value = err.message || 'Login failed. Please check your credentials.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <Card>
      <CardHeader class="space-y-1">
        <CardTitle class="text-center">
          Welcome Back
        </CardTitle>
        <CardDescription class="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <form @submit.prevent="handleLogin">
        <CardContent class="space-y-4">
          <!-- Error Message -->
          <div v-if="error" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email">
              Email
            </Label>
            <Input
              id="email"
              v-model="credentials.email"
              type="email"
              placeholder="user@example.com"
              required
              :class="getFieldError('email') ? 'border-red-500' : ''"
              autocomplete="email"
            />
            <InputError :message="validationErrors.email" />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <Label for="password">
              Password
            </Label>
            <Input
              id="password"
              v-model="credentials.password"
              type="password"
              placeholder="••••••••"
              required
              :class="getFieldError('password') ? 'border-red-500' : ''"
              autocomplete="current-password"
            />
            <InputError :message="validationErrors.password" />
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label for="remember" class="ml-2 cursor-pointer">
                Remember me
              </Label>
            </div>
            <router-link :to="forgotPasswordPath" class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Forgot password?
            </router-link>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col space-y-4">
           <Button
             type="submit"
             variant="primary"
             size="lg"
             :disabled="loading"
             class="w-full"
           >
             <span v-if="loading" class="flex items-center justify-center gap-2">
               <Icon name="loading" class="animate-spin h-5 w-5" />
               Logging in...
             </span>
             <span v-else class="flex items-center justify-center gap-2">
               <Icon name="lock" :size="16" />
               Sign In
             </span>
           </Button>

          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <router-link :to="registerPath" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
              Sign up
            </router-link>
          </p>
        </CardFooter>
      </form>
    </Card>
  </AuthLayout>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
