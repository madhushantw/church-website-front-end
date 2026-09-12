<script setup lang="ts">
import { AuthService } from "~/services/auth.service";
import { useUserStore } from "~/stores/user.store";
import { CInput } from "../common";

const open = defineModel<boolean>("open", { default: false });
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const signInError = ref("");
const userStore = useUserStore();

const signIn = async () => {
  signInError.value = "";
  isLoading.value = true;

  try {
    const response = await AuthService.login({
      email: email.value,
      password: password.value,
    });

    userStore.setSession(response.data.accessToken, response.data.user);
    open.value = false;
    password.value = "";
  } catch {
    signInError.value = "Unable to sign in. Please check your details.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content: 'max-w-md rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form class="p-6 sm:p-8" @submit.prevent="signIn">
        <div class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Welcome back
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Sign in
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Continue your journey with Grace Community.
            </p>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close sign in"
            class="rounded-full"
            @click="open = false"
          />
        </div>

        <div class="space-y-4">
          <CInput
            v-model="email"
            type="email"
            placeholder="Email address"
            icon="i-lucide-mail"
            required
            class="w-full"
          />
          <CInput
            v-model="password"
            type="password"
            placeholder="Password"
            icon="i-lucide-lock-keyhole"
            required
            class="w-full"
          />
        </div>

        <p v-if="signInError" class="mt-4 text-sm text-red-600">
          {{ signInError }}
        </p>

        <UButton
          type="submit"
          label="Sign in"
          icon="i-lucide-arrow-right"
          trailing
          block
          size="xl"
          color="primary"
          class="mt-6 rounded-xl"
          :loading="isLoading"
        />
      </form>
    </template>
  </UModal>
</template>
