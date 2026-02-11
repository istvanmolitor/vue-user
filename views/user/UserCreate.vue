<script setup lang="ts">
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Button from '@admin/components/ui/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Checkboxes from '@admin/components/ui/Checkboxes.vue'
import FormButtons from '@admin/components/ui/FormButtons.vue'
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { userService, type UserGroup, type UserFormData } from '../../services/userService.ts'

const router = useRouter()
const isSaving = ref(false)
const isLoading = ref(true)
const availableUserGroups = ref<UserGroup[]>([])

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
    await userService.create(form)
    router.push('/users')
  } catch (error) {
    console.error('Hiba a felhasználó létrehozásakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/users')
}

onMounted(() => {
  fetchUserGroups()
})
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between space-y-2 mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Új felhasználó</h2>
      <Button variant="outline" @click="goBack">Vissza</Button>
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
          <label for="name" class="text-sm font-medium">Név</label>
          <Input id="name" v-model="form.name" placeholder="Minta János" />
        </div>
        <div class="space-y-2">
          <label for="email" class="text-sm font-medium">Email</label>
          <Input id="email" v-model="form.email" type="email" placeholder="janos@example.com" />
        </div>
        <Checkboxes
          v-model="form.user_groups"
          :items="availableUserGroups"
          label="Felhasználói csoportok"
          empty-message="Nincsenek elérhető felhasználói csoportok."
          id-prefix="group"
        />
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="goBack"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
