<script setup lang="ts">
import { AdminLayout } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { permissionGroupService } from '../../services/permissionGroupService.ts'

const router = useRouter()
const table = ref()

const deletePermissionGroup = async (id: number) => {
  try {
    await permissionGroupService.delete(id)
    table.value?.refresh()
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
      ref="table"
      url="/api/admin/user/permission-groups"
    >
      <template #actions>
        <CreateButton to="/admin/permission-group/create">
          Új jogosultság csoport
        </CreateButton>
      </template>

      <template #cell-permissions_count="{ row }">
        <div class="text-sm">
          {{ (row as any).permissions_count ?? 0 }} db
        </div>
      </template>

      <template #row-actions="{ row }">
        <EditButton
          @click="editPermissionGroup((row as any).id)"
        />
        <DeleteButton
          @confirm="deletePermissionGroup((row as any).id)"
        />
      </template>

      <template #empty>
        Nincs megjeleníthető jogosultság csoport.
      </template>
    </DataTable>
  </AdminLayout>
</template>
