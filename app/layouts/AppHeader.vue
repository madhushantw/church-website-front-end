<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const scrolled = ref(false);

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
  <UHeader
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
        :class="scrolled ? 'text-primary' : 'text-white'"
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

    <UNavigationMenu
      :items="items"
      variant="link"
      :ui="{
        link: scrolled
          ? 'text-primary hover:text-primary'
          : 'text-white/60 hover:text-white',
      }"
    />
  </UHeader>
</template>
