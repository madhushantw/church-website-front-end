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
const isLoading = ref(false)
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

const fieldLabel = computed(() =>
  props.field ? fieldLabels[props.field] : 'Hero content',
)

watch(
  () => [open.value, props.field, props.hero] as const,
  () => {
    if (!open.value || !props.field) return

    error.value = ''

    if (props.field === 'images') {
      images.value = [...props.hero.images]
      value.value = ''
      return
    }

    value.value = props.hero[props.field] || ''
  },
  { immediate: true },
)

const addImage = () => {
  const image = value.value.trim()

  if (!image) return

  if (images.value.includes(image)) {
    error.value = 'This image has already been added.'
    return
  }

  images.value.push(image)
  value.value = ''
  error.value = ''
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

const close = () => {
  if (!isLoading.value) open.value = false
}

const updateHero = async () => {
  if (!props.field) return

  error.value = ''
  isLoading.value = true

  try {
    const updatedHero: Hero = {
      ...props.hero,
      ...(props.field === 'images'
        ? { images: images.value }
        : { [props.field]: value.value }),
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
        'max-w-lg rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form class="p-6 sm:p-8" @submit.prevent="updateHero">
        <div class="mb-7 flex items-start justify-between gap-4">
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
            class="rounded-full"
            @click="close"
          />
        </div>
        <template v-if="isImages">
          <div class="space-y-4">
            <div
              v-if="images.length"
              class="grid max-h-100 grid-cols-2 gap-3 overflow-y-auto pr-2"
            >
              <div
                v-for="(image, index) in images"
                :key="image"
                class="group relative overflow-hidden rounded-xl border border-primary/10"
              >
                <img
                  :src="image"
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
                  class="absolute right-2 top-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  @click="removeImage(index)"
                />
              </div>
            </div>
            <div
              v-else
              class="rounded-xl border border-dashed border-primary/20 p-8 text-center text-sm text-muted-foreground"
            >
              No hero images added yet.
            </div>
            <div v-if="images.length < 8" class="flex gap-2">
              <CInput
                v-model="value"
                label="Image URL"
                placeholder="https://..."
                class="min-w-0 flex-1"
              />
              <UButton
                type="button"
                icon="i-lucide-plus"
                label="Add"
                color="primary"
                class="mt-7 rounded-xl"
                @click="addImage"
              />
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
        <div class="mt-6 flex justify-end gap-3">
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
            label="Save changes"
            icon="i-lucide-check"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>