<script setup lang="ts">
import { ref, watch } from "vue";

import { CInput } from "~/components/common";
import { ChurchInfoService } from "~/services/church-info.service";
import { useChurchInfoStore } from "~/stores/church-info.store";

const open = defineModel<boolean>("open", { default: false });
const churchInfoStore = useChurchInfoStore();

const address = ref("");
const phone = ref("");
const email = ref("");
const facebookUrl = ref("");
const youtubeUrl = ref("");
const instagramUrl = ref("");
const isSaving = ref(false);
const error = ref("");

const resetForm = () => {
  const info = churchInfoStore.churchInfo;
  address.value = info?.address ?? "";
  phone.value = info?.phone ?? "";
  email.value = info?.email ?? "";
  facebookUrl.value = info?.facebookUrl ?? "";
  youtubeUrl.value = info?.youtubeUrl ?? "";
  instagramUrl.value = info?.instagramUrl ?? "";
  error.value = "";
};

watch(open, (isOpen) => {
  if (isOpen) resetForm();
});

const close = () => {
  if (!isSaving.value) open.value = false;
};

const save = async () => {
  isSaving.value = true;
  error.value = "";

  try {
    const response = await ChurchInfoService.update({
      address: address.value || null,
      phone: phone.value || null,
      email: email.value || null,
      facebookUrl: facebookUrl.value || null,
      youtubeUrl: youtubeUrl.value || null,
      instagramUrl: instagramUrl.value || null,
    });

    churchInfoStore.churchInfo = {
      ...churchInfoStore.churchInfo,
      ...response.data,
      address: address.value || null,
      phone: phone.value || null,
      email: email.value || null,
      facebookUrl: facebookUrl.value || null,
      youtubeUrl: youtubeUrl.value || null,
      instagramUrl: instagramUrl.value || null,
    };
    open.value = false;
  } catch {
    error.value = "Unable to update contact information. Please try again.";
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content: 'flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl max-h-[calc(100dvh-2rem)]',
    }"
  >
    <template #content>
      <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="save">
        <div class="flex shrink-0 items-start justify-between gap-4 border-b border-primary/10 px-6 py-5">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Contact section
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Edit contact information
            </h2>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close contact editor"
            class="rounded-full"
            :disabled="isSaving"
            @click="close"
          />
        </div>

        <div class="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
          <CInput v-model="address" label="Address" placeholder="Church address" textarea />
          <div class="grid gap-4 sm:grid-cols-2">
            <CInput v-model="phone" label="Phone" placeholder="Phone number" type="tel" />
            <CInput v-model="email" label="Email" placeholder="Email address" type="email" />
            <CInput v-model="facebookUrl" label="Facebook URL" placeholder="https://facebook.com/..." type="url" />
            <CInput v-model="instagramUrl" label="Instagram URL" placeholder="https://instagram.com/..." type="url" />
            <div class="sm:col-span-2">
              <CInput v-model="youtubeUrl" label="YouTube URL" placeholder="https://youtube.com/..." type="url" />
            </div>
          </div>
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div class="flex shrink-0 justify-end gap-3 border-t border-primary/10 bg-background px-6 py-4">
          <UButton type="button" label="Cancel" color="neutral" variant="soft" class="rounded-xl" :disabled="isSaving" @click="close" />
          <UButton type="submit" label="Save changes" icon="i-lucide-check" color="primary" class="rounded-xl" :loading="isSaving" />
        </div>
      </form>
    </template>
  </UModal>
</template>
