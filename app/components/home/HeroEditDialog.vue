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
const isLoading = ref(false)
const error = ref('')

const fieldLabels: Record<keyof Hero, string> = {
  welcomeText: 'Welcome text',
  title1: 'First title line',
  title2: 'Second title line',
  subtitle: 'Subtitle',
  image: 'Background image URL',
}

const isTextarea = computed(() => props.field === 'subtitle')
const fieldLabel = computed(() => (props.field ? fieldLabels[props.field] : 'Hero content'))

watch(
  () => [open.value, props.field, props.hero] as const,
  () => {
    if (open.value && props.field) {
      value.value = props.hero[props.field] || ''
      error.value = ''
    }
  },
  { immediate: true },
)

const close = () => {
  if (!isLoading.value) open.value = false
}

const updateHero = async () => {
  if (!props.field) return

  error.value = ''
  isLoading.value = true

  try {
    const response = await HeroService.update({
      ...props.hero,
      [props.field]: value.value,
    })
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
      content: 'max-w-lg rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form class="p-6 sm:p-8" @submit.prevent="updateHero">
        <div class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
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

        <CInput
          v-model="value"
          :label="fieldLabel"
          :placeholder="fieldLabel"
          :textarea="isTextarea"
          required
          class="w-full"
        />

        <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

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