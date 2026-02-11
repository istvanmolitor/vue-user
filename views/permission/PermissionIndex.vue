<script setup lang="ts">
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Button from '@admin/components/ui/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { permissionService, type Permission } from '../../services/permissionService.ts'

const router = useRouter()
const permissions = ref<Permission[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const columns: Column<Permission>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'description', label: 'Leírás', sortable: false },
]

const fetchPermissions = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await permissionService.getAll(params)
    permissions.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba a jogosultságok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deletePermission = async (id: number) => {
  if (!confirm('Biztosan törölni szeretné ezt a jogosultságot?')) return

  try {
    await permissionService.delete(id)
    await fetchPermissions({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba a jogosultság törlésekor:', error)
  }
}

const editPermission = (id: number) => {
  router.push(`/permissions/${id}/edit`)
}
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold tracking-tight">Jogosultságok</h2>
    </div>

    <DataTable
      :columns="columns"
      :data="permissions"
      :loading="isLoading"
      :pagination="pagination"
      :searchable="true"
      search-placeholder="Keresés név vagy leírás alapján..."
      default-sort="name"
      default-direction="asc"
      @fetch="fetchPermissions"
    >
      <template #actions>
        <Button @click="router.push('/permissions/create')">
          <Icon name="plus" :size="16" class="mr-2" />
          Új jogosultság
        </Button>
      </template>

      <template #cell-description="{ row }">
        <div>
          <div v-if="row.description" class="text-sm">{{ row.description }}</div>
          <div v-if="row.user_groups && row.user_groups.length > 0" class="text-xs text-muted-foreground mt-1">
            Csoportok: {{ row.user_groups.length }} db
          </div>
        </div>
      </template>

      <template #row-actions="{ row }">
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" @click="editPermission(row.id!)">Szerkesztés</Button>
          <Button variant="destructive" size="sm" @click="deletePermission(row.id!)">Törlés</Button>
        </div>
      </template>

      <template #empty>
        Nincs megjeleníthető jogosultság.
      </template>
    </DataTable>
  </AdminLayout>
</template>
