<script setup lang="ts">
import { AdminLayout, BackButton, toastService, InputError } from '@admin'
import Input from '@admin/components/ui/Input.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
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
import { permissionService, type UserGroup } from '../../services/permissionService.ts'

const router = useRouter()
const isSaving = ref(false)
const isLoading = ref(true)
const availableUserGroups = ref<UserGroup[]>([])
const errors = ref<Record<string, string[]>>({})

const form = reactive({
  name: '',
  description: '',
  user_groups: [] as number[]
})

const fetchCreateData = async () => {
  try {
    isLoading.value = true
    const { data } = await permissionService.getCreateData()
    availableUserGroups.value = data.user_groups
  } catch (error) {
    console.error('Hiba az adatok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}
    await permissionService.create({
      name: form.name,
      description: form.description || null,
      user_groups: form.user_groups
    })
    toastService.success('Jogosultság sikeresen létrehozva!')
    router.push('/permissions')
  } catch (error: any) {
    console.error('Hiba a jogosultság létrehozásakor:', error)
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
  <AdminLayout pageTitle="Új jogosultság">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <BackButton to="/permissions" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Jogosultság adatai</CardTitle>
        <CardDescription>Add meg az új jogosultság adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium">Név *</label>
          <Input id="name" v-model="form.name" placeholder="Pl. users.create" />
          <InputError :message="errors.name" />
        </div>
        <div class="space-y-2">
          <label for="description" class="text-sm font-medium">Leírás</label>
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
          @cancel="router.push('/permissions')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
