<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { usePermissions } from '../../composables/usePermissions'
import { userService } from '../../services/userService.ts'

const router = useRouter()
const { hasPermission } = usePermissions()
const canCreateUser = computed(() => hasPermission('user_create'))
const table = ref()

const deleteUser = async (id: number) => {
  try {
    await userService.delete(id)
    toastService.success('Felhasználó sikeresen törölve!')
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a felhasználó törlésekor:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const editUser = (id: number) => {
  router.push(`/admin/user/${id}/edit`)
}
</script>

<template>
  <AdminLayout pageTitle="Felhasználók">
    <DataTable
      ref="table"
      url="/api/admin/user/users"
    >
      <template #actions>
        <CreateButton v-if="canCreateUser" to="/admin/user/create">
          Új felhasználó
        </CreateButton>
      </template>
      <template #cell-email_verified="{ row }">
        <span v-if="(row as any).email_verified" class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
          Verified
        </span>
        <span v-else class="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
          Not Verified
        </span>
      </template>
      <template #row-actions="{ row }">
        <EditButton
          @click="editUser((row as any).id)"
        />
        <DeleteButton
          @confirm="deleteUser((row as any).id)"
        />
      </template>
      <template #empty>
        Nincs megjeleníthető felhasználó.
      </template>
    </DataTable>
  </AdminLayout>
</template>
