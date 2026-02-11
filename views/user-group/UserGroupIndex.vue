<script setup lang="ts">
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Button from '@admin/components/ui/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { userGroupService, type UserGroup } from '../../services/userGroupService.ts'

const router = useRouter()
const userGroups = ref<UserGroup[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const columns: Column<UserGroup>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'description', label: 'Leírás', sortable: false },
]

const fetchUserGroups = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await userGroupService.getAll(params)
    userGroups.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba a felhasználói csoportok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteUserGroup = async (id: number) => {
  if (!confirm('Biztosan törölni szeretné ezt a felhasználói csoportot?')) return

  try {
    await userGroupService.delete(id)
    await fetchUserGroups({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba a felhasználói csoport törlésekor:', error)
  }
}

const editUserGroup = (id: number) => {
  router.push(`/user-groups/${id}/edit`)
}
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold tracking-tight">Felhasználói csoportok</h2>
    </div>

    <DataTable
      :columns="columns"
      :data="userGroups"
      :loading="isLoading"
      :pagination="pagination"
      :searchable="true"
      search-placeholder="Keresés név vagy leírás alapján..."
      default-sort="name"
      default-direction="asc"
      @fetch="fetchUserGroups"
    >
      <template #actions>
        <Button @click="router.push('/user-groups/create')">
          <Icon name="plus" :size="16" class="mr-2" />
          Új csoport
        </Button>
      </template>

      <template #cell-name="{ row }">
        <div class="flex items-center gap-2">
          <span class="font-medium">{{ row.name }}</span>
          <span v-if="row.is_default" class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
            Alapértelmezett
          </span>
        </div>
      </template>

      <template #cell-description="{ row }">
        <div>
          <div v-if="row.description" class="text-sm">{{ row.description }}</div>
          <div v-if="row.permissions && row.permissions.length > 0" class="text-xs text-muted-foreground mt-1">
            Jogosultságok: {{ row.permissions.length }} db
          </div>
        </div>
      </template>

      <template #row-actions="{ row }">
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" @click="editUserGroup(row.id!)">Szerkesztés</Button>
          <Button variant="destructive" size="sm" @click="deleteUserGroup(row.id!)">Törlés</Button>
        </div>
      </template>

      <template #empty>
        Nincs megjeleníthető felhasználói csoport.
      </template>
    </DataTable>
  </AdminLayout>
</template>
