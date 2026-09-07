import { ref } from "vue";
import { defineStore } from "pinia";

import { AuthService, type User } from "~/services/auth.service";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  const restoreSession = async () => {
    if (!import.meta.client) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const response = await AuthService.loginWithAccessToken(accessToken);
      user.value = response.data.user;
    } catch {
      localStorage.removeItem("accessToken");
      user.value = null;
    }
  };

  return { user, restoreSession };
});
