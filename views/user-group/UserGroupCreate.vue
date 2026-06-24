<script setup lang="ts">
import { AdminLayout, BackButton, toastService, InputError, LoadingSpinner } from '@admin'
import InputField from '@admin/components/ui/InputField.vue'
import Label from '@admin/components/ui/Label.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Checkboxes from '@admin/components/ui/Checkboxes.vue'
import { FormButtons } from '@admin'
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { userGroupService, type Permission } from '../../services/userGroupService.ts'

const router = useRouter()
const isSaving = ref(false)
const isLoading = ref(true)
const availablePermissions = ref<Permission[]>([])
const errors = ref<Record<string, string[]>>({})

const form = reactive({
  name: '',
  description: '',
  is_default: false,
  permissions: [] as number[]
})

const fetchCreateData = async () => {
  try {
    isLoading.value = true
    const response = await userGroupService.getCreateData()
    availablePermissions.value = response.data.permissions
  } catch (error) {
    console.error('Hiba a jogosultságok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}
    const response: any = await userGroupService.create({
      name: form.name,
      description: form.description || null,
      is_default: form.is_default,
      permissions: form.permissions
    })
    toastService.success('Felhasználói csoport sikeresen létrehozva!')

    const createdUserGroupId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdUserGroupId !== undefined && createdUserGroupId !== null) {
      await router.push({
        name: 'admin-user-group-edit',
        params: {
          id: String(createdUserGroupId),
        },
      })

      return
    }

    router.push('/admin/user-group')
  } catch (error: any) {
    console.error('Hiba a felhasználói csoport létrehozásakor:', error)
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
      toastService.error('Kérjük, javítsd a hibaüzeneteket.')
    } else {
      toastService.error('Hiba történt a mentés során.')
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchCreateData()
})
</script>

<template>
  <AdminLayout pageTitle="Új felhasználói csoport">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <BackButton to="/admin/user-group" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8"><LoadingSpinner label="Betöltés..." /></div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Csoport adatai</CardTitle>
        <CardDescription>Add meg az új felhasználói csoport adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="name" label="Név" v-model="form.name" placeholder="Pl. Adminisztrátorok" :required="true" :errors="errors.name" />
        <div class="space-y-2">
          <Label for="description">Leírás</Label>
          <Textarea id="description" v-model="form.description" placeholder="Opcionális leírás..." :rows="3" />
          <InputError :message="errors.description" />
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox id="is_default" v-model="form.is_default" />
          <Label for="is_default" variant="checkbox">
            Alapértelmezett csoport
          </Label>
        </div>

        <Checkboxes
          v-model="form.permissions"
          :items="availablePermissions"
          label="Jogosultságok"
          empty-message="Nincsenek elérhető jogosultságok."
          id-prefix="perm"
        />
        <InputError :message="errors.permissions" />
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="router.push('/admin/user-group')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
