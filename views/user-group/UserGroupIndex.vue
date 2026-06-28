<script setup lang="ts">
import { AdminLayout } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import Button from '@admin/components/ui/button/Button.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import Icon from '@admin/components/ui/Icon.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { userGroupService } from '../../services/userGroupService.ts'

const router = useRouter()
const table = ref()

const deleteUserGroup = async (id: number) => {
  try {
    await userGroupService.delete(id)
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a felhasználói csoport törlésekor:', error)
  }
}

const editUserGroup = (id: number) => {
  router.push(`/admin/user-group/${id}/edit`)
}

const editUserGroupUsers = (id: number) => {
  router.push(`/admin/user-group/${id}/users`)
}
</script>

<template>
  <AdminLayout pageTitle="Felhasználói csoportok">
    <DataTable
      ref="table"
      url="/api/admin/user/user-groups"
    >
      <template #actions>
        <CreateButton to="/admin/user-group/create">
          Új csoport
        </CreateButton>
      </template>

      <template #cell-name="{ row }">
        <div class="flex items-center gap-2">
          <span class="font-medium">{{ (row as any).name }}</span>
          <span v-if="(row as any).is_default" class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
            Alapértelmezett
          </span>
        </div>
      </template>

      <template #cell-description="{ row }">
        <div>
          <div v-if="(row as any).description" class="text-sm">{{ (row as any).description }}</div>
          <div v-if="(row as any).permissions && (row as any).permissions.length > 0" class="text-xs text-muted-foreground mt-1">
            Jogosultságok: {{ (row as any).permissions.length }} db
          </div>
        </div>
      </template>

      <template #row-actions="{ row }">
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            title="Csoport felhasznaloi"
            @click="editUserGroupUsers((row as any).id)"
          >
            <Icon name="user" class="h-4 w-4" />
          </Button>
          <EditButton
            @click="editUserGroup((row as any).id)"
          />
          <DeleteButton
            @confirm="deleteUserGroup((row as any).id)"
          />
        </div>
      </template>

      <template #empty>
        Nincs megjeleníthető felhasználói csoport.
      </template>
    </DataTable>
  </AdminLayout>
</template>
