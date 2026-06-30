<script setup lang="ts">
import { onMounted, ref } from 'vue'
import StatsCard from '@admin/components/ui/StatsCard.vue'
import { userService } from '@user/services/userService'

const userCount = ref<number | string>('...')

async function loadUserCount(): Promise<void> {
  try {
    const response = await userService.getCount()
    userCount.value = response.data.count
  } catch {
    userCount.value = '0'
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

