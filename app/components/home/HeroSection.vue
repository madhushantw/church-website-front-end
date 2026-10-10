<script setup lang="ts">
import { HeroService, type Hero } from "~/services/hero.service";
import { UserRole } from "~/services/users.service";
import { useUserStore } from "~/stores/user.store";
import { CButton } from "../common";
import HeroEditDialog from "./HeroEditDialog.vue";

const SLIDE_DURATION = 10000;

const hero = ref<Hero>({ images: [] });
const hasHeroData = ref(false);
const userStore = useUserStore();
const isEditDialogOpen = ref(false);
const editingField = ref<keyof Hero | null>(null);
const currentImageIndex = ref(0);

let heroInterval: ReturnType<typeof setInterval> | undefined;

const canEdit = computed(() => userStore.user?.role === UserRole.ROOT);

const currentHeroImage = computed(() => {
  const image = hero.value.images[currentImageIndex.value];
  return image ? HeroService.getImageUrl(image) : "";
});

const hasMultipleImages = computed(() => hero.value.images.length > 1);

const pad = (value: number) => String(value).padStart(2, "0");

const editField = (field: keyof Hero) => {
  editingField.value = field;
  isEditDialogOpen.value = true;
};

const startSlideshow = () => {
  clearInterval(heroInterval);

  heroInterval = setInterval(() => {
    if (hero.value.images.length <= 1) return;

    currentImageIndex.value =
      (currentImageIndex.value + 1) % hero.value.images.length;
  }, SLIDE_DURATION);
};

const goToSlide = (index: number) => {
  currentImageIndex.value = index;
  startSlideshow();
};

const setUpdatedHero = (updatedHero: Hero) => {
  hero.value = updatedHero;
  currentImageIndex.value = 0;
  startSlideshow();
};

const getHeroData = async () => {
  try {
    const { data } = await HeroService.get();

    if (!data) return;

    hero.value = data;
    hasHeroData.value = true;
    currentImageIndex.value = 0;
  } catch (error) {
    console.error("Error fetching hero data:", error);
  }
};

onMounted(async () => {
  await getHeroData();
  startSlideshow();
});

onUnmounted(() => {
  clearInterval(heroInterval);
});

const gotContact = () => {
  document.getElementById("about")?.scrollIntoView({
    behavior: "smooth",
  });
};
</script>

