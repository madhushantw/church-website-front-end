import { ref } from "vue";
import { defineStore } from "pinia";

import { AuthService, type User } from "~/services/auth.service";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const isRestoring = ref(false);
  const hasRestored = ref(false);

  const restoreSession = async () => {
    if (!import.meta.client || hasRestored.value || isRestoring.value) return;

    isRestoring.value = true;

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        const response = await AuthService.loginWithAccessToken(accessToken);
        user.value = response.data.user;
      }
    } catch {
      localStorage.removeItem("accessToken");
      user.value = null;
    } finally {
      isRestoring.value = false;
      hasRestored.value = true;
    }
  };

  const signOut = () => {
    localStorage.removeItem("accessToken");
    user.value = null;
  };

  const setSession = (accessToken: string, authenticatedUser: User) => {
    localStorage.setItem("accessToken", accessToken);
    user.value = authenticatedUser;
  };

  return {
    user,
    isRestoring,
    hasRestored,
    restoreSession,
    setSession,
    signOut,
  };
});
