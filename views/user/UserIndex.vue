<script setup lang="ts">
import { AdminLayout } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { userService, type User } from '../../services/userService.ts'
const router = useRouter()
const users = ref<User[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})
const columns: Column<User>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'email_verified', label: 'Státusz', sortable: false, width: '150px' },
]
const fetchUsers = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await userService.getAll(params)
    users.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba a felhasználók betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}
const deleteUser = async (id: number) => {
  try {
    await userService.delete(id)
    await fetchUsers({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba a felhasználó törlésekor:', error)
  }
}
const editUser = (id: number) => {
  router.push(`/users/${id}/edit`)
}

onMounted(() => {
  fetchUsers({
    page: 1,
    sort: 'name',
    direction: 'asc'
  })
})
</script>
<template>
  <AdminLayout pageTitle="Felhasználók">
    <DataTable
      :columns="columns"
      :data="users"
      :loading="isLoading"
      :pagination="pagination"
      :searchable="true"
      search-placeholder="Keresés név vagy email alapján..."
      default-sort="name"
      default-direction="asc"
      @fetch="fetchUsers"
    >
      <template #actions>
        <CreateButton to="/users/create">
          Új felhasználó
        </CreateButton>
      </template>
      <template #cell-email_verified="{ row }">
        <span v-if="row.email_verified" class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
          Verified
        </span>
        <span v-else class="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
          Not Verified
        </span>
      </template>
      <template #row-actions="{ row }">
        <div class="flex items-center gap-2">
          <EditButton
            @click="editUser(row.id!)"
          />
          <DeleteButton
            @confirm="deleteUser(row.id!)"
          />
        </div>
      </template>
      <template #empty>
        Nincs megjeleníthető felhasználó.
      </template>
    </DataTable>
  </AdminLayout>
</template>
