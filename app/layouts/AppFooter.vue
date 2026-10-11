<script setup lang="ts">
import appIcon from "../../public/favIcon.png";
import { useChurchInfoStore } from "~/stores/church-info.store";

const route = useRoute();
const churchInfoStore = useChurchInfoStore();
const navigation = computed(() => {
  const isHome = route.path === "/";

  return [
    {
      label: "Home",
      href: isHome ? "#home" : "/",
    },
    {
      label: "About",
      href: isHome ? "#about" : "/about",
    },
    {
      label: "Gospel",
      href: isHome ? "#gospel" : "/#gospel",
    },
    {
      label: "Readings",
      href: isHome ? "#sermons" : "/sermons",
    },
    {
      label: "Events",
      href: isHome ? "#events" : "/events",
    },
    {
      label: "Ministries",
      href: isHome ? "#ministries" : "/ministries",
    },
    {
      label: "Gallery",
      href: isHome ? "#gallery" : "/gallery",
    },
    {
      label: "Contact",
      href: isHome ? "#contact" : "/#contact",
    },
    {
      label: "Give",
      href: isHome ? "#give" : "/give",
    },
  ];
});

const socials = computed(() => [
  {
    name: "Facebook",
    icon: "lucide:facebook",
    url: churchInfoStore.churchInfo?.facebookUrl || "",
  },
  {
    name: "Instagram",
    icon: "lucide:instagram",
    url: churchInfoStore.churchInfo?.instagramUrl || "",
  },
  {
    name: "YouTube",
    icon: "lucide:youtube",
    url: churchInfoStore.churchInfo?.youtubeUrl || "",
  },
].filter((social) => Boolean(social.url)));

const PLACEHOLDER = "---";

const contactDetails = computed(() => {
  const address = churchInfoStore.churchInfo?.address || PLACEHOLDER;
  const phone = churchInfoStore.churchInfo?.phone || PLACEHOLDER;
  const email = churchInfoStore.churchInfo?.email || PLACEHOLDER;

  return [
    {
      icon: "lucide:map-pin",
      label: "Visit us",
      value: address,
      href:
        address !== PLACEHOLDER
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
          : "",
    },
    {
      icon: "lucide:phone",
      label: "Call us",
      value: phone,
      href: phone !== PLACEHOLDER ? `tel:${phone.replace(/\s+/g, "")}` : "",
    },
    {
      icon: "lucide:mail",
      label: "Email us",
      value: email,
      href: email !== PLACEHOLDER ? `mailto:${email}` : "",
    },
  ];
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <footer class="relative isolate overflow-hidden bg-foreground text-white">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div
        class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        class="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-secondary/10 blur-[120px]"
      />
    </div>
    <div
      aria-hidden="true"
      class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"
    />
    <div class="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-8 lg:pt-20">
      <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        <div class="lg:col-span-5">
          <a href="/" class="group mb-6 inline-flex items-center gap-3.5">
            <div
              class="flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
            >
              <img class="size-full object-contain" :src="appIcon" alt="">
            </div>
            <div class="flex flex-col leading-none">
              <span class="font-['Playfair_Display'] text-2xl font-semibold">
                St Luke's
              </span>
              <span
                class="mt-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/50"
              >
                Anglican Church
              </span>
            </div>
          </a>
          <p class="max-w-md text-sm leading-[1.85] text-white/65">
            A community of faith, hope, and love. Join us as we grow together,
            serve our community, and live out the Gospel.
          </p>
          <div v-if="socials.length" class="mt-7 flex gap-3">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.url"
              :aria-label="social.name"
              target="_blank"
              rel="noopener noreferrer"
              class="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:bg-secondary hover:text-primary hover:shadow-lg hover:shadow-secondary/20"
            >
              <UIcon :name="social.icon" size="18" />
            </a>
          </div>
        </div>
        <div class="lg:col-span-3 lg:pl-6">
          <h3
            class="mb-6 text-[12px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Explore
          </h3>
          <nav class="grid grid-cols-2 gap-x-6 gap-y-3.5">
            <a
              v-for="item in navigation"
              :key="item.label"
              :href="item.href"
              class="group/link flex w-fit items-center gap-2 text-sm text-white/65 transition-colors duration-300 hover:text-secondary"
            >
              <span
                class="h-px w-0 bg-secondary transition-all duration-300 group-hover/link:w-3"
              />
              {{ item.label }}
            </a>
          </nav>
        </div>
        <div class="md:col-span-2 lg:col-span-4">
          <h3
            class="mb-6 text-[12px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Connect
          </h3>
          <div class="space-y-3">
            <component
              :is="detail.href ? 'a' : 'div'"
              v-for="detail in contactDetails"
              :key="detail.icon"
              :href="detail.href || undefined"
              :target="detail.icon === 'lucide:map-pin' && detail.href ? '_blank' : undefined"
              :rel="detail.icon === 'lucide:map-pin' && detail.href ? 'noopener noreferrer' : undefined"
              class="group/contact flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all duration-300"
              :class="detail.href ? 'hover:border-white/25 hover:bg-white/10' : ''"
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-secondary transition-transform duration-300 group-hover/contact:scale-110"
              >
                <UIcon :name="detail.icon" size="18" />
              </span>
              <span class="min-w-0">
                <span
                  class="block text-[11px] uppercase tracking-wider text-white/40"
                >
                  {{ detail.label }}
                </span>
                <span class="block wrap-break-word text-sm text-white/80">
                  {{ detail.value }}
                </span>
              </span>
            </component>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between lg:px-8"
      >
        <p>
          © {{ new Date().getFullYear() }} St Luke's Anglican Church. All rights
          reserved.
        </p>
        <p
          class="flex flex-wrap items-center gap-x-3 gap-y-1 font-['Playfair_Display'] italic text-white/55"
        >
          <span>Growing Faith</span>
          <span class="size-1 rounded-full bg-secondary/70" />
          <span>Building Community</span>
          <span class="size-1 rounded-full bg-secondary/70" />
          <span>Sharing Hope</span>
        </p>
        <button
          type="button"
          aria-label="Back to top"
          class="group/top inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white/60 transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-primary"
          @click="scrollToTop"
        >
          Back to top
          <UIcon
            name="lucide:arrow-up"
            size="14"
            class="transition-transform duration-300 group-hover/top:-translate-y-0.5"
          />
        </button>
      </div>
    </div>
  </footer>
</template>