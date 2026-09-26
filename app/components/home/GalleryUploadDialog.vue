<script setup lang="ts">
import {
  GalleryImageType,
  GalleryService,
  type GalleryItem,
} from "~/services/gallery.service";
import { CInput } from "~/components/common";

interface SelectedImage {
  file: File;
  preview: string;
}

const open = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  saved: [items: GalleryItem[]];
}>();

const imageTypes = [
  {
    label: "Worship",
    value: GalleryImageType.WORSHIP,
  },
  {
    label: "Community",
    value: GalleryImageType.COMMUNITY,
  },
  {
    label: "Events",
    value: GalleryImageType.EVENTS,
  },
];

const images = ref<SelectedImage[]>([]);
const imageType = ref<GalleryImageType>(GalleryImageType.EVENTS);
const description = ref("");
const isLoading = ref(false);
const error = ref("");
const showDescription = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);

const reset = () => {
  images.value.forEach((image) => URL.revokeObjectURL(image.preview));

  images.value = [];
  imageType.value = GalleryImageType.EVENTS;
  description.value = "";
  error.value = "";
  showDescription.value = false;
};

const close = () => {
  if (isLoading.value) return;

  open.value = false;
  reset();
};

const selectImages = () => {
  fileInput.value?.click();
};

const handleFiles = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (!input.files?.length) return;

  const selectedFiles = Array.from(input.files).filter((file) =>
    file.type.startsWith("image/"),
  );

  images.value.push(
    ...selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    })),
  );

  input.value = "";
};

const removeImage = (index: number) => {
  URL.revokeObjectURL(images.value[index]!.preview);
  images.value.splice(index, 1);
};

const getTitle = (file: File) => {
  return file.name.replace(/\.[^/.]+$/, "");
};

const uploadImages = async () => {
  error.value = "";

  if (!images.value.length) {
    error.value = "Please select at least one image.";
    return;
  }

  isLoading.value = true;

  try {
    const uploadedItems: GalleryItem[] = [];

    for (const image of images.value) {
      const response = await GalleryService.create({
        title: getTitle(image.file),
        description: description.value || null,
        type: imageType.value,
        image: image.file,
      });

      uploadedItems.push(response.data);
    }

    emit("saved", uploadedItems);

    open.value = false;
    reset();
  } catch {
    error.value = "Unable to upload the images. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

watch(open, (isOpen) => {
  if (!isOpen) {
    reset();
  }
});
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content:
        'max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form class="flex max-h-[90vh] flex-col" @submit.prevent="uploadImages">
        <!-- Fixed header -->
        <div class="shrink-0 p-6 pb-4 sm:p-8 sm:pb-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p
                class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
              >
                Church gallery
              </p>

              <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
                Add gallery images
              </h2>

              <p class="mt-2 text-sm text-muted-foreground">
                Upload multiple moments from the life of our church.
              </p>
            </div>

            <UButton
              type="button"
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              aria-label="Close upload dialog"
              class="rounded-full"
              @click="close"
            />
          </div>
        </div>

        <!-- Only this section scrolls -->
        <div class="min-h-0 flex-1 overflow-y-auto px-6 sm:px-8">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleFiles"
          >

          <!-- Upload area -->
          <button
            type="button"
            class="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-primary/10"
            @click="selectImages"
          >
            <div
              class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <UIcon name="i-lucide-images" size="24" />
            </div>

            <p class="text-sm font-medium text-foreground">
              Click to select images
            </p>

            <p class="mt-1 text-xs text-muted-foreground">
              You can select multiple images at once
            </p>
          </button>

          <!-- Selected images -->
          <div v-if="images.length" class="mt-5">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-sm font-medium text-foreground">
                Selected images
                <span class="text-muted-foreground">
                  ({{ images.length }})
                </span>
              </p>

              <UButton
                type="button"
                label="Add more"
                icon="i-lucide-plus"
                color="primary"
                variant="ghost"
                size="sm"
                @click="selectImages"
              />
            </div>

            <div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
              <div
                v-for="(image, index) in images"
                :key="image.preview"
                class="group relative aspect-square overflow-hidden rounded-xl"
              >
                <img
                  :src="image.preview"
                  :alt="image.file.name"
                  class="h-full w-full object-cover"
                >

                <button
                  type="button"
                  class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                  @click="removeImage(index)"
                >
                  <UIcon name="i-lucide-x" size="16" />
                </button>
              </div>
            </div>
          </div>

          <!-- Image type -->
          <div class="mt-6">
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="type in imageTypes"
                :key="type.value"
                type="button"
                class="rounded-xl border px-4 py-3 text-sm font-medium transition-all"
                :class="
                  imageType === type.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-primary/10 bg-primary/5 text-primary hover:bg-primary/10'
                "
                @click="imageType = type.value"
              >
                {{ type.label }}
              </button>
            </div>
          </div>

          <!-- Description -->
          <div class="mt-5">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-foreground">Description</p>

              <UButton
                type="button"
                :label="description ? 'Edit description' : 'Add description'"
                icon="i-lucide-pencil"
                color="primary"
                variant="ghost"
                size="sm"
                @click="showDescription = true"
              />
            </div>

            <p
              v-if="description"
              class="mt-2 rounded-xl bg-primary/5 px-4 py-3 text-sm text-muted-foreground"
            >
              {{ description }}
            </p>

            <p v-else class="mt-2 text-xs text-muted-foreground">
              Optional description for the uploaded images.
            </p>
          </div>

          <p v-if="error" class="mt-4 pb-4 text-sm text-red-600">
            {{ error }}
          </p>
        </div>

        <!-- Fixed footer -->
        <div
          class="shrink-0 border-t border-primary/10 bg-background px-6 py-4 sm:px-8"
        >
          <div class="flex justify-end gap-3">
            <UButton
              type="button"
              label="Cancel"
              color="neutral"
              variant="soft"
              class="rounded-xl"
              :disabled="isLoading"
              @click="close"
            />

            <UButton
              type="submit"
              label="Upload images"
              icon="i-lucide-upload"
              color="primary"
              class="rounded-xl"
              :loading="isLoading"
              :disabled="!images.length"
            />
          </div>
        </div>
      </form>
    </template>
  </UModal>

  <!-- Small description popup -->
  <UModal
    v-model:open="showDescription"
    :ui="{
      overlay: 'bg-black/20 backdrop-blur-sm',
      content: 'max-w-md rounded-2xl',
    }"
  >
    <template #content>
      <div class="p-5">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-foreground">Add description</h3>

            <p class="mt-1 text-xs text-muted-foreground">
              This description will be used for all selected images.
            </p>
          </div>

          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            class="rounded-full"
            @click="showDescription = false"
          />
        </div>

        <CInput
          v-model="description"
          label="Description"
          placeholder="Describe these moments..."
          textarea
        />

        <div class="mt-4 flex justify-end">
          <UButton
            label="Done"
            color="primary"
            class="rounded-xl"
            @click="showDescription = false"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
