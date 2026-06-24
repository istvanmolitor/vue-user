<script setup lang="ts">
import { AdminLayout, BackButton, toastService, InputError } from '@admin'
import InputField from '@admin/components/ui/InputField.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import { FormButtons } from '@admin'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { permissionGroupService } from '../../services/permissionGroupService.ts'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = reactive({
  name: ''
})

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    const response: any = await permissionGroupService.create({
      name: form.name
    })

    toastService.success('Jogosultság csoport sikeresen létrehozva!')

    const createdPermissionGroupId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdPermissionGroupId !== undefined && createdPermissionGroupId !== null) {
      await router.push({
        name: 'admin-permission-group-edit',
        params: {
          id: String(createdPermissionGroupId),
        },
      })

      return
    }

    router.push('/admin/permission-group')
  } catch (error: any) {
    console.error('Hiba a jogosultság csoport létrehozásakor:', error)
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
</script>

<template>
  <AdminLayout pageTitle="Új jogosultság csoport">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <BackButton to="/admin/permission-group" />
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Jogosultság csoport adatai</CardTitle>
        <CardDescription>Add meg az új jogosultság csoport adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="name" label="Név" v-model="form.name" placeholder="Pl. Felhasználókezelés" :required="true" :errors="errors.name" />
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
