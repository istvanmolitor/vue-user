<script setup lang="ts">
/**
 * Példa komponens a jogosultság kezelés használatára
 *
 * Ez a fájl bemutatja, hogyan lehet használni a permission rendszert
 * Vue 3 komponensekben.
 */
import { usePermissions } from '../composables/usePermissions'
import { authService } from '../services/authService'
import Button from '@admin/components/ui/Button.vue'

// Composable használata
const {
  permissions,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  can,
  cannot
} = usePermissions()

// Példa metódusok
const handleEdit = () => {
  // JavaScript kódban való ellenőrzés
  if (authService.hasPermission('edit-user')) {
    console.log('Szerkesztési művelet végrehajtása...')
    // Szerkesztési logika
  } else {
    alert('Nincs jogosultságod ehhez a művelethez!')
  }
}

const handleDelete = () => {
  // Composable használata
  if (can('delete-user')) {
    console.log('Törlési művelet végrehajtása...')
    // Törlési logika
  }
}

const handleAdminAction = () => {
  // Több jogosultság ellenőrzése - mindegyik szükséges
  if (hasAllPermissions(['edit-user', 'delete-user', 'manage-permissions'])) {
    console.log('Admin művelet végrehajtása...')
    // Admin logika
  }
}

const handleModeratorAction = () => {
  // Több jogosultság ellenőrzése - bármelyik elég
  if (hasAnyPermission(['edit-user', 'moderate-content'])) {
    console.log('Moderátori művelet végrehajtása...')
    // Moderátori logika
  }
}

// Debug: nézd meg az összes jogosultságot
console.log('User permissions:', permissions.value)
console.log('Can edit user?', can('edit-user'))
console.log('Cannot delete user?', cannot('delete-user'))
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Permission Management - Példa</h1>

    <!-- 1. Composable használata v-if-fel -->
    <div class="border p-4 rounded">
      <h2 class="font-semibold mb-2">1. Composable használata (v-if)</h2>

      <div class="space-x-2">
        <Button v-if="can('edit-user')" @click="handleEdit">
          Szerkesztés
        </Button>

        <Button v-if="can('delete-user')" variant="destructive" @click="handleDelete">
          Törlés
        </Button>

        <Button v-if="hasAllPermissions(['edit-user', 'delete-user'])" @click="handleAdminAction">
          Admin Művelet
        </Button>

        <Button v-if="hasAnyPermission(['edit-user', 'moderate-content'])" @click="handleModeratorAction">
          Moderátori Művelet
        </Button>
      </div>

      <p v-if="cannot('edit-user')" class="text-red-600 mt-2">
        Nincs jogosultságod szerkesztéshez
      </p>
    </div>

    <!-- 2. v-can direktíva használata -->
    <div class="border p-4 rounded">
      <h2 class="font-semibold mb-2">2. v-can direktíva használata</h2>

      <div class="space-x-2">
        <!-- Egy jogosultság -->
        <Button v-can="'edit-user'" @click="handleEdit">
          Szerkesztés (v-can)
        </Button>

        <!-- Bármelyik jogosultság -->
        <Button v-can="['edit-user', 'delete-user']" variant="outline">
          Bármelyik jogosultság
        </Button>

        <!-- Összes jogosultság -->
        <Button v-can.all="['edit-user', 'delete-user', 'manage-permissions']">
          Összes jogosultság szükséges
        </Button>
      </div>
    </div>

    <!-- 3. v-cannot direktíva használata -->
    <div class="border p-4 rounded">
      <h2 class="font-semibold mb-2">3. v-cannot direktíva használata</h2>

      <div class="space-y-2">
        <p v-cannot="'edit-user'" class="text-yellow-600">
          ⚠️ Nincs szerkesztési jogosultságod
        </p>

        <p v-cannot="'delete-user'" class="text-yellow-600">
          ⚠️ Nincs törlési jogosultságod
        </p>

        <p v-cannot="'manage-permissions'" class="text-red-600">
          ⚠️ Nincs jogosultság kezelési jogod
        </p>
      </div>
    </div>

    <!-- 4. Jogosultságok listázása -->
    <div class="border p-4 rounded">
      <h2 class="font-semibold mb-2">4. Felhasználó jogosultságai</h2>

      <div v-if="permissions.length > 0" class="space-y-2">
        <p class="text-sm text-gray-600">
          Összesen {{ permissions.length }} jogosultság
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="permission in permissions"
            :key="permission"
            class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
          >
            {{ permission }}
          </span>
        </div>
      </div>

      <p v-else class="text-gray-500">
        Nincs jogosultság a felhasználóhoz rendelve
      </p>
    </div>

    <!-- 5. Összetett példa -->
    <div class="border p-4 rounded">
      <h2 class="font-semibold mb-2">5. Összetett példa - Felhasználó kártya</h2>

      <div class="bg-gray-50 p-4 rounded">
        <h3 class="font-medium mb-2">John Doe</h3>
        <p class="text-sm text-gray-600 mb-4">john@example.com</p>

        <div class="flex gap-2">
          <!-- Csak edit jogosultsággal -->
          <Button v-can="'edit-user'" size="sm" variant="outline">
            Szerkesztés
          </Button>

          <!-- Csak delete jogosultsággal -->
          <Button v-can="'delete-user'" size="sm" variant="destructive">
            Törlés
          </Button>

          <!-- Edit ÉS manage-permissions jogosultsággal -->
          <Button v-can.all="['edit-user', 'manage-permissions']" size="sm">
            Jogosultságok kezelése
          </Button>

          <!-- Edit VAGY view-profile jogosultsággal -->
          <Button v-can="['edit-user', 'view-profile']" size="sm" variant="ghost">
            Profil megtekintése
          </Button>
        </div>

        <!-- Figyelmeztetés, ha nincs delete jogosultság -->
        <p v-cannot="'delete-user'" class="text-xs text-yellow-600 mt-2">
          A felhasználó törlése csak admin jogosultsággal lehetséges
        </p>
      </div>
    </div>

    <!-- 6. JavaScript használat példa -->
    <div class="border p-4 rounded">
      <h2 class="font-semibold mb-2">6. JavaScript kód használat</h2>

      <pre class="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto"><code>// authService használata
if (authService.hasPermission('edit-user')) {
  // Művelet végrehajtása
}

// Composable használata
const { can } = usePermissions()
if (can('edit-user')) {
  // Művelet végrehajtása
}

// Több jogosultság - bármelyik
if (authService.hasAnyPermission(['edit-user', 'delete-user'])) {
  // Legalább egy megvan
}

// Több jogosultság - összes
if (authService.hasAllPermissions(['edit-user', 'delete-user'])) {
  // Mind megvan
}</code></pre>
    </div>
  </div>
</template>
