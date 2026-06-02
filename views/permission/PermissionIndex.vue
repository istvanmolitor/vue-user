<script setup lang="ts">
import { AdminLayout } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
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
  { key: 'name', label: 'Név', sortable: true },
  { key: 'permission_group', label: 'Csoport', sortable: false },
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

onMounted(() => {
  fetchPermissions({
    page: 1,
    sort: 'name',
    direction: 'asc'
  })
})

const deletePermission = async (id: number) => {

  try {
    await permissionService.delete(id)
    const currentPage = Array.isArray(pagination.value.current_page)
      ? (pagination.value.current_page[0] ?? 1)
      : pagination.value.current_page
    await fetchPermissions({ page: currentPage })
  } catch (error) {
    console.error('Hiba a jogosultság törlésekor:', error)
  }
}

const editPermission = (id: number) => {
  router.push(`/admin/permission/${id}/edit`)
}
</script>

<template>
  <AdminLayout pageTitle="Jogosultságok">
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
        <CreateButton to="/admin/permission/create">
          Új jogosultság
        </CreateButton>
      </template>

      <template #cell-description="{ row }">
        <div>
          <div v-if="row.description" class="text-sm">{{ row.description }}</div>
        </div>
      </template>

      <template #cell-permission_group="{ row }">
        <div v-if="row.permission_group?.name" class="text-sm">
          {{ row.permission_group.name }}
        </div>
        <div v-else class="text-sm text-muted-foreground">-</div>
      </template>

      <template #cell-user_groups="{ row }">
        <div v-if="row.user_groups && row.user_groups.length > 0" class="text-sm">
          {{ row.user_groups.map(group => group.name).join(', ') }}
        </div>
        <div v-else class="text-sm text-muted-foreground">-</div>
      </template>

      <template #row-actions="{ row }">
        <EditButton
          @click="editPermission(row.id!)"
        />
        <DeleteButton
          @confirm="deletePermission(row.id!)"
        />
      </template>

      <template #empty>
        Nincs megjeleníthető jogosultság.
      </template>
    </DataTable>
  </AdminLayout>
</template>
