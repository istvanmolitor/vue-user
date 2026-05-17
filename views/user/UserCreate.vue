<script setup lang="ts">
import { AdminLayout, BackButton, toastService, InputError } from '@admin'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
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
import { userService, type UserGroup, type UserFormData } from '../../services/userService.ts'

const router = useRouter()
const isSaving = ref(false)
const isLoading = ref(true)
const availableUserGroups = ref<UserGroup[]>([])
const errors = ref<Record<string, string[]>>({})

const form = reactive<UserFormData>({
  name: '',
  email: '',
  user_groups: []
})

const fetchUserGroups = async () => {
  try {
    isLoading.value = true
    const { data } = await userService.getCreateData()
    availableUserGroups.value = data.user_groups
  } catch (error) {
    console.error('Hiba a felhasználói csoportok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}
    const response: any = await userService.create(form)
    toastService.success('Felhasználó sikeresen létrehozva!')

    const createdUserId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdUserId !== undefined && createdUserId !== null) {
      await router.push({
        name: 'admin-user-edit',
        params: {
          id: String(createdUserId),
        },
      })

      return
    }

    router.push('/admin/user')
  } catch (error: any) {
    console.error('Hiba a felhasználó létrehozásakor:', error)
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
  fetchUserGroups()
})
</script>

<template>
  <AdminLayout pageTitle="Új felhasználó">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <BackButton to="/admin/user" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Felhasználói adatok</CardTitle>
        <CardDescription>Add meg az új felhasználó adatait a létrehozáshoz.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Név</Label>
          <Input id="name" v-model="form.name" placeholder="Minta János" />
          <InputError :message="errors.name" />
        </div>
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="form.email" type="email" placeholder="janos@example.com" />
          <InputError :message="errors.email" />
        </div>
        <div>
          <Checkboxes
            v-model="form.user_groups"
            :items="availableUserGroups"
            label="Felhasználói csoportok"
            empty-message="Nincsenek elérhető felhasználói csoportok."
            id-prefix="group"
          />
          <InputError :message="errors.user_groups" />
        </div>
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="router.push('/admin/user')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
