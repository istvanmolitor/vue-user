# User Package - Frontend
Vue 3 + TypeScript komponensek és szolgáltatások felhasználó kezeléshez és autentikációhoz.
## Funkciók
- ✅ Bejelentkezés és regisztráció
- ✅ Jelszó visszaállítás
- ✅ Token alapú autentikáció (Laravel Sanctum)
- ✅ **Jogosultság kezelés (Permission Management)**
- ✅ Felhasználói csoportok kezelése
- ✅ Felhasználók, csoportok és jogosultságok CRUD
## 🔐 Jogosultság Kezelés (Új!)
A package most már teljes körű permission management-et biztosít.
### Gyors Start
#### 1. Composable használata
```vue
<script setup lang="ts">
import { usePermissions } from '@user/composables/usePermissions'
const { can, cannot, hasAllPermissions } = usePermissions()
</script>
<template>
  <button v-if="can('edit-user')">Szerkesztés</button>
  <p v-if="cannot('delete-user')">Nincs törlési jogod</p>
</template>
```
#### 2. Direktíva használata
```vue
<template>
  <!-- Egy jogosultság -->
  <button v-can="'edit-user'">Szerkesztés</button>
  <!-- Bármelyik jogosultság -->
  <button v-can="['edit-user', 'delete-user']">Műveletek</button>
  <!-- Összes jogosultság -->
  <button v-can.all="['edit-user', 'delete-user']">Admin</button>
</template>
```
#### 3. Service használata
```typescript
import { authService } from '@user/services/authService'
if (authService.hasPermission('edit-user')) {
  // Szerkesztési logika
}
// Több jogosultság
if (authService.hasAllPermissions(['edit-user', 'delete-user'])) {
  // Admin logika
}
```
### Permission API
#### usePermissions Composable
```typescript
const {
  permissions,        // Computed<string[]> - összes jogosultság
  hasPermission,      // (permission: string) => boolean
  hasAllPermissions,  // (permissions: string[]) => boolean
  hasAnyPermission,   // (permissions: string[]) => boolean
  can,                // Alias: hasPermission
  cannot              // Negált hasPermission
} = usePermissions()
```
#### authService Metódusok
```typescript
authService.getPermissions(): string[]
authService.hasPermission(permission: string): boolean
authService.hasAllPermissions(permissions: string[]): boolean
authService.hasAnyPermission(permissions: string[]): boolean
```
#### Direktívák
- `v-can="'permission'"` - Elem megjelenítése jogosultság alapján
- `v-can="['perm1', 'perm2']"` - Bármelyik jogosultság
- `v-can.all="['perm1', 'perm2']"` - Összes jogosultság
- `v-cannot="'permission'"` - Elem megjelenítése ha NINCS jogosultság
### Példák
Nézd meg a `/views/PermissionExample.vue` fájlt részletes példákért!
## Services
### authService
Autentikációs szolgáltatás token kezeléssel és permission támogatással.
```typescript
import { authService } from '@user/services/authService'
// Bejelentkezés
await authService.login({ email, password })
// Jogosultság ellenőrzés
const canEdit = authService.hasPermission('edit-user')
```
### userService, userGroupService, permissionService
Lista nézetek szűréssel, lapozással és rendezéssel.
## Típusok
```typescript
import type { 
  User,
  LoginCredentials,
  UserGroup,
  Permission
} from '@user'
```
## Dokumentáció
Részletes dokumentáció: `/PERMISSION_MANAGEMENT.md`
