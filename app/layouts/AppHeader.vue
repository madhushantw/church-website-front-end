<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import LogoutConfirmModal from "~/components/auth/LogoutConfirmModal.vue";
import SignInModal from "~/components/auth/SignInModal.vue";
import UsersSidebar from "~/components/users/UsersSidebar.vue";
import { UserRole } from "~/services/users.service";
import { useUserStore } from "~/stores/user.store";

const route = useRoute();

const scrolled = ref(false);
const menuOpen = ref(false);
const signInOpen = ref(false);
const logoutOpen = ref(false);
const usersSidebarOpen = ref(false);
const userStore = useUserStore();
const isAuthenticated = computed(() => !!userStore.user);
const canManageUsers = computed(() => userStore.user?.role === UserRole.ROOT);

const openSignIn = () => {
  menuOpen.value = false;
  signInOpen.value = true;
};

const openLogout = () => {
  menuOpen.value = false;
  logoutOpen.value = true;
};

const items = computed<NavigationMenuItem[]>(() => {
  const isHome = route.path === "/";

  return [
    {
      label: "Home",
      href: isHome ? "#home" : "/",
    },
    {
      label: "About",
      href: isHome ? "#about" : "/#about",
    },
    {
      label: "Gospel",
      href: isHome ? "#gospel" : "/#gospel",
    },
    {
      label: "Sermons",
      href: isHome ? "#sermons" : "/sermons",
    },
    {
      label: "Events",
      href: isHome ? "#events" : "/events",
    },
    {
      label: "Ministries",
      href: isHome ? "#ministries" : "/#ministries",
    },
    {
      label: "Gallery",
      href: isHome ? "#gallery" : "/gallery",
    },
    {
      label: "Contact",
      href: isHome ? "#contact" : "/#contact",
    },
  ];
});

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
<template>
  <div>
    <UHeader
    v-model:open="menuOpen"
    mode="slideover"
    :menu="{
      inset: true,
    }"
    class="fixed left-0 right-0 top-0 z-50 transition-colors duration-300 h-20 border-b-0!"
    :class="
      scrolled
        ? 'bg-white/90 text-primary shadow-sm'
        : 'bg-transparent text-white/60'
    "
  >
    <template #title>
      <div
        class="flex gap-2 items-center justify-center"
        :class="scrolled || menuOpen ? 'text-primary' : 'text-white'"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-3xl text-white"
        >
          †
        </div>

        <div class="flex flex-col">
          <div class="font-['Playfair_Display'] text-lg leading-5 font-medium">
            Grace Community
          </div>

          <div class="text-[10px] font-thin opacity-60 uppercase">Church</div>
        </div>
      </div>
    </template>

    <template #right>
      <UButton
        v-if="canManageUsers"
        label="Users"
        icon="i-lucide-users"
        size="sm"
        color="primary"
        variant="ghost"
        class="rounded-full"
        @click="usersSidebarOpen = true"
      />
      <UButton
        :label="isAuthenticated ? 'Logout' : 'Login'"
        size="sm"
        color="primary"
        :variant="isAuthenticated ? 'ghost' : 'solid'"
        class="rounded-full px-4"
        @click="isAuthenticated ? openLogout() : openSignIn()"
      />
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      :ui="{
        link: scrolled
          ? 'text-primary hover:text-primary'
          : 'text-white/60 hover:text-white',
      }"
    />

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        variant="link"
        class="w-full"
        :ui="{
          link: 'rounded-xl px-4 py-3 text-base font-medium text-primary transition-colors hover:bg-primary/10 hover:text-primary',
        }"
      />
    </template>
    </UHeader>

    <SignInModal v-model:open="signInOpen" />
    <LogoutConfirmModal v-model:open="logoutOpen" />
    <UsersSidebar v-if="canManageUsers" v-model:open="usersSidebarOpen" />
  </div>
</template>
