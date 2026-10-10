<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import LogoutConfirmModal from "~/components/auth/LogoutConfirmModal.vue";
import SignInModal from "~/components/auth/SignInModal.vue";
import UsersSidebar from "~/components/users/UsersSidebar.vue";
import ContactSidebar from "~/components/contact/ContactSidebar.vue";
import { UserRole } from "~/services/users.service";
import { useUserStore } from "~/stores/user.store";
import appIcon from "./../../public/favIcon.png";

const route = useRoute();

const scrolled = ref(false);
const scrollProgress = ref(0);
const activeSection = ref("home");
const menuOpen = ref(false);
const signInOpen = ref(false);
const logoutOpen = ref(false);
const usersSidebarOpen = ref(false);
const contactSidebarOpen = ref(false);
const userStore = useUserStore();
const isAuthenticated = computed(() => !!userStore.user);
const canManageUsers = computed(() => userStore.user?.role === UserRole.ROOT);
const isHome = computed(() => route.path === "/");

const openSignIn = () => {
  menuOpen.value = false;
  signInOpen.value = true;
};

const openLogout = () => {
  menuOpen.value = false;
  logoutOpen.value = true;
};

const openUsers = () => {
  menuOpen.value = false;
  usersSidebarOpen.value = true;
};

const openMessages = () => {
  menuOpen.value = false;
  contactSidebarOpen.value = true;
};

const navLinks = computed(() => {
  const home = isHome.value;

  return [
    { id: "home", label: "Home", href: home ? "#home" : "/" },
    { id: "about", label: "About", href: home ? "#about" : "/about" },
    { id: "gospel", label: "Gospel", href: home ? "#gospel" : "/#gospel" },
    { id: "sermons", label: "Readings", href: home ? "#sermons" : "/sermons" },
    { id: "events", label: "Events", href: home ? "#events" : "/events" },
    {
      id: "ministries",
      label: "Ministries",
      href: home ? "#ministries" : "/ministries",
    },
    { id: "gallery", label: "Gallery", href: home ? "#gallery" : "/gallery" },
    { id: "give", label: "Give", href: home ? "#give" : "/give" },
    { id: "contact", label: "Contact", href: home ? "#contact" : "/#contact" },
  ];
});

const isLinkActive = (link: { id: string; href: string }) =>
  isHome.value ? activeSection.value === link.id : route.path === link.href;


const buildItems = (variant: "desktop" | "mobile"): NavigationMenuItem[] =>
  navLinks.value.map((link) => {
    const active = isLinkActive(link);

    let cls: string;
    if (variant === "mobile") {
      cls = active
        ? "bg-primary/10 text-primary font-semibold"
        : "text-primary/70 hover:bg-primary/5 hover:text-primary";
    } else if (scrolled.value) {
      cls = active
        ? "bg-primary/10 text-primary font-semibold"
        : "text-primary/65 hover:bg-primary/5 hover:text-primary";
    } else {
      cls = active
        ? "bg-white/20 text-white font-semibold"
        : "text-white/70 hover:bg-white/10 hover:text-white";
    }

    return {
      label: link.label,
      href: link.href,
      active,
      class: cls,
      onSelect: () => {
        menuOpen.value = false;
      },
    };
  });

const desktopItems = computed(() => buildItems("desktop"));
const mobileItems = computed(() => buildItems("mobile"));

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;

  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
};

let observer: IntersectionObserver | null = null;

const observeSections = () => {
  observer?.disconnect();
  if (!isHome.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeSection.value = entry.target.id;
      }
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  for (const link of navLinks.value) {
    const el = document.getElementById(link.id);
    if (el) observer.observe(el);
  }
};

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  observeSections();
});

watch(() => route.path, () => nextTick(observeSections));

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  observer?.disconnect();
});
</script>

