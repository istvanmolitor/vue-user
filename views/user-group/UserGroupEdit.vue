<script setup lang="ts">
import { AdminLayout, BackButton, toastService, InputError } from '@admin'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
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
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { userGroupService, type Permission } from '../../services/userGroupService.ts'

const router = useRouter()
const route = useRoute()
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

const fetchUserGroup = async () => {
  const id = route.params.id as string
  try {
    isLoading.value = true
    const response = await userGroupService.getById(id)
    const userGroup = response.data.data

    form.name = userGroup.name
    form.description = userGroup.description || ''
    form.is_default = userGroup.is_default || false
    form.permissions = userGroup.permissions?.map(p => p.id) || []

    availablePermissions.value = response.data.permissions || []
  } catch (error) {
    console.error('Hiba a felhasználói csoport betöltésekor:', error)
    router.push('/user-groups')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  const id = route.params.id as string
  try {
    isSaving.value = true
    errors.value = {}
    await userGroupService.update(id, {
      name: form.name,
      description: form.description || null,
      is_default: form.is_default,
      permissions: form.permissions
    })
    toastService.success('Felhasználói csoport sikeresen frissítve!')
    router.push('/user-groups')
  } catch (error: any) {
    console.error('Hiba a felhasználói csoport frissítésekor:', error)
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
  fetchUserGroup()
})
</script>

<template>
  <AdminLayout pageTitle="Felhasználói csoport szerkesztése">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <BackButton to="/user-groups" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Csoport adatai</CardTitle>
        <CardDescription>Módosítsd a felhasználói csoport adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Név *</Label>
          <Input id="name" v-model="form.name" placeholder="Pl. Adminisztrátorok" />
          <InputError :message="errors.name" />
        </div>
        <div class="space-y-2">
          <Label for="description">Leírás</Label>
          <Textarea id="description" v-model="form.description" placeholder="Opcionális leírás..." :rows="3" />
          <InputError :message="errors.description" />
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox id="is_default" :checked="form.is_default" @update:checked="form.is_default = $event" />
          <Label for="is_default" class="cursor-pointer">
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
          @cancel="router.push('/user-groups')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
