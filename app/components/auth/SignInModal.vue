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
      content: 'w-full max-w-md overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form
        class="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[calc(100dvh-4rem)]"
        @submit.prevent="signIn"
      >
        <div class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Welcome back
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Sign in
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Continue your journey with St Luke's Anglican Church.
            </p>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close sign in"
            class="shrink-0 rounded-full"
            @click="open = false"
          />
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
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
        </div>

        <div class="shrink-0 border-t border-primary/10 px-6 py-4 sm:px-8">
          <UButton
            type="submit"
            label="Sign in"
            icon="i-lucide-arrow-right"
            trailing
            block
            size="xl"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
