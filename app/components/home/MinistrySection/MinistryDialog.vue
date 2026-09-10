<script setup lang="ts">
import {
  MinistriesService,
  MinistryType,
  type MinistryItem,
} from "~/services/ministries.service";
import { CInput } from "~/components/common";

interface MinistryForm {
  name: string;
  type: MinistryType;
  description: string;
  image: string;
  leader: string;
}

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{
  created: [ministry: MinistryItem];
}>();

const initialForm = (): MinistryForm => ({
  name: "",
  type: MinistryType.GENERAL,
  description: "",
  image: "",
  leader: "",
});

const form = ref<MinistryForm>(initialForm());
const isLoading = ref(false);
const error = ref("");

const ministryTypes = Object.values(MinistryType);
const ministryIcons: Record<MinistryType, string> = {
  [MinistryType.GENERAL]: "lucide:church",
  [MinistryType.CHILDREN]: "lucide:baby",
  [MinistryType.YOUTH]: "lucide:users",
  [MinistryType.WOMEN]: "lucide:heart",
  [MinistryType.MEN]: "lucide:user-round",
  [MinistryType.WORSHIP]: "lucide:music",
  [MinistryType.OUTREACH]: "lucide:hand-heart",
  [MinistryType.PRAYER]: "lucide:hand-heart",
  [MinistryType.MEDIA]: "lucide:video",
};
const ministryColors: Record<MinistryType, string> = {
  [MinistryType.GENERAL]: "primary",
  [MinistryType.CHILDREN]: "primary",
  [MinistryType.YOUTH]: "primary",
  [MinistryType.WOMEN]: "accent",
  [MinistryType.MEN]: "primary",
  [MinistryType.WORSHIP]: "primary",
  [MinistryType.OUTREACH]: "accent",
  [MinistryType.PRAYER]: "primary",
  [MinistryType.MEDIA]: "primary",
};

const ministryLabel = (type: MinistryType) =>
  type.charAt(0).toUpperCase() + type.slice(1);

const resetForm = () => {
  form.value = initialForm();
  error.value = "";
};

const close = () => {
  if (!isLoading.value) open.value = false;
};

const createMinistry = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const response = await MinistriesService.create(form.value);
    emit("created", response.data);
    open.value = false;
    resetForm();
  } catch {
    error.value = "Unable to create the ministry. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content:
        'max-w-2xl rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form class="p-6 sm:p-8" @submit.prevent="createMinistry">
        <div class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              Church community
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Add a ministry
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Create a ministry for the church directory.
            </p>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close add ministry dialog"
            class="rounded-full"
            @click="close"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <CInput
            v-model="form.name"
            label="Ministry name"
            placeholder="Community outreach"
            required
            class="sm:col-span-2"
          />
          <div class="sm:col-span-2">
            <label
              class="mb-1.5 block text-[13px] font-medium text-foreground/70"
            >
              Ministry type
            </label>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="type in ministryTypes"
                :key="type"
                class="flex flex-col items-center text-center text-[11px]"
              >
                <span
                  class="flex h-14 w-14 items-center justify-center rounded-lg border-2 transition-colors"
                  :class="form.type === type ? 'border-2 border-primary' : 'border-transparent'"
                  :style="{
                    backgroundColor: `color-mix(in srgb, var(--color-${ministryColors[type]}) 10%, transparent)`,
                  }"
                  @click="form.type = type"
                >
                  <UIcon
                    :name="ministryIcons[type]"
                    size="26"
                    :style="{
                      color: `var(--color-${ministryColors[type]})`,
                    }"
                  />
                </span>
                <span>{{ ministryLabel(type) }}</span>
              </div>
            </div>
          </div>
          <CInput
            v-model="form.leader"
            label="Leader"
            placeholder="Ministry leader"
            class="sm:col-span-2"
          />
          <CInput
            v-model="form.image"
            label="Image URL"
            placeholder="https://example.com/ministry.jpg"
            class="sm:col-span-2"
          />
          <CInput
            v-model="form.description"
            label="Description"
            placeholder="Describe this ministry"
            textarea
            class="sm:col-span-2"
          />
        </div>

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
            label="Create ministry"
            icon="i-lucide-plus"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
