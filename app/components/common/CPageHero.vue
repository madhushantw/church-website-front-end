<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

import { CButton } from "~/components/common"

interface Button {
  title: string
  color?: string
  outlined?: boolean
  appendIcon?: string
}

interface Props {
  image: string
  label: string
  title: string
  highlighted?: string
  description?: string
  buttons?: Button[]
  alt?: string
  canEditImage?: boolean
  imageLoading?: boolean
  imageSaving?: boolean
  imageSaveError?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  highlighted: undefined,
  description: undefined,
  buttons: () => [],
  canEditImage: false,
  imageLoading: false,
  imageSaving: false,
  imageSaveError: '',
})

const emit = defineEmits<{
  saveImage: [file: File]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const selectionError = ref('')

const clearSelection = () => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  selectedFile.value = null
}

const selectImage = (event: Event) => {
  const input = event.currentTarget as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  if (!file.type.startsWith('image/')) {
    selectionError.value = 'Choose an image file.'
    return
  }

  clearSelection()
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  selectionError.value = ''
}

const saveSelectedImage = () => {
  if (selectedFile.value) emit('saveImage', selectedFile.value)
}

watch(() => props.image, clearSelection)
onBeforeUnmount(clearSelection)
</script>

<template>
  <section class="relative overflow-hidden bg-foreground">
    <div class="absolute inset-0">
      <img
        v-if="previewUrl || image"
        :src="previewUrl || image"
        :alt="alt"
        class="h-full w-full object-cover"
      >

      <div v-if="previewUrl || image" class="absolute inset-0 bg-black/15" />

      <div
        v-if="previewUrl || image"
        class="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent"
      />
    </div>

    <div
      v-if="imageLoading"
      class="absolute inset-0 z-10 flex items-center justify-center bg-black/35"
      role="status"
      aria-label="Loading page image"
    >
      <UIcon name="i-lucide-loader-circle" class="size-10 animate-spin text-white" />
    </div>

    <div v-if="canEditImage" class="absolute right-4 bottom-4 z-20 flex flex-col items-end gap-2">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="selectImage"
      >
      <UButton
        type="button"
        :label="selectedFile ? 'Choose another image' : 'Select image'"
        icon="i-lucide-image-plus"
        color="neutral"
        variant="solid"
        class="rounded-xl shadow-lg"
        :disabled="imageSaving"
        @click="fileInput?.click()"
      />
      <UButton
        v-if="selectedFile"
        type="button"
        label="Save image"
        icon="i-lucide-check"
        color="primary"
        class="rounded-xl shadow-lg"
        :loading="imageSaving"
        :disabled="imageSaving"
        @click="saveSelectedImage"
      />
      <p v-if="selectionError || imageSaveError" class="rounded-lg bg-white/95 px-3 py-2 text-sm text-red-700 shadow">
        {{ selectionError || imageSaveError }}
      </p>
    </div>

    <UContainer class="relative">
      <div class="flex min-h-115 items-center py-24 lg:min-h-130">
        <div class="max-w-2xl">
          <!-- Label -->
          <div class="mb-6 flex items-center gap-3">
            <div class="h-px w-10 bg-accent" />

            <span
              class="text-[12px] font-medium uppercase tracking-[0.25em] text-accent"
            >
              {{ label }}
            </span>
          </div>

          <h1
            class="font-['Playfair_Display'] text-5xl font-normal leading-tight text-white md:text-6xl lg:text-7xl"
          >
            {{ title }}

            <span
              v-if="highlighted"
              class="italic text-secondary"
            >
              {{ highlighted }}
            </span>
          </h1>

          <p
            v-if="description"
            class="mt-6 max-w-xl text-[16px] leading-relaxed text-white/70 md:text-lg"
          >
            {{ description }}
          </p>

          <div
            v-if="buttons.length"
            class="mt-8 flex flex-wrap gap-4"
          >
            <CButton
              v-for="button in buttons"
              :key="button.title"
              :title="button.title"
              :color="button.color || 'accent'"
              :outlined="button.outlined"
              :append-icon="button.appendIcon"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>