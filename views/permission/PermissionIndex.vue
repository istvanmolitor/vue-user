<script setup lang="ts">
import { AdminLayout } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import Button from '@admin/components/ui/button/Button.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { permissionService, type PermissionGroup } from '../../services/permissionService.ts'

const router = useRouter()
const table = ref()
const permissionGroups = ref<PermissionGroup[]>([])
const selectedPermissionGroupId = ref<number | null>(null)

const loadPermissionGroups = async () => {
  try {
    const response = await permissionService.getAll({ per_page: 100 })
    permissionGroups.value = response.data.permission_groups || []
  } catch (error) {
    console.error('Hiba a jogosultság csoportok betöltésekor:', error)
  }
}

onMounted(() => {
  loadPermissionGroups()
})

const deletePermission = async (id: number) => {
  try {
    await permissionService.delete(id)
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a jogosultság törlésekor:', error)
  }
}

const selectPermissionGroup = (permissionGroupId: number | null) => {
  selectedPermissionGroupId.value = permissionGroupId
}

const editPermission = (id: number) => {
  router.push(`/admin/permission/${id}/edit`)
}
</script>

<template>
  <AdminLayout pageTitle="Jogosultságok">
    <div class="mb-4 border-b border-border pb-3">
      <div class="flex flex-wrap gap-2">
        <Button
          :variant="selectedPermissionGroupId === null ? 'default' : 'outline'"
          size="sm"
          @click="selectPermissionGroup(null)"
        >
          Összes
        </Button>
        <Button
          v-for="group in permissionGroups"
          :key="group.id"
          :variant="selectedPermissionGroupId === group.id ? 'default' : 'outline'"
          size="sm"
          @click="selectPermissionGroup(group.id)"
        >
          {{ group.name }}
        </Button>
      </div>
    </div>

    <DataTable
      ref="table"
      url="/api/admin/user/permissions"
      :extra-params="selectedPermissionGroupId ? { permission_group_id: selectedPermissionGroupId } : {}"
    >
      <template #actions>
        <CreateButton to="/admin/permission/create">
          Új jogosultság
        </CreateButton>
      </template>

      <template #cell-description="{ row }">
        <div>
          <div v-if="(row as any).description" class="text-sm">{{ (row as any).description }}</div>
        </div>
      </template>

      <template #cell-permission_group="{ row }">
        <div v-if="(row as any).permission_group?.name" class="text-sm">
          {{ (row as any).permission_group.name }}
        </div>
        <div v-else class="text-sm text-muted-foreground">-</div>
      </template>

      <template #cell-user_groups="{ row }">
        <div v-if="(row as any).user_groups && (row as any).user_groups.length > 0" class="text-sm">
          {{ (row as any).user_groups.map((group: any) => group.name).join(', ') }}
        </div>
        <div v-else class="text-sm text-muted-foreground">-</div>
      </template>

      <template #row-actions="{ row }">
        <EditButton
          @click="editPermission((row as any).id)"
        />
        <DeleteButton
          @confirm="deletePermission((row as any).id)"
        />
      </template>

      <template #empty>
        Nincs megjeleníthető jogosultság.
      </template>
    </DataTable>
  </AdminLayout>
</template>
