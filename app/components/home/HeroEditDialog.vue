<script setup lang="ts">
import { HeroService, type Hero } from '~/services/hero.service'
import { CInput } from '../common'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  hero: Hero
  field: keyof Hero | null
}>()

const emit = defineEmits<{
  updated: [hero: Hero]
}>()

const value = ref('')
const images = ref<string[]>([])
const selectedImages = ref<{ file: File; preview: string }[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const deletingImage = ref<string | null>(null)
const error = ref('')

const fieldLabels: Record<keyof Hero, string> = {
  welcomeText: 'Welcome text',
  title1: 'First title line',
  title2: 'Second title line',
  subtitle: 'Subtitle',
  images: 'Background images',
}

const isImages = computed(() => props.field === 'images')
const isTextarea = computed(() => props.field === 'subtitle')
const remainingImageSlots = computed(() =>
  Math.max(0, 10 - images.value.length - selectedImages.value.length),
)

const fieldLabel = computed(() =>
  props.field ? fieldLabels[props.field] : 'Hero content',
)

const clearSelectedImages = () => {
  selectedImages.value.forEach(image => URL.revokeObjectURL(image.preview))
  selectedImages.value = []
}

watch(
  () => [open.value, props.field] as const,
  () => {
    if (!open.value) {
      clearSelectedImages()
      return
    }

    if (!props.field) return

    error.value = ''

    if (props.field === 'images') {
      images.value = [...props.hero.images]
      clearSelectedImages()
      value.value = ''
      return
    }

    value.value = props.hero[props.field] || ''
  },
  { immediate: true },
)

const selectImages = () => {
  fileInput.value?.click()
}

const handleFiles = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''

  const imageFiles = files.filter(file => file.type.startsWith('image/'))

  if (imageFiles.length !== files.length) {
    error.value = 'Please select image files only.'
  }

  const uniqueFiles = imageFiles.filter(file =>
    !selectedImages.value.some(selected =>
      selected.file.name === file.name &&
      selected.file.size === file.size &&
      selected.file.lastModified === file.lastModified,
    ),
  )

  if (uniqueFiles.length > remainingImageSlots.value) {
    error.value = `You can have up to 10 hero images total. Remove ${uniqueFiles.length - remainingImageSlots.value} image${uniqueFiles.length - remainingImageSlots.value === 1 ? '' : 's'} before adding these files.`
    return
  }

  selectedImages.value.push(...uniqueFiles.map(file => ({
    file,
    preview: URL.createObjectURL(file),
  })))
  if (imageFiles.length === files.length) error.value = ''
}

const removeSelectedImage = (index: number) => {
  const [image] = selectedImages.value.splice(index, 1)
  if (image) URL.revokeObjectURL(image.preview)
}

const removeImage = async (imageUrl: string) => {
  error.value = ''
  deletingImage.value = imageUrl

  try {
    const response = await HeroService.removeImage(imageUrl)
    images.value = response.data.images
    emit('updated', { ...props.hero, images: response.data.images })
  } catch {
    error.value = 'Unable to delete this hero image. Please try again.'
  } finally {
    deletingImage.value = null
  }
}

const close = () => {
  if (!isLoading.value && !deletingImage.value) open.value = false
}

