<script setup lang="ts">
import { ref, watch } from "vue";

import { CInput } from "~/components/common";
import { ChurchInfoService } from "~/services/church-info.service";
import { useChurchInfoStore } from "~/stores/church-info.store";

const open = defineModel<boolean>("open", { default: false });
const churchInfoStore = useChurchInfoStore();

const bankAccountName = ref("");
const bank = ref("");
const accountNumber = ref("");
const routingNumber = ref("");
const isSaving = ref(false);
const error = ref("");

const resetForm = () => {
  const info = churchInfoStore.churchInfo;
  bankAccountName.value = info?.bankAccountName ?? "";
  bank.value = info?.bank ?? "";
  accountNumber.value = info?.accountNumber ?? "";
  routingNumber.value = info?.routingNumber ?? "";
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
    const values = {
      bankAccountName: bankAccountName.value || null,
      bank: bank.value || null,
      accountNumber: accountNumber.value || null,
      routingNumber: routingNumber.value || null,
    };
    const response = await ChurchInfoService.update(values);

    churchInfoStore.churchInfo = {
      ...churchInfoStore.churchInfo,
      ...response.data,
      ...values,
    };
    open.value = false;
  } catch {
    error.value = "Unable to update transfer details. Please try again.";
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
      content: 'flex w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl max-h-[calc(100dvh-2rem)]',
    }"
  >
    <template #content>
      <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="save">
        <div class="flex shrink-0 items-start justify-between gap-4 border-b border-primary/10 px-6 py-5">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Giving options
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Edit online transfer
            </h2>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close transfer editor"
            class="rounded-full"
            :disabled="isSaving"
            @click="close"
          />
        </div>

        <div class="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
          <CInput v-model="bankAccountName" label="Account Name" placeholder="Account holder name" />
          <CInput v-model="bank" label="Bank" placeholder="Bank name" />
          <CInput v-model="accountNumber" label="Account Number" placeholder="Account number" />
          <CInput v-model="routingNumber" label="Routing Number" placeholder="Routing number" />
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
