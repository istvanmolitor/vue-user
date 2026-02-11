<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService, type ChangePasswordCredentials } from '@user/services/authService'
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Button from '@admin/components/ui/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import Input from '@admin/components/ui/Input.vue'
import Label from '@admin/components/ui/Label.vue'
import { Lock, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()

const formData = ref<ChangePasswordCredentials>({
  password: '',
  password_confirmation: ''
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const validationErrors = ref<Record<string, string[]>>({})

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  success.value = null
  validationErrors.value = {}

  try {
    const response = await authService.changePassword(formData.value)
    success.value = response.message || 'A jelszó sikeresen megváltozott.'

    // Reset form
    formData.value = {
      password: '',
      password_confirmation: ''
    }

    // Redirect to profile after 2 seconds
    setTimeout(() => {
      router.push('/profile')
    }, 2000)
  } catch (err: any) {
    if (err.errors) {
      validationErrors.value = err.errors
    } else {
      error.value = err.message || 'Hiba történt a jelszó módosítása során.'
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
  <AdminLayout>
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold tracking-tight">Jelszó módosítás</h2>
      </div>

      <Card class="shadow-xl">
        <CardHeader>
          <CardTitle class="text-2xl font-bold flex items-center gap-2">
            <Lock class="w-6 h-6" />
            Jelszó módosítása
          </CardTitle>
          <CardDescription>
            Add meg az új jelszót
          </CardDescription>
        </CardHeader>

        <CardContent>
          <!-- Success Message -->
          <div
            v-if="success"
            class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200"
          >
            <p class="text-green-600 font-medium">{{ success }}</p>
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200"
          >
            <p class="text-red-600 font-medium">{{ error }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">

            <!-- New Password -->
            <div class="space-y-2">
              <Label for="password">Új jelszó *</Label>
              <div class="relative">
                <Input
                  id="password"
                  v-model="formData.password"
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="Új jelszó"
                  required
                  :class="getFieldError('password') ? 'border-red-500' : ''"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <Eye v-if="!showNewPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
              <p v-if="getFieldError('password')" class="text-sm text-red-600">
                {{ getFieldError('password') }}
              </p>
              <p class="text-sm text-gray-500">
                A jelszónak legalább 8 karakter hosszúnak kell lennie
              </p>
            </div>

            <!-- Confirm Password -->
            <div class="space-y-2">
              <Label for="password_confirmation">Új jelszó megerősítése *</Label>
              <div class="relative">
                <Input
                  id="password_confirmation"
                  v-model="formData.password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Új jelszó megerősítése"
                  required
                  :class="getFieldError('password_confirmation') ? 'border-red-500' : ''"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
              <p v-if="getFieldError('password_confirmation')" class="text-sm text-red-600">
                {{ getFieldError('password_confirmation') }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                :disabled="loading"
                class="min-w-30 btn btn-primary"
              >
                <span v-if="loading" class="flex items-center">
                  <Icon name="loader" :size="16" class="mr-2 animate-spin" />
                  Mentés...
                </span>
                <span v-else class="flex items-center">
                  <Icon name="key" :size="16" class="mr-2" />
                  Jelszó módosítása
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                @click="router.push('/profile')"
                :disabled="loading"
              >
                <Icon name="x" :size="16" class="mr-2" />
                Mégse
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>
