<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService.ts'
import { AuthLayout } from "@admin"
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import InputField from '@admin/components/ui/InputField.vue'

const router = useRouter()

const formData = reactive({
  email: ''
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const validationErrors = ref<{ [key: string]: string[] }>({})

const isAdminRoute = computed(() => {
  return router.currentRoute.value.path.startsWith('/admin')
})

const loginPath = computed(() => {
  return isAdminRoute.value ? '/admin/login' : '/login'
})

const handleForgotPassword = async () => {
  try {
    loading.value = true
    error.value = null
    success.value = false
    validationErrors.value = {}

    await authService.forgotPassword(formData.email)

    success.value = true
  } catch (err: any) {
    if (err.errors) {
      validationErrors.value = err.errors
      error.value = err.message || 'Érvényesítési hiba'
    } else {
      error.value = err.message || 'Nem sikerült elküldeni a visszaállító e-mailt. Kérjük, próbálja újra.'
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
  <AuthLayout>
    <Card>
      <CardHeader class="space-y-1">
        <CardTitle class="text-center">
          Elfelejtett jelszó
        </CardTitle>
        <CardDescription class="text-center">
          Adja meg e-mail címét, és küldünk egy jelszó-visszaállító linket
        </CardDescription>
      </CardHeader>

      <form @submit.prevent="handleForgotPassword">
        <CardContent class="space-y-4">
          <!-- Sikeres üzenet -->
          <div v-if="success" class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div class="flex items-start">
              <Icon name="check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                  E-mail sikeresen elküldve!
                </h3>
                <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                  Elküldtük a jelszó-visszaállító linket a <strong>{{ formData.email }}</strong> címre.
                  Kérjük, ellenőrizze postaládáját és kövesse az utasításokat.
                </p>
              </div>
            </div>
          </div>

          <!-- Hibaüzenet -->
          <div v-if="error && !success" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- E-mail mező -->
          <InputField
            id="email"
            label="E-mail cím"
            v-model="formData.email"
            type="email"
            placeholder="felhasznalo@pelda.hu"
            required
            autocomplete="email"
            :disabled="success"
            :errors="validationErrors.email"
          />

          <!-- Tájékoztató szöveg -->
          <div v-if="!success" class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <Icon name="info" class="inline w-4 h-4 mr-1" />
              A jelszó-visszaállító link 60 percig érvényes.
            </p>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col space-y-4">
          <Button
            v-if="!success"
            type="submit"
            variant="primary"
            size="lg"
            :disabled="loading"
            class="w-full"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <Icon name="loading" class="animate-spin h-5 w-5" />
              Küldés...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Icon name="mail" :size="16" />
              Visszaállító link küldése
            </span>
          </Button>

          <Button
            v-else
            type="button"
            variant="primary"
            size="lg"
            class="w-full"
            @click="success = false; formData.email = ''"
          >
            <span class="flex items-center justify-center gap-2">
              <Icon name="refresh" :size="16" />
              Új e-mail küldése
            </span>
          </Button>

          <div class="flex items-center justify-center space-x-4 text-sm">
            <router-link :to="loginPath" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
              Vissza a bejelentkezéshez
            </router-link>
            <span class="text-gray-400">|</span>
            <router-link :to="isAdminRoute ? '/admin/register' : '/register'" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
              Fiók létrehozása
            </router-link>
          </div>
        </CardFooter>
      </form>
    </Card>
  </AuthLayout>
</template>