<template>
  <div>
    <!-- Scroll progress bar -->
    <div
      class="pointer-events-none fixed left-0 right-0 top-0 z-60 h-0.75 bg-transparent"
    >
      <div
        class="h-full origin-left bg-linear-to-r from-primary via-primary/70 to-primary/40 transition-[width] duration-150 ease-out"
        :style="{ width: `${scrollProgress * 100}%` }"
      />
    </div>

    <UHeader
      v-model:open="menuOpen"
      mode="slideover"
      :menu="{ inset: true }"
      class="fixed left-0 right-0 top-0 z-50 h-20 border-b-0! transition-all duration-500"
      :class="
        scrolled
          ? 'bg-white/95 text-primary shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.12)] backdrop-blur-md'
          : 'bg-transparent text-white'
      "
    >
      <!-- Brand -->
      <template #title>
        <div
          class="group flex items-center gap-3"
          :class="scrolled || menuOpen ? 'text-primary' : 'text-white'"
        >
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl border p-1.5 shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-105"
            :class="
              scrolled || menuOpen
                ? 'border-primary/15 bg-primary/5'
                : 'border-white/25 bg-white/15 backdrop-blur-md'
            "
          >
            <img class="h-full w-full object-contain" :src="appIcon" alt="St Luke's logo" >
          </div>

          <div class="flex flex-col leading-none">
            <span
              class="font-['Playfair_Display'] text-xl font-semibold tracking-tight"
            >
              St Luke's
            </span>
            <span
              class="mt-1.5 text-[10px] font-medium uppercase tracking-[0.25em] opacity-70"
            >
              Anglican Church
            </span>
          </div>
        </div>
      </template>

      <!-- Desktop nav -->
      <UNavigationMenu
        :items="desktopItems"
        variant="link"
        :ui="{
          link: 'relative whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-medium transition-all duration-300 xl:px-3.5 xl:text-sm',
        }"
      />

      <!-- Desktop actions -->
      <template #right>
        <div class="hidden items-center gap-1.5 lg:flex">
          <UButton
            v-if="canManageUsers"
            icon="i-lucide-mail"
            size="sm"
            aria-label="Messages"
            title="Messages"
            :color="scrolled ? 'primary' : 'neutral'"
            variant="ghost"
            class="rounded-full"
            :class="scrolled ? '' : 'text-white hover:bg-white/15'"
            @click="openMessages"
          />
          <UButton
            v-if="canManageUsers"
            icon="i-lucide-users"
            size="sm"
            aria-label="Users"
            title="Users"
            :color="scrolled ? 'primary' : 'neutral'"
            variant="ghost"
            class="rounded-full"
            :class="scrolled ? '' : 'text-white hover:bg-white/15'"
            @click="openUsers"
          />

          <span
            class="mx-1 h-6 w-px"
            :class="scrolled ? 'bg-primary/15' : 'bg-white/25'"
          />

          <UButton
            :icon="isAuthenticated ? 'i-lucide-log-out' : 'i-lucide-log-in'"
            :label="isAuthenticated ? 'Logout' : 'Login'"
            size="sm"
            color="primary"
            variant="solid"
            class="rounded-full px-4 shadow-md shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
            @click="isAuthenticated ? openLogout() : openSignIn()"
          />
        </div>
      </template>

      <!-- Mobile menu -->
      <template #body>
        <UNavigationMenu
          :items="mobileItems"
          orientation="vertical"
          variant="link"
          class="w-full"
          :ui="{
            link: 'rounded-2xl px-4 py-3 text-base font-medium transition-colors',
          }"
        />

        <div class="mt-4 flex flex-col gap-2 border-t border-primary/10 pt-4">
          <UButton
            v-if="canManageUsers"
            label="Message"
            icon="i-lucide-mail"
            color="primary"
            variant="soft"
            class="justify-start rounded-2xl"
            @click="openMessages"
          />
          <UButton
            v-if="canManageUsers"
            label="Users"
            icon="i-lucide-users"
            color="primary"
            variant="soft"
            class="justify-start rounded-2xl"
            @click="openUsers"
          />
          <UButton
            :label="isAuthenticated ? 'Logout' : 'Login'"
            :icon="isAuthenticated ? 'i-lucide-log-out' : 'i-lucide-log-in'"
            color="primary"
            :variant="isAuthenticated ? 'outline' : 'solid'"
            class="justify-center rounded-2xl py-3 shadow-md shadow-primary/20"
            @click="isAuthenticated ? openLogout() : openSignIn()"
          />
        </div>
      </template>
    </UHeader>

    <SignInModal v-model:open="signInOpen" />
    <LogoutConfirmModal v-model:open="logoutOpen" />
    <UsersSidebar v-if="canManageUsers" v-model="usersSidebarOpen" />
    <ContactSidebar v-if="canManageUsers" v-model="contactSidebarOpen" />
  </div>
</template>