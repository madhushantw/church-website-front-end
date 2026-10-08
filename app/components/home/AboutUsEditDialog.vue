<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { computed, ref, watch } from "vue";

import { CInput } from "../common";
import { ChurchInfoService, type ChurchInfo } from "~/services/church-info.service";
import { useChurchInfoStore } from "~/stores/church-info.store";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
  churchInfo: ChurchInfo | null;
}>();

const emit = defineEmits<{
  saved: [churchInfo: ChurchInfo];
}>();

const churchInfoStore = useChurchInfoStore();
const title = ref("");
const subtitle = ref("");
const aboutUsHtml = ref("");
const isSaving = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref("");
const error = ref("");

const editor = useEditor({
  extensions: [StarterKit],
  content: "",
  editorProps: {
    attributes: {
      class:
        "prose max-w-none min-h-[140px] w-full rounded-xl border border-primary/10 bg-background px-4 py-3 text-sm leading-7 text-foreground focus:outline-none",
    },
  },
  onUpdate: ({ editor }) => {
    aboutUsHtml.value = editor.getHTML();
  },
});

const hasImage = computed(() => Boolean(imagePreview.value || props.churchInfo?.aboutUsImage));

const resetForm = () => {
  title.value = props.churchInfo?.aboutUsTitle ?? "";
  subtitle.value = props.churchInfo?.aboutUsSubTitle ?? "";
  aboutUsHtml.value = props.churchInfo?.aboutUs ?? "";
  imageFile.value = null;
  imagePreview.value = "";
  error.value = "";

  if (editor.value) {
    editor.value.commands.setContent(aboutUsHtml.value || "<p></p>", { emitUpdate: false });
  }
};

watch(
  () => open.value,
  (isOpen) => {
    if (isOpen) resetForm();
  },
  { immediate: true },
);

const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  const validType = file.type.startsWith("image/");
  if (!validType) {
    error.value = "Please choose an image file.";
    input.value = "";
    return;
  }

  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }

  imagePreview.value = URL.createObjectURL(file);
  imageFile.value = file;
  error.value = "";
};

const close = () => {
  if (isSaving.value) return;
  open.value = false;
};

const saveContent = async () => {
  if (!editor.value) return;

  const html = editor.value.getHTML();
  aboutUsHtml.value = html;

  isSaving.value = true;
  error.value = "";

  try {
    const response = await ChurchInfoService.update(
      {
        aboutUsTitle: title.value || null,
        aboutUsSubTitle: subtitle.value || null,
        aboutUs: aboutUsHtml.value || null,
      },
      imageFile.value ? { aboutUsImage: imageFile.value } : {},
    );

    churchInfoStore.churchInfo = response.data;
    emit("saved", response.data);
    open.value = false;
  } catch {
    error.value = "Unable to update About Us content. Please try again.";
  } finally {
    isSaving.value = false;
  }
};

onBeforeUnmount(() => {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value);
});
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30',
      content:
        'w-full max-w-3xl overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form class="flex max-h-[calc(100dvh-2rem)] flex-col" @submit.prevent="saveContent">
        <div class="flex items-start justify-between gap-4 border-b border-primary/10 px-6 py-5">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              About us
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Edit section
            </h2>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close editor"
            class="rounded-full"
            @click="close"
          />
        </div>

        <div class="max-h-[70vh] space-y-5 overflow-y-auto p-6">
          <div class="grid gap-4 md:grid-cols-2">
            <CInput v-model="title" label="Title" placeholder="About us title" />
            <CInput v-model="subtitle" label="Subtitle" placeholder="About us subtitle" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-foreground">Main text</label>
            <EditorContent :editor="editor" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-foreground">Image</label>

            <div v-if="hasImage" class="mb-4 overflow-hidden rounded-2xl border border-primary/10">
              <img
                :src="imagePreview || props.churchInfo?.aboutUsImage || ''"
                alt="About us preview"
                class="h-56 w-full object-cover"
              >
            </div>

            <input
              type="file"
              accept="image/*"
              class="block w-full rounded-xl border border-primary/10 bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
              @change="handleImageChange"
            >
          </div>

          <p v-if="error" class="text-sm text-red-600">
            {{ error }}
          </p>
        </div>

        <div class="flex justify-end gap-3 border-t border-primary/10 px-6 py-4">
          <UButton type="button" label="Cancel" color="neutral" variant="soft" class="rounded-xl" :disabled="isSaving" @click="close" />
          <UButton type="submit" label="Save changes" icon="i-lucide-check" color="primary" class="rounded-xl" :loading="isSaving" />
        </div>
      </form>
    </template>
  </UModal>
</template>
