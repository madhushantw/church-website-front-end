<script setup lang="ts">
import { CButton, CSection, CSectionHeading } from "../common";
import {
  GalleryImageType,
  GalleryService,
  type GalleryItem,
} from "~/services/gallery.service";
import { useUserStore } from "~/stores/user.store";
import { UserRole } from "~/services/users.service.ts";
import GalleryUploadDialog from "./GalleryUploadDialog.vue";

const props = defineProps<{
  hideNavigationButton?: boolean;
  allowCreate?: boolean
}>();

const userStore = useUserStore();

const filters = [
  "All",
  GalleryImageType.WORSHIP,
  GalleryImageType.COMMUNITY,
  GalleryImageType.EVENTS,
] as const;

type Filter = (typeof filters)[number];

const activeFilter = ref<Filter>("All");

const {
  items: gallery,
  loading,
  error,
} = useApiList<GalleryItem>(
  "gallery",
  GalleryService.getAll,
  "Failed to load gallery",
);

const isGalleryDialogOpen = ref(false);

const filteredGallery = computed(() => {
  if (activeFilter.value === "All") {
    return gallery.value;
  }

  return gallery.value.filter((item) => item.imageType === activeFilter.value);
});

const isGalleryOpen = ref(false);
const selectedImageIndex = ref(0);

const selectedImage = computed(() => {
  return filteredGallery.value[selectedImageIndex.value];
});

const canCreate = computed(
  () => props.allowCreate && userStore.user?.role === UserRole.ROOT,
);

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
  <GalleryUploadDialog v-model="isGalleryDialogOpen" />
  <CSection id="gallery">
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
        class="rounded-full px-5 py-2 text-[12px] font-medium capitalize transition-all"
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

    <div v-if="canCreate" class="mb-6 flex justify-center">
      <button
        class="flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-primary transition-colors hover:text-primary/70"
        @click="isGalleryDialogOpen = true"
      >
        <UIcon name="lucide:plus" size="16" />
        Add Images
      </button>
    </div>
    <div v-if="loading" class="py-8 text-center">Loading gallery...</div>

    <div v-else-if="error" class="py-8 text-center text-red-500">
      {{ error }}
    </div>

    <div
      v-else-if="filteredGallery.length"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="(item, index) in filteredGallery"
        :key="item.id"
        class="group relative cursor-pointer overflow-hidden rounded-lg"
        :class="[index === 0 || index === 3 ? 'row-span-2' : '']"
        @click="openImage(index)"
      >
        <img
          :src="item.imageUrl"
          :alt="item.imageType"
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
            {{ item.imageType }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center">No gallery images found</div>

    <div v-if="!hideNavigationButton" class="mt-10 flex justify-center">
      <CButton
        title="View Full Gallery"
        outlined
        append-icon="lucide:arrow-right"
        @on-click="navigateTo('/gallery')"
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
          :src="selectedImage.imageUrl"
          :alt="selectedImage.imageType"
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
            {{ selectedImage.imageType }}
          </div>

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
