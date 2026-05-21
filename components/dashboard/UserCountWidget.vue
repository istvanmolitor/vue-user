<script setup lang="ts">
import { onMounted, ref } from 'vue'
import StatsCard from '@admin/components/ui/StatsCard.vue'
import { userService } from '@user/services/userService'

const userCount = ref<number | string>('...')

async function loadUserCount(): Promise<void> {
  try {
    const response = await userService.getAll({ page: 1 })
    userCount.value = response.data.meta.total
  } catch {
    userCount.value = 'N/A'
  }
}

onMounted(() => {
  void loadUserCount()
})
</script>

<template>
  <StatsCard
    title="Felhasznalok"
    :value="userCount"
    icon="Users"
    description="Osszes regisztralt felhasznalo"
  />
</template>

