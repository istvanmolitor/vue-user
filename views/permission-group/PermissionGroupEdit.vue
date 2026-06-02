<script setup lang="ts">
import { AdminLayout, BackButton, toastService, InputError, LoadingSpinner } from '@admin'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import { FormButtons } from '@admin'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { permissionGroupService } from '../../services/permissionGroupService.ts'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const errors = ref<Record<string, string[]>>({})

const form = reactive({
  name: ''
})

const fetchPermissionGroup = async () => {
  const id = route.params.id as string

  try {
    isLoading.value = true
    const response = await permissionGroupService.getById(id)
    form.name = response.data.data.name
  } catch (error) {
    console.error('Hiba a jogosultság csoport betöltésekor:', error)
    router.push('/admin/permission-group')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  const id = route.params.id as string

  try {
    isSaving.value = true
    errors.value = {}
    await permissionGroupService.update(id, {
      name: form.name
    })

    toastService.success('Jogosultság csoport sikeresen frissítve!')
    router.push('/admin/permission-group')
  } catch (error: any) {
    console.error('Hiba a jogosultság csoport frissítésekor:', error)
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
      toastService.error(error.response.data?.message || 'Kérjük, javítsd a hibaüzeneteket.')
    } else {
      toastService.error('Hiba történt a mentés során.')
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchPermissionGroup()
})
</script>

<template>
  <AdminLayout pageTitle="Jogosultság csoport szerkesztése">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <BackButton to="/admin/permission-group" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8"><LoadingSpinner label="Betöltés..." /></div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Jogosultság csoport adatai</CardTitle>
        <CardDescription>Módosítsd a jogosultság csoport adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Név *</Label>
          <Input id="name" v-model="form.name" placeholder="Pl. Felhasználókezelés" />
          <InputError :message="errors.name" />
        </div>
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="router.push('/admin/permission-group')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
