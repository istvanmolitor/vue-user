<script setup lang="ts">
import { AdminLayout } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { permissionGroupService, type PermissionGroup } from '../../services/permissionGroupService.ts'

const router = useRouter()
const permissionGroups = ref<PermissionGroup[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const columns: Column<PermissionGroup>[] = [
  { key: 'name', label: 'Név', sortable: true },
  { key: 'permissions_count', label: 'Jogosultságok száma', sortable: false },
]

const fetchPermissionGroups = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await permissionGroupService.getAll(params)
    permissionGroups.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba a jogosultság csoportok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPermissionGroups({
    page: 1,
    sort: 'name',
    direction: 'asc'
  })
})

const deletePermissionGroup = async (id: number) => {
  try {
    await permissionGroupService.delete(id)
    const currentPage = Array.isArray(pagination.value.current_page)
      ? (pagination.value.current_page[0] ?? 1)
      : pagination.value.current_page
    await fetchPermissionGroups({ page: currentPage })
  } catch (error) {
    console.error('Hiba a jogosultság csoport törlésekor:', error)
  }
}

const editPermissionGroup = (id: number) => {
  router.push(`/admin/permission-group/${id}/edit`)
}
</script>

<template>
  <AdminLayout pageTitle="Jogosultság csoportok">
    <DataTable
      :columns="columns"
      :data="permissionGroups"
      :loading="isLoading"
      :pagination="pagination"
      :searchable="true"
      search-placeholder="Keresés név alapján..."
      default-sort="name"
      default-direction="asc"
      @fetch="fetchPermissionGroups"
    >
      <template #actions>
        <CreateButton to="/admin/permission-group/create">
          Új jogosultság csoport
        </CreateButton>
      </template>

      <template #cell-permissions_count="{ row }">
        <div class="text-sm">
          {{ row.permissions_count ?? 0 }} db
        </div>
      </template>

      <template #row-actions="{ row }">
        <EditButton
          @click="editPermissionGroup(row.id!)"
        />
        <DeleteButton
          @confirm="deletePermissionGroup(row.id!)"
        />
      </template>

      <template #empty>
        Nincs megjeleníthető jogosultság csoport.
      </template>
    </DataTable>
  </AdminLayout>
</template>
