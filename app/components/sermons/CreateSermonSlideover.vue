<script setup lang="ts">
import { CInput } from '~/components/common'
import {
  SermonsService,
  SermonPdfType,
  type SermonItem,
} from '~/services/sermons.service'

type PdfKey = 'pewsheet' | 'readings' | 'sermon'
type SelectedFiles = Partial<Record<PdfKey, File>>
type PreviewUrls = Partial<Record<PdfKey, string>>

interface SermonForm {
  title: string
  preacher: string
  sermonDate: string
  description: string
  reflection: string
}

interface PdfSlot {
  key: PdfKey
  label: string
  description: string
  type: SermonPdfType
}

const pdfSlots: PdfSlot[] = [
  {
    key: 'pewsheet',
    label: 'Pewsheet',
    description: 'The service sheet for the congregation.',
    type: SermonPdfType.PEWSHEET,
  },
  {
    key: 'readings',
    label: 'Readings',
    description: 'The scripture readings for this message.',
    type: SermonPdfType.READINGS,
  },
  {
    key: 'sermon',
    label: 'Sermon',
    description: 'The full sermon document.',
    type: SermonPdfType.SERMON,
  },
]

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{
  sermon?: SermonItem | null
}>()
const emit = defineEmits<{
  saved: [sermon: SermonItem]
}>()

const initialForm = (): SermonForm => ({
  title: '',
  preacher: '',
  sermonDate: '',
  description: '',
  reflection: ''
})

const form = ref<SermonForm>(initialForm())
const selectedFiles = ref<SelectedFiles>({})
const previewUrls = ref<PreviewUrls>({})
const existingPdfUrls = ref<PreviewUrls>({})
const isLoading = ref(false)
const error = ref('')
const createdSermonId = ref<string | null>(null)
const uploadedPdfKeys = ref<Set<PdfKey>>(new Set())
const isEditing = computed(() => !!props.sermon)

const accordionItems = computed(() =>
  pdfSlots.map((slot) => ({
    label: slot.label,
    value: slot.key,
    icon: selectedFiles.value[slot.key] || existingPdfUrls.value[slot.key]
      ? 'i-lucide-file-check-2'
      : 'i-lucide-file-up',
  })),
)

const selectedFileCount = computed(() => Object.keys(selectedFiles.value).length)

const omitKey = <T extends object, K extends PropertyKey>(object: T, key: K): Omit<T, K> =>
  Object.fromEntries(
    Object.entries(object).filter(([entryKey]) => entryKey !== key),
  ) as Omit<T, K>

const clearPreviewUrl = (key: PdfKey) => {
  const url = previewUrls.value[key]
  if (url) URL.revokeObjectURL(url)
  previewUrls.value = omitKey(previewUrls.value, key)
}

const resetForm = () => {
  Object.keys(previewUrls.value).forEach((key) => clearPreviewUrl(key as PdfKey))
  form.value = initialForm()
  selectedFiles.value = {}
  previewUrls.value = {}
  existingPdfUrls.value = {}
  createdSermonId.value = null
  uploadedPdfKeys.value = new Set()
  error.value = ''
}

const loadSermon = (sermon: SermonItem) => {
  form.value = {
    title: sermon.title,
    preacher: sermon.preacher,
    sermonDate: sermon.sermonDate.slice(0, 10),
    description: sermon.description || '',
    reflection: sermon.reflection || ''
  }
  selectedFiles.value = {}
  previewUrls.value = {}
  existingPdfUrls.value = Object.fromEntries(
    sermon.pdfFiles.flatMap((pdf) => {
      const slot = pdfSlots.find((item) => item.type === pdf.type)
      return slot ? [[slot.key, pdf.url]] : []
    }),
  ) as PreviewUrls
  createdSermonId.value = sermon.id
  uploadedPdfKeys.value = new Set()
  error.value = ''
}

const handleFileChange = (key: PdfKey, event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) return

  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    error.value = `${pdfSlots.find((slot) => slot.key === key)?.label} must be a PDF file.`
    return
  }

  clearPreviewUrl(key)
  selectedFiles.value[key] = file
  uploadedPdfKeys.value.delete(key)
  previewUrls.value[key] = URL.createObjectURL(file)
  error.value = ''
}

const removeFile = (key: PdfKey) => {
  clearPreviewUrl(key)
  selectedFiles.value = omitKey(selectedFiles.value, key)
  uploadedPdfKeys.value.delete(key)
}

const close = () => {
  if (!isLoading.value) open.value = false
}

const saveSermon = async () => {
  error.value = ''

  if (!form.value.title.trim() || !form.value.preacher.trim() || !form.value.sermonDate) {
    error.value = 'Add a title, preacher, and sermon date.'
    return
  }

  if (!isEditing.value && selectedFileCount.value === 0) {
    error.value = 'Select at least one PDF before creating the sermon.'
    return
  }

  isLoading.value = true

  try {
    let savedSermon: SermonItem

    if (isEditing.value) {
      const response = await SermonsService.update(props.sermon!.id, {
        title: form.value.title.trim(),
        preacher: form.value.preacher.trim(),
        sermonDate: form.value.sermonDate,
        description: form.value.description.trim() || null,
        reflection: form.value.reflection.trim() || null,
      })
      savedSermon = response.data
      createdSermonId.value = response.data.id
    } else if (!createdSermonId.value) {
      const response = await SermonsService.create({
        title: form.value.title.trim(),
        preacher: form.value.preacher.trim(),
        sermonDate: form.value.sermonDate,
        description: form.value.description.trim() || null,
        reflection: form.value.reflection.trim() || null,
      })
      savedSermon = response.data
      createdSermonId.value = response.data.id
    } else {
      savedSermon = props.sermon!
    }

    for (const slot of pdfSlots) {
      const file = selectedFiles.value[slot.key]
      if (file && !uploadedPdfKeys.value.has(slot.key)) {
        const response = await SermonsService.uploadPdf(createdSermonId.value!, file, slot.type)
        savedSermon = response.data
        uploadedPdfKeys.value.add(slot.key)
      }
    }

    emit('saved', savedSermon)
    open.value = false
    resetForm()
  } catch {
    error.value = isEditing.value
      ? 'Unable to update the sermon. Please try again.'
      : createdSermonId.value
        ? 'The sermon was created, but a PDF upload failed. Check the selected files and try again.'
        : 'Unable to create the sermon. Please try again.'
  } finally {
    isLoading.value = false
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    if (props.sermon) loadSermon(props.sermon)
    else resetForm()
  }
})