<template>
  <section
    id="home"
    class="relative isolate flex min-h-screen items-end overflow-hidden bg-[#1C2B2A] md:items-center"
  >
    <div class="absolute inset-0 -z-30">
      <Transition name="hero-image">
        <img
          :key="currentHeroImage"
          :src="currentHeroImage"
          alt="Congregation in worship"
          class="absolute inset-0 h-full w-full object-cover object-center"
        >
      </Transition>
    </div>

    <div
      class="absolute inset-0 -z-20 hidden bg-linear-to-r from-[#1C2B2A]/80 from-15% via-[#1C2B2A]/70 via-45% to-[#1C2B2A]/20 md:block"
    />

    <UButton
      v-if="canEdit"
      icon="i-lucide-pencil"
      color="neutral"
      variant="solid"
      size="xs"
      aria-label="Edit hero background image"
      class="absolute right-5 top-24 z-20 rounded-full opacity-30 shadow-lg transition-opacity hover:opacity-80"
      @click="editField('images')"
    />

    <UContainer
      class="relative z-10 w-full max-w-7xl px-6 pb-28 pt-32 md:pb-24"
    >
      <Transition name="hero-text" appear>
        <div v-if="hasHeroData" class="max-w-4xl text-left">
          <div class="mb-8 flex items-center gap-4 md:mb-10">
            <span class="h-px w-10 shrink-0 bg-accent" />
            <span
              class="relative text-[13px] font-semibold uppercase tracking-[0.25em] text-accent"
            >
              {{ hero.welcomeText }}
              <UButton
                v-if="canEdit"
                icon="i-lucide-pencil"
                color="neutral"
                variant="solid"
                size="xs"
                aria-label="Edit welcome text"
                class="absolute -right-10 top-1/2 -translate-y-1/2 rounded-full opacity-30 transition-opacity hover:opacity-80"
                @click="editField('welcomeText')"
              />
            </span>
          </div>

          <h1
            class="mb-8 font-['Playfair_Display'] text-4xl font-medium leading-tight text-white sm:text-5xl md:mb-10 lg:text-6xl xl:text-7xl"
          >
            <span class="relative inline-block">
              {{ hero.title1 }}
              <UButton
                v-if="canEdit"
                icon="i-lucide-pencil"
                color="neutral"
                variant="solid"
                size="xs"
                aria-label="Edit first title line"
                class="absolute -right-9 top-0 rounded-full text-base opacity-30 transition-opacity hover:opacity-80"
                @click="editField('title1')"
              />
            </span>
            <br >
            <span class="relative inline-block italic text-accent mt-10">
              {{ hero.title2 }}
              <UButton
                v-if="canEdit"
                icon="i-lucide-pencil"
                color="neutral"
                variant="solid"
                size="xs"
                aria-label="Edit second title line"
                class="absolute -right-9 bottom-0 rounded-full text-base not-italic opacity-30 transition-opacity hover:opacity-80"
                @click="editField('title2')"
              />
            </span>
          </h1>

          <p
            class="relative mb-12 max-w-3xl text-base leading-[1.8] text-white/85 md:mb-14 md:text-lg"
          >
            {{ hero.subtitle }}
            <UButton
              v-if="canEdit"
              icon="i-lucide-pencil"
              color="neutral"
              variant="solid"
              size="xs"
              aria-label="Edit hero subtitle"
              class="absolute -bottom-3 -right-9 rounded-full opacity-30 transition-opacity hover:opacity-80"
              @click="editField('subtitle')"
            />
          </p>

          <div class="flex flex-col gap-4 sm:flex-row">
            <CButton
              outlined
              title="Discover Our Church"
              color="neutral"
              prepend-icon="lucide:church"
              @on-click="gotContact"
            />
          </div>
        </div>
      </Transition>
    </UContainer>

    <div
      v-if="hasMultipleImages"
      class="absolute inset-x-0 bottom-8 z-20 mx-auto flex w-full max-w-7xl items-center gap-5 px-6"
    >
      <span
        class="text-[12px] font-medium tabular-nums tracking-widest text-white/70"
      >
        {{ pad(currentImageIndex + 1) }}
        <span class="text-white/40">/ {{ pad(hero.images.length) }}</span>
      </span>

      <div class="flex items-center gap-2">
        <button
          v-for="(_, index) in hero.images"
          :key="index"
          type="button"
          :aria-label="`Go to slide ${index + 1}`"
          class="relative h-0.5 overflow-hidden rounded-full bg-white/25 transition-all duration-500 hover:bg-white/45"
          :class="index === currentImageIndex ? 'w-14' : 'w-6'"
          @click="goToSlide(index)"
        >
          <span
            v-if="index === currentImageIndex"
            :key="`progress-${currentImageIndex}`"
            class="hero-progress absolute inset-y-0 left-0 bg-accent"
            :style="{ animationDuration: `${SLIDE_DURATION}ms` }"
          />
        </button>
      </div>
    </div>

    <HeroEditDialog
      v-if="canEdit"
      v-model:open="isEditDialogOpen"
      :hero="hero"
      :field="editingField"
      @updated="setUpdatedHero"
    />
  </section>
</template>

<style scoped>
.hero-image-enter-active,
.hero-image-leave-active {
  transition: opacity 1.2s ease-in-out;
}

.hero-image-enter-from,
.hero-image-leave-to {
  opacity: 0;
}

.hero-image-enter-to,
.hero-image-leave-from {
  opacity: 1;
}

.hero-text-enter-active {
  transition:
    opacity 1s ease,
    transform 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-text-enter-from {
  opacity: 0;
  transform: translateY(1.5rem);
}

.hero-text-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.hero-progress {
  width: 0;
  animation-name: hero-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes hero-progress {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-progress {
    animation: none;
    width: 100%;
  }
}
</style>
