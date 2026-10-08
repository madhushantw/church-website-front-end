<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { CInput } from "../common";
import { ChurchInfoService } from "~/services/church-info.service";
import { useChurchInfoStore } from "~/stores/church-info.store";

const open = defineModel<boolean>("open", { default: false });
const churchInfoStore = useChurchInfoStore();

const pastorName = ref("");
const pastorTitle1 = ref("");
const pastorTitle2 = ref("");
const pastorMessage1 = ref("");
const pastorMessage2 = ref("");
const video1 = ref("");
const avatarFile = ref<File | null>(null);
const avatarPreview = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const isSaving = ref(false);
const error = ref("");

const currentAvatar = computed(
  () => avatarPreview.value || churchInfoStore.churchInfo?.pastorAvatar || "",
);

const resetForm = () => {
  const info = churchInfoStore.churchInfo;
  pastorName.value = info?.pastorName ?? "";
  pastorTitle1.value = info?.pastorTitle1 ?? "";
  pastorTitle2.value = info?.pastorTitle2 ?? "";
  pastorMessage1.value = info?.pastorMessage1 ?? "";
  pastorMessage2.value = info?.pastorMessage2 ?? "";
  video1.value = info?.video1 ?? "";
  avatarFile.value = null;
  if (avatarPreview.value.startsWith("blob:"))
    URL.revokeObjectURL(avatarPreview.value);
  avatarPreview.value = "";
  error.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

watch(open, (isOpen) => {
  if (isOpen) resetForm();
});

const selectAvatar = (event: Event) => {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    error.value = "Choose an image file for the pastor avatar.";
    input.value = "";
    return;
  }

  if (avatarPreview.value.startsWith("blob:"))
    URL.revokeObjectURL(avatarPreview.value);
  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
  error.value = "";
};

const close = () => {
  if (!isSaving.value) open.value = false;
};

const save = async () => {
  isSaving.value = true;
  error.value = "";

  try {
    const response = await ChurchInfoService.update(
      {
        pastorName: pastorName.value || null,
        pastorTitle1: pastorTitle1.value || null,
        pastorTitle2: pastorTitle2.value || null,
        pastorMessage1: pastorMessage1.value || null,
        pastorMessage2: pastorMessage2.value || null,
        video1: video1.value || null,
      },
      avatarFile.value ? { pastorAvatar: avatarFile.value } : {},
    );

    churchInfoStore.churchInfo = response.data;
    open.value = false;
  } catch {
    error.value =
      "Unable to update the pastor welcome section. Please try again.";
  } finally {
    isSaving.value = false;
  }
};

onBeforeUnmount(() => {
  if (avatarPreview.value.startsWith("blob:"))
    URL.revokeObjectURL(avatarPreview.value);
});
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content:
        'flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl max-h-[calc(100dvh-2rem)]',
    }"
  >
    <template #content>
      <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="save">
        <div
          class="flex shrink-0 items-start justify-between gap-4 border-b border-primary/10 px-6 py-5"
        >
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              Welcome section
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Edit pastor message
            </h2>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close pastor editor"
            class="rounded-full"
            :disabled="isSaving"
            @click="close"
          />
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto p-6">
          <div class="space-y-5">
            <div class="grid gap-4 sm:grid-cols-2">
              <CInput
                v-model="pastorName"
                label="Pastor name"
                placeholder="Pastor name"
              />
              <CInput
                v-model="pastorTitle1"
                label="First title"
                placeholder="Role or title"
              />
              <CInput
                v-model="pastorTitle2"
                label="Second title"
                placeholder="Church or additional title"
              />
              <CInput
                v-model="video1"
                label="Welcome video URL"
                placeholder="https://..."
                type="url"
              />
              <div class="sm:col-span-2">
                <CInput
                  v-model="pastorMessage1"
                  label="First message"
                  placeholder="A short welcome from the pastor"
                  textarea
                />
              </div>
              <div class="sm:col-span-2">
                <CInput
                  v-model="pastorMessage2"
                  label="Second message"
                  placeholder="Additional welcome information"
                  textarea
                />
              </div>
            </div>
            <div>
              <label
                for="pastor-avatar"
                class="mb-1.5 block text-[13px] font-medium text-foreground/70"
              >
                Pastor avatar
              </label>
              <input
                id="pastor-avatar"
                ref="fileInput"
                type="file"
                accept="image/*"
                :disabled="isSaving"
                class="block w-full rounded-xl border border-primary/20 bg-background px-3 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-medium file:text-primary"
                @change="selectAvatar"
              >
              <img
                v-if="currentAvatar"
                :src="currentAvatar"
                alt="Pastor avatar preview"
                class="mt-4 h-24 w-24 rounded-full border-2 border-primary/20 object-cover"
              >
            </div>
            <p v-if="error" class="text-sm text-red-600">
              {{ error }}
            </p>
          </div>
        </div>
        <div
          class="flex shrink-0 justify-end gap-3 border-t border-primary/10 bg-background px-6 py-4"
        >
          <UButton
            type="button"
            label="Cancel"
            color="neutral"
            variant="soft"
            class="rounded-xl"
            :disabled="isSaving"
            @click="close"
          />
          <UButton
            type="submit"
            label="Save changes"
            icon="i-lucide-check"
            color="primary"
            class="rounded-xl"
            :loading="isSaving"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