const updateHero = async () => {
  if (!props.field) return

  error.value = ''
  isLoading.value = true

  try {
    if (props.field === 'images') {
      if (!selectedImages.value.length) return
      if (images.value.length + selectedImages.value.length > 10) {
        error.value = 'You can have up to 10 hero images total.'
        return
      }

      const response = await HeroService.uploadImages(
        selectedImages.value.map(image => image.file),
      )
      emit('updated', response.data)
      clearSelectedImages()
      open.value = false
      return
    }

    const updatedHero: Hero = {
      ...props.hero,
      [props.field]: value.value,
    }

    const response = await HeroService.update(updatedHero)

    emit('updated', response.data)
    open.value = false
  } catch {
    error.value = 'Unable to update this hero content. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30',
      content:
        'w-full max-w-lg overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form
        class="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[calc(100dvh-4rem)]"
        @submit.prevent="updateHero"
      >
        <div class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              Hero section
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Edit {{ fieldLabel }}
            </h2>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close hero editor"
            class="shrink-0 rounded-full"
            @click="close"
          />
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        <template v-if="isImages">
          <div class="space-y-4">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleFiles"
            >
            <div
              v-if="images.length"
              class="grid grid-cols-2 gap-3 pr-2"
            >
              <div
                v-for="(image, index) in images"
                :key="image"
                class="group relative overflow-hidden rounded-xl border border-primary/10"
              >
                <img
                  :src="HeroService.getImageUrl(image)"
                  :alt="`Hero image ${index + 1}`"
                  class="aspect-video w-full object-cover"
                >
                <UButton
                  type="button"
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="solid"
                  size="xs"
                  aria-label="Remove image"
                  :loading="deletingImage === image"
                  :disabled="!!deletingImage"
                  class="absolute right-2 top-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  @click="removeImage(image)"
                />
              </div>
            </div>
            <p v-if="images.length" class="text-xs font-medium text-muted-foreground">
              Existing images ({{ images.length }})
            </p>
            <div v-if="selectedImages.length" class="space-y-2">
              <p class="text-xs font-medium text-muted-foreground">
                New images ({{ selectedImages.length }})
              </p>
              <div class="grid grid-cols-2 gap-3 pr-2">
                <div
                  v-for="(image, index) in selectedImages"
                  :key="image.preview"
                  class="group relative overflow-hidden rounded-xl border border-primary/10"
                >
                  <img
                    :src="image.preview"
                    :alt="image.file.name"
                    class="aspect-video w-full object-cover"
                  >
                  <UButton
                    type="button"
                    icon="i-lucide-x"
                    color="error"
                    variant="solid"
                    size="xs"
                    :aria-label="`Remove ${image.file.name} from upload`"
                    class="absolute right-2 top-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    @click="removeSelectedImage(index)"
                  />
                  <span class="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-xs text-white">
                    {{ image.file.name }}
                  </span>
                </div>
              </div>
            </div>
            <div
              v-if="!images.length && !selectedImages.length"
              class="rounded-xl border border-dashed border-primary/20 p-8 text-center text-sm text-muted-foreground"
            >
              No hero images yet. Select files to add images.
            </div>
            <div class="space-y-3">
              <UButton
                type="button"
                icon="i-lucide-upload"
                :label="selectedImages.length ? 'Add more images' : 'Choose images'"
                color="primary"
                variant="soft"
                class="rounded-xl"
                :disabled="isLoading || !!deletingImage || remainingImageSlots === 0"
                @click="selectImages"
              />
              <p class="text-xs text-muted-foreground">
                Maximum 10 images total. Remove pending images with ×; existing images are deleted immediately with the trash button.
              </p>
            </div>
          </div>
        </template>
        <CInput
          v-else
          v-model="value"
          :label="fieldLabel"
          :placeholder="fieldLabel"
          :textarea="isTextarea"
          required
          class="w-full"
        />
        <p v-if="error" class="mt-4 text-sm text-red-600">
          {{ error }}
        </p>
        </div>
        <div class="flex shrink-0 justify-end gap-3 border-t border-primary/10 px-6 py-4 sm:px-8">
          <UButton
            type="button"
            label="Cancel"
            color="neutral"
            variant="soft"
            class="rounded-xl"
            :disabled="isLoading || !!deletingImage"
            @click="close"
          />
          <UButton
            type="submit"
            :label="isImages ? 'Upload images' : 'Save changes'"
            :icon="isImages ? 'i-lucide-upload' : 'i-lucide-check'"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
            :disabled="(isImages && !selectedImages.length) || !!deletingImage"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>