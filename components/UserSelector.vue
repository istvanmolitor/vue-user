<script setup lang="ts">
import UserSelecton from './UserSelecton.vue'

interface Props {
  modelValue?: number | null
  id?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()
</script>

<template>
  <UserSelecton
    v-bind="$props"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

