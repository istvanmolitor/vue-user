<script setup lang="ts">
import { AdminLayout, BackButton, toastService, InputError, LoadingSpinner } from '@admin'
import InputField from '@admin/components/ui/InputField.vue'
import Label from '@admin/components/ui/Label.vue'
import Select from '@admin/components/ui/Select.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Checkboxes from '@admin/components/ui/Checkboxes.vue'
import { FormButtons } from '@admin'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { permissionService, type PermissionGroup, type UserGroup } from '../../services/permissionService.ts'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const availablePermissionGroups = ref<PermissionGroup[]>([])
const availableUserGroups = ref<UserGroup[]>([])
const errors = ref<Record<string, string[]>>({})

const form = reactive({
  permission_group_id: null as number | null,
  name: '',
  description: '',
  user_groups: [] as number[]
})

const fetchPermission = async () => {
  const id = route.params.id as string
  try {
    isLoading.value = true
    const { data } = await permissionService.getById(id)
    const permission = data.data

    form.permission_group_id = permission.permission_group?.id || null
    form.name = permission.name
    form.description = permission.description || ''
    form.user_groups = permission.user_groups?.map(g => g.id) || []

    availablePermissionGroups.value = data.permission_groups || []
    availableUserGroups.value = data.user_groups || []
  } catch (error) {
    console.error('Hiba a jogosultság betöltésekor:', error)
    router.push('/admin/permission')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  const id = route.params.id as string
  try {
    isSaving.value = true
    errors.value = {}
    await permissionService.update(id, {
      permission_group_id: form.permission_group_id,
      name: form.name,
      description: form.description || null,
      user_groups: form.user_groups
    })
    toastService.success('Jogosultság sikeresen frissítve!')
    router.push('/admin/permission')
  } catch (error: any) {
    console.error('Hiba a jogosultság frissítésekor:', error)
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
  fetchPermission()
})
</script>

<template>
  <AdminLayout pageTitle="Jogosultság szerkesztése">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <BackButton to="/admin/permission" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8"><LoadingSpinner label="Betöltés..." /></div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Jogosultság adatai</CardTitle>
        <CardDescription>Módosítsd a jogosultság adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="permission_group_id">Jogosultság csoport *</Label>
          <Select
            id="permission_group_id"
            v-model="form.permission_group_id"
            :options="availablePermissionGroups"
            value-field="id"
            label-field="name"
            placeholder="Válassz permission groupot"
          />
          <RouterLink to="/admin/permission-group" class="inline-block text-xs text-primary hover:underline">
            Jogosultság csoportok listája
          </RouterLink>
          <InputError :message="errors.permission_group_id" />
        </div>
        <InputField id="name" label="Név" v-model="form.name" placeholder="Pl. users.create" :required="true" :errors="errors.name" />
        <div class="space-y-2">
          <Label for="description">Leírás</Label>
          <Textarea id="description" v-model="form.description" placeholder="Opcionális leírás..." :rows="3" />
          <InputError :message="errors.description" />
        </div>

        <Checkboxes
          v-model="form.user_groups"
          :items="availableUserGroups"
          label="Felhasználói csoportok"
          empty-message="Nincsenek elérhető felhasználói csoportok."
          id-prefix="group"
        />
        <InputError :message="errors.user_groups" />
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="router.push('/admin/permission')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
