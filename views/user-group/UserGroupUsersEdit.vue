<script setup lang="ts">
import { AdminLayout, BackButton, toastService } from '@admin'
import Button from '@admin/components/ui/button/Button.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import Icon from '@admin/components/ui/Icon.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UserSelector from '../../components/UserSelector.vue'
import { userGroupService, type UserGroup } from '../../services/userGroupService'
import type { User } from '../../services/userService'

const route = useRoute()
const userGroupId = route.params.id as string

const userGroup = ref<UserGroup | null>(null)
const users = ref<User[]>([])
const selectedUserId = ref<number | null>(null)
const isLoading = ref(false)
const isAdding = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
})

const columns: Column<User>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'email', label: 'E-mail', sortable: true },
]

const fetchUserGroup = async (): Promise<void> => {
  const response = await userGroupService.getById(userGroupId)
  userGroup.value = response.data.data
}

const fetchUsers = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}): Promise<void> => {
  try {
    isLoading.value = true
    const response = await userGroupService.getUsers(userGroupId, params)
    users.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba a csoport felhasznaloinak betoltesekor:', error)
    toastService.error('Nem sikerult betolteni a csoport felhasznaloit.')
  } finally {
    isLoading.value = false
  }
}

const addUserToGroup = async (): Promise<void> => {
  if (selectedUserId.value === null) {
    toastService.error('Valassz ki egy felhasznalot a hozzaadashoz.')
    return
  }

  try {
    isAdding.value = true
    await userGroupService.attachUser(userGroupId, selectedUserId.value)
    selectedUserId.value = null
    toastService.success('A felhasznalo hozzaadasa sikerult.')
    await fetchUsers({ page: pagination.value.current_page as number })
  } catch (error) {
    console.error('Hiba a felhasznalo csoporthoz adasakor:', error)
    toastService.error('Nem sikerult a felhasznalot csoporthoz adni.')
  } finally {
    isAdding.value = false
  }
}

const removeUserFromGroup = async (userId: number): Promise<void> => {
  try {
    await userGroupService.detachUser(userGroupId, userId)
    toastService.success('A felhasznalo torolve lett a csoportbol.')
    await fetchUsers({ page: pagination.value.current_page as number })
  } catch (error) {
    console.error('Hiba a felhasznalo csoportbol torlesekor:', error)
    toastService.error('Nem sikerult a felhasznalot eltavolitani a csoportbol.')
  }
}

onMounted(async () => {
  await fetchUserGroup()
  await fetchUsers({ page: 1, sort: 'name', direction: 'asc' })
})
</script>

<template>
  <AdminLayout pageTitle="Csoport felhasznaloi">
    <div class="mb-4 flex items-center justify-between space-y-2">
      <BackButton to="/admin/user-group" />
    </div>

    <div class="mb-4 rounded-md border bg-card p-4">
      <div class="text-sm text-muted-foreground">Felhasznaloi csoport</div>
      <div class="mt-1 text-lg font-semibold">{{ userGroup?.name ?? '-' }}</div>
      <div v-if="userGroup?.description" class="mt-1 text-sm text-muted-foreground">
        {{ userGroup.description }}
      </div>
    </div>

    <div class="mb-4 rounded-md border bg-card p-4">
      <div class="mb-3 text-sm font-medium">Felhasznalo hozzaadasa</div>
      <div class="flex flex-col gap-3 md:flex-row">
        <div class="w-full">
          <UserSelector
            id="user-selector"
            v-model="selectedUserId"
            placeholder="Valassz felhasznalot"
          />
        </div>
        <Button
          type="button"
          variant="default"
          :disabled="isAdding"
          class="md:w-auto"
          @click="addUserToGroup"
        >
          <Icon name="plus" class="mr-2 h-4 w-4" />
          Hozzaadas
        </Button>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="users"
      :loading="isLoading"
      :pagination="pagination"
      :searchable="true"
      search-placeholder="Kereses nev vagy e-mail alapjan..."
      default-sort="name"
      default-direction="asc"
      @fetch="fetchUsers"
    >
      <template #row-actions="{ row }">
        <DeleteButton
          title="Felhasznalo eltavolitasa"
          message="Biztosan el szeretned tavolitani a felhasznalot ebbol a csoportbol?"
          confirm-text="Eltavolitas"
          @confirm="removeUserFromGroup(row.id!)"
        />
      </template>

      <template #empty>
        Nincsenek felhasznalok ebben a csoportban.
      </template>
    </DataTable>
  </AdminLayout>
</template>

