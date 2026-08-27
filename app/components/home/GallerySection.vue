<script setup lang="ts">
import { CButton, CSection, CSectionHeading } from "../common";

interface GalleryItem {
  image: string;
  title: string;
  category: "Worship" | "Community" | "Events";
}

const filters = ["All", "Worship", "Community", "Events"] as const;

type Filter = (typeof filters)[number];

const activeFilter = ref<Filter>("All");

const gallery: GalleryItem[] = [
  {
    image:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=900&h=1100&fit=crop&auto=format",
    title: "Sunday Worship",
    category: "Worship",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=900&h=700&fit=crop&auto=format",
    title: "Church Community",
    category: "Community",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=900&h=900&fit=crop&auto=format",
    title: "Prayer & Fellowship",
    category: "Worship",
  },
  {
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=900&h=1100&fit=crop&auto=format",
    title: "Bible Study",
    category: "Community",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=900&h=700&fit=crop&auto=format",
    title: "Community Outreach",
    category: "Community",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900&h=900&fit=crop&auto=format",
    title: "Church Celebration",
    category: "Events",
  },
];

const filteredGallery = computed(() => {
  if (activeFilter.value === "All") {
    return gallery;
  }

  return gallery.filter((item) => item.category === activeFilter.value);
});

const isGalleryOpen = ref(false);
const selectedImageIndex = ref(0);

const selectedImage = computed(() => {
  return filteredGallery.value[selectedImageIndex.value];
});

const openImage = (index: number) => {
  selectedImageIndex.value = index;
  isGalleryOpen.value = true;
};

const nextImage = () => {
  if (!filteredGallery.value.length) return;

  selectedImageIndex.value =
    (selectedImageIndex.value + 1) % filteredGallery.value.length;
};

const previousImage = () => {
  if (!filteredGallery.value.length) return;

  selectedImageIndex.value =
    (selectedImageIndex.value - 1 + filteredGallery.value.length) %
    filteredGallery.value.length;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!isGalleryOpen.value) return;

  if (event.key === "ArrowRight") {
    nextImage();
  }

  if (event.key === "ArrowLeft") {
    previousImage();
  }

  if (event.key === "Escape") {
    isGalleryOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <CSection id="gallery" background-color="muted">
    <CSectionHeading
      label="Our Community"
      title="Moments of Faith & Fellowship"
      sub-title="A glimpse into the life of our church family, from worship and fellowship to serving our community."
      centered
    />

    <div class="mb-10 flex flex-wrap justify-center gap-2">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="rounded-full px-5 py-2 text-[12px] font-medium transition-all"
        :class="
          activeFilter === filter
            ? 'bg-primary text-white'
            : 'bg-primary/10 text-primary hover:bg-primary/20'
        "
        @click="activeFilter = filter"
      >
        {{ filter }}
      </button>
    </div>

    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="(item, index) in filteredGallery"
        :key="item.image"
        class="group relative cursor-pointer overflow-hidden rounded-lg"
        :class="[index === 0 || index === 3 ? 'row-span-2' : '']"
        @click="openImage(index)"
      >
        <img
          :src="item.image"
          :alt="item.title"
          class="h-full min-h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
        >

        <div
          class="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40"
        />

        <div
          class="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <span
            class="text-[10px] font-medium uppercase tracking-widest text-secondary"
          >
            {{ item.category }}
          </span>

          <h3 class="mt-1 font-['Playfair_Display'] text-lg text-white">
            {{ item.title }}
          </h3>
        </div>
      </div>
    </div>

    <div class="mt-10 flex justify-center">
      <CButton
        title="View Full Gallery"
        outlined
        append-icon="lucide:arrow-right"
      />
    </div>
  </CSection>

  <UModal
    v-model:open="isGalleryOpen"
    fullscreen
    transition
    :ui="{
      overlay: 'bg-black/10 backdrop-blur-sm',
      content: 'bg-black/50 border-0 rounded-none shadow-none',
    }"
  >
    <template #content>
      <div class="relative flex h-screen w-screen items-center justify-center">
        <img
          v-if="selectedImage"
          :src="selectedImage.image"
          :alt="selectedImage.title"
          class="max-h-[90vh] max-w-[90vw] object-contain"
        >

        <button
          type="button"
          class="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          @click="isGalleryOpen = false"
        >
          <UIcon name="lucide:x" size="24" />
        </button>

        <button
          type="button"
          class="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          @click="previousImage"
        >
          <UIcon name="lucide:chevron-left" size="30" />
        </button>

        <button
          type="button"
          class="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          @click="nextImage"
        >
          <UIcon name="lucide:chevron-right" size="30" />
        </button>

        <div
          v-if="selectedImage"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white"
        >
          <div
            class="text-[11px] font-medium uppercase tracking-[0.2em] text-secondary"
          >
            {{ selectedImage.category }}
          </div>

          <h3 class="mt-1 font-['Playfair_Display'] text-xl">
            {{ selectedImage.title }}
          </h3>

          <div class="mt-2 text-xs text-white/50">
            {{ selectedImageIndex + 1 }}
            /
            {{ filteredGallery.length }}
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
