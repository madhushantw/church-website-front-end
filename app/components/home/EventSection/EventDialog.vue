<script setup lang="ts">
import { EventsService, type EventItem } from '~/services/events.service'
import { CInput } from '~/components/common'

interface EventForm {
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  isFeatured: boolean
}

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{
  created: [event: EventItem]
}>()

const initialForm = (): EventForm => ({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  isFeatured: false,
})

const form = ref<EventForm>(initialForm())
const isLoading = ref(false)
const error = ref('')

const resetForm = () => {
  form.value = initialForm()
  error.value = ''
}

const close = () => {
  if (!isLoading.value) open.value = false
}

const createEvent = async () => {
  error.value = ''

  if (new Date(form.value.endDate) <= new Date(form.value.startDate)) {
    error.value = 'The end time must be after the start time.'
    return
  }

  isLoading.value = true

  try {
    const response = await EventsService.create(form.value)
    emit('created', response.data)
    open.value = false
    resetForm()
  } catch {
    error.value = 'Unable to create the event. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content: 'max-w-2xl rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form class="p-6 sm:p-8" @submit.prevent="createEvent">
        <div class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Community calendar
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Add an event
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Share a gathering with the church community.
            </p>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close add event dialog"
            class="rounded-full"
            @click="close"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <CInput
            v-model="form.title"
            label="Event title"
            placeholder="Sunday gathering"
            required
            class="sm:col-span-2"
          />
          <CInput
            v-model="form.startDate"
            label="Starts"
            type="datetime-local"
            required
          />
          <CInput
            v-model="form.endDate"
            label="Ends"
            type="datetime-local"
            required
          />
          <CInput
            v-model="form.location"
            label="Location"
            placeholder="Main hall"
          />
          <CInput
            v-model="form.description"
            label="Description"
            placeholder="Tell people what to expect"
            textarea
            class="sm:col-span-2"
          />
        </div>

        <label class="mt-4 flex items-center gap-3 text-sm text-foreground/70">
          <UCheckbox v-model="form.isFeatured" />
          Feature this event
        </label>

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
            label="Create event"
            icon="i-lucide-calendar-plus"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
