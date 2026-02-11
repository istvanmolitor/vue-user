<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.ts'
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Button from '@admin/components/ui/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'

const router = useRouter()
const { user, loading, logout, fetchUser } = useAuth()

const error = ref<string | null>(null)

onMounted(async () => {
  try {
    await fetchUser()
  } catch (err: any) {
    error.value = err.message || 'Failed to load user data'
  }
})

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (err: any) {
    error.value = err.message || 'Logout failed'
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Nincs megerősítve'
  return new Date(dateString).toLocaleDateString('hu-HU')
}
</script>

<template>
  <AdminLayout>
    <div>
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 rounded-lg bg-red-50 border border-red-200">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- User Profile -->
      <div v-else-if="user">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold tracking-tight">Profil</h2>
        </div>

        <Card class="shadow-xl">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="text-2xl font-bold">
                  Felhasználói adatok
                </CardTitle>
                <CardDescription>
                  A fiókod információi
                </CardDescription>
              </div>
              <Button
                @click="handleLogout"
                variant="destructive"
              >
                <Icon name="logout" :size="16" class="mr-2" />
                Kijelentkezés
              </Button>
            </div>
          </CardHeader>

          <CardContent class="space-y-6">
            <!-- User Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Név</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ user.name }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ user.email }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Email megerősítve</label>
                <p class="text-lg">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      user.email_verified
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    ]"
                  >
                    {{ user.email_verified ? 'Megerősítve' : 'Nincs megerősítve' }}
                  </span>
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Megerősítés időpontja</label>
                <p class="text-lg text-gray-700 dark:text-gray-300">
                  {{ formatDate(user.email_verified_at) }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Regisztráció dátuma</label>
                <p class="text-lg text-gray-700 dark:text-gray-300">
                  {{ formatDate(user.created_at) }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Felhasználó ID</label>
                <p class="text-lg text-gray-700 dark:text-gray-300">#{{ user.id }}</p>
              </div>
            </div>

            <!-- User Groups -->
            <div v-if="user.user_groups && user.user_groups.length > 0" class="space-y-3">
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Csoportok</label>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="group in user.user_groups"
                  :key="group.id"
                  class="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ group.name }}
                  <span v-if="group.is_default" class="ml-2 text-xs">(Alapértelmezett)</span>
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t">
              <Button variant="outline" @click="router.push('/users')">
                <Icon name="users" :size="16" class="mr-2" />
                Összes felhasználó
              </Button>
              <Button variant="outline" @click="fetchUser">
                <Icon name="refresh" :size="16" class="mr-2" />
                Frissítés
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </AdminLayout>
</template>
