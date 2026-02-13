import { ref, computed } from 'vue'
import { authService, type User } from '../services/authService'

const user = ref<User | null>(null)
const loading = ref(false)
const isAuthenticated = ref(false)

// Initialize from localStorage
const initAuth = () => {
    const storedUser = authService.getStoredUser()
    const token = authService.getToken()

    if (storedUser && token) {
        user.value = storedUser
        isAuthenticated.value = true
    }
}

// Initialize on first use
initAuth()

export function useAuth() {
    const login = async (email: string, password: string) => {
        loading.value = true
        try {
            const response = await authService.login({ email, password })
            user.value = response.user
            isAuthenticated.value = true
            return response
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        loading.value = true
        try {
            await authService.logout()
        } finally {
            user.value = null
            isAuthenticated.value = false
            loading.value = false
        }
    }

    const fetchUser = async () => {
        loading.value = true
        try {
            const userData = await authService.me()
            user.value = userData
            isAuthenticated.value = true
            return userData
        } finally {
            loading.value = false
        }
    }

    const checkAuth = () => {
        isAuthenticated.value = authService.isAuthenticated()
        if (!isAuthenticated.value) {
            user.value = null
        }
        return isAuthenticated.value
    }

    return {
        user: computed(() => user.value),
        loading: computed(() => loading.value),
        isAuthenticated: computed(() => isAuthenticated.value),
        login,
        logout,
        fetchUser,
        checkAuth,
    }
}
