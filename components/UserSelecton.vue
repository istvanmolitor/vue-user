<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { userService, type User } from '../services/userService'

interface Props {
  modelValue?: number | null
  id?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Valassz felhasznalot',
  searchPlaceholder: 'Kereses nevre vagy e-mail cimre...',
  emptyMessage: 'Nincs talalat.',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

interface UserSelectOption {
  id: number
  name: string
  email: string
}

const isOpen = ref(false)
const isLoading = ref(false)
const search = ref('')
const users = ref<UserSelectOption[]>([])
const selectedUser = ref<UserSelectOption | null>(null)
let searchTimeout: ReturnType<typeof setTimeout> | null = null
let usersRequestId = 0
let selectedUserRequestId = 0

const selectedLabel = computed(() => {
  if (selectedUser.value === null) {
    return ''
  }

  return `${selectedUser.value.name} (${selectedUser.value.email})`
})

const clearSearchTimeout = (): void => {
  if (searchTimeout !== null) {
    clearTimeout(searchTimeout)
    searchTimeout = null
  }
}

const normalizeUser = (user: User | null): UserSelectOption | null => {
  if (user === null || user.id === undefined) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

const fetchUsers = async (query: string): Promise<void> => {
  const requestId = ++usersRequestId
  isLoading.value = true

  try {
    const response = await userService.searchForSelect({
      search: query.trim().length > 0 ? query.trim() : undefined,
      per_page: 20,
    })

    if (requestId !== usersRequestId) {
      return
    }

    users.value = (response.data.data ?? [])
      .map((user) => normalizeUser(user))
      .filter((user): user is UserSelectOption => user !== null)
  } finally {
    if (requestId === usersRequestId) {
      isLoading.value = false
    }
  }
}

const fetchSelectedUser = async (userId: number): Promise<void> => {
  const requestId = ++selectedUserRequestId
  const existingUser = users.value.find((user) => user.id === userId)

  if (existingUser) {
    selectedUser.value = existingUser
    return
  }

  try {
    const response = await userService.getById(userId)

    if (requestId !== selectedUserRequestId) {
      return
    }

    selectedUser.value = normalizeUser(response.data.data)
  } catch {
    if (requestId === selectedUserRequestId) {
      selectedUser.value = null
    }
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (value === null || value === undefined) {
      selectedUser.value = null
      return
    }

    void fetchSelectedUser(value)
  },
  { immediate: true }
)

watch(search, () => {
  if (!isOpen.value) {
    return
  }

  clearSearchTimeout()
  searchTimeout = setTimeout(() => {
    void fetchUsers(search.value)
  }, 300)
})

onBeforeUnmount(() => {
  clearSearchTimeout()
})

const openSelect = (): void => {
  if (props.disabled) {
    return
  }

  isOpen.value = true
  clearSearchTimeout()
  void fetchUsers(search.value)
}

const closeSelect = (): void => {
  isOpen.value = false
  search.value = ''
  clearSearchTimeout()
}

const selectUser = (user: UserSelectOption): void => {
  emit('update:modelValue', user.id)
  selectedUser.value = user
  closeSelect()
}

const clearSelection = (): void => {
  emit('update:modelValue', null)
  selectedUser.value = null
  closeSelect()
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      :id="id"
      :disabled="disabled"
      class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      @click="openSelect"
    >
      <span v-if="selectedUser" class="truncate">{{ selectedLabel }}</span>
      <span v-else class="truncate text-muted-foreground">{{ placeholder }}</span>
      <span class="ml-2 shrink-0 text-xs text-muted-foreground">Kivalasztas</span>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md"
    >
      <div class="space-y-2 p-2">
        <input
          v-model="search"
          type="text"
          autofocus
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          :placeholder="searchPlaceholder"
        />

        <button
          type="button"
          class="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          @click="clearSelection"
        >
          Kivalasztas torlese
        </button>
      </div>

      <div class="max-h-72 overflow-y-auto border-t p-1">
        <div v-if="isLoading" class="px-3 py-2 text-sm text-muted-foreground">
          Betoltes...
        </div>

        <div v-else-if="users.length === 0" class="px-3 py-2 text-sm text-muted-foreground">
          {{ emptyMessage }}
        </div>

        <button
          v-for="user in users"
          :key="user.id"
          type="button"
          class="flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          :class="{ 'bg-accent text-accent-foreground': modelValue === user.id }"
          @click="selectUser(user)"
        >
          <span class="min-w-0 flex-1">
            <span class="block truncate font-medium">{{ user.name }}</span>
            <span class="block truncate text-xs text-muted-foreground">{{ user.email }}</span>
          </span>
        </button>
      </div>
    </div>

    <div v-if="isOpen" class="fixed inset-0 z-40" @click="closeSelect" />
  </div>
</template>