watch(() => props.sermon, (sermon) => {
  if (open.value && sermon) loadSermon(sermon)
})

onUnmounted(() => {
  Object.keys(previewUrls.value).forEach((key) => clearPreviewUrl(key as PdfKey))
})
</script>

<template>
  <USlideover
    v-model:open="open"
    side="right"
    :ui="{ content: 'w-full max-w-xl bg-background' }"
  >
    <template #content>
      <form class="flex h-full flex-col" @submit.prevent="saveSermon">
        <div class="flex items-start justify-between border-b border-primary/10 p-6">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Sermon library
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              {{ isEditing ? 'Edit sermon' : 'Add a sermon' }}
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ isEditing
                ? 'Update the message details or replace a PDF document.'
                : 'Add the message details and up to three supporting PDFs.' }}
            </p>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close add sermon sidebar"
            class="rounded-full"
            @click="close"
          />
        </div>

        <div class="flex-1 space-y-6 overflow-y-auto p-6">
          <div class="grid gap-4 sm:grid-cols-2">
            <CInput
              v-model="form.title"
              label="Sermon title"
              placeholder="The hope we share"
              required
              class="sm:col-span-2"
            />
            <CInput
              v-model="form.preacher"
              label="Preacher"
              placeholder="Rev. Grace Williams"
              required
            />
            <CInput
              v-model="form.sermonDate"
              label="Sermon date"
              type="date"
              required
            />
            <CInput
              v-model="form.description"
              label="Gospel"
              placeholder="Gospel"
              textarea
              class="sm:col-span-2"
            />
            <CInput
              v-model="form.reflection"
              label="Priest's Reflection"
              placeholder="Priest's Reflection"
              textarea
              class="sm:col-span-2"
            />
          </div>

          <section>
            <div class="mb-3 flex items-end justify-between gap-4">
              <div>
                <h3 class="text-sm font-semibold text-foreground">PDF documents</h3>
                <p class="mt-1 text-xs text-muted-foreground">
                  {{ selectedFileCount }} of {{ pdfSlots.length }} documents selected
                </p>
              </div>
              <span class="text-xs text-muted-foreground">PDF only</span>
            </div>

            <UAccordion
              :items="accordionItems"
              type="multiple"
              :default-value="['pewsheet']"
              :ui="{ item: 'border-primary/10' }"
            >
              <template #body="{ item }">
                <div class="space-y-4 pb-4">
                  <p class="text-sm text-muted-foreground">
                    {{ pdfSlots.find((slot) => slot.key === item.value)?.description }}
                  </p>

                  <label
                    class="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-primary/25 bg-white/40 p-4 transition-colors hover:border-primary hover:bg-white/70"
                  >
                    <span class="flex min-w-0 items-center gap-3">
                      <UIcon name="i-lucide-file-up" class="size-5 shrink-0 text-primary" />
                      <span class="min-w-0">
                        <span class="block truncate text-sm font-medium text-foreground">
                          {{ selectedFiles[item.value as PdfKey]?.name || (existingPdfUrls[item.value as PdfKey] ? 'Existing PDF document' : 'Choose a PDF document') }}
                        </span>
                        <span class="block text-xs text-muted-foreground">
                          {{ selectedFiles[item.value as PdfKey] ? 'Ready to preview' : existingPdfUrls[item.value as PdfKey] ? 'Existing document loaded' : 'Click to browse files' }}
                        </span>
                      </span>
                    </span>
                    <span class="shrink-0 text-xs font-semibold text-primary">Browse</span>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      class="sr-only"
                      @change="handleFileChange(item.value as PdfKey, $event)"
                    >
                  </label>

                  <div
                    v-if="previewUrls[item.value as PdfKey] || existingPdfUrls[item.value as PdfKey]"
                    class="overflow-hidden rounded-xl border border-primary/10 bg-white"
                  >
                    <div class="flex items-center justify-between border-b border-primary/10 px-4 py-3">
                      <span class="text-xs font-medium text-muted-foreground">PDF preview</span>
                      <UButton
                        v-if="selectedFiles[item.value as PdfKey]"
                        type="button"
                        label="Remove"
                        icon="i-lucide-trash-2"
                        color="error"
                        variant="ghost"
                        size="xs"
                        @click="removeFile(item.value as PdfKey)"
                      />
                    </div>
                    <iframe
                      :src="previewUrls[item.value as PdfKey] || existingPdfUrls[item.value as PdfKey]"
                      :title="`${item.label} PDF preview`"
                      class="h-72 w-full bg-muted"
                    />
                  </div>
                </div>
              </template>
            </UAccordion>
          </section>

          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div class="flex justify-end gap-3 border-t border-primary/10 p-6">
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
            :label="isEditing ? 'Save changes' : 'Create sermon'"
            icon="i-lucide-book-open-check"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />
        </div>
      </form>
    </template>
  </USlideover>
</template>
