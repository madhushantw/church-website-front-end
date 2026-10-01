<script setup lang="ts">
import { CInput } from "~/components/common";
import {
  MissionPartnersService,
  type MissionPartner,
} from "~/services/mission-partners.service";

interface MissionPartnerForm {
  type: string;
  title: string;
  description: string;
  link: string;
}

const open = defineModel<boolean>("open", { default: false });
const props = defineProps<{
  missionPartner?: MissionPartner | null;
}>();
const emit = defineEmits<{
  saved: [missionPartner: MissionPartner];
}>();

const initialForm = (): MissionPartnerForm => ({
  type: "",
  title: "",
  description: "",
  link: "",
});

const form = ref<MissionPartnerForm>(initialForm());
const isLoading = ref(false);
const error = ref("");
const isEditing = computed(() => !!props.missionPartner);

const resetForm = () => {
  form.value = initialForm();
  error.value = "";
};

const loadMissionPartner = (missionPartner: MissionPartner) => {
  form.value = {
    type: missionPartner.type,
    title: missionPartner.title,
    description: missionPartner.description || "",
    link: missionPartner.link,
  };
  error.value = "";
};

const close = () => {
  if (!isLoading.value) open.value = false;
};

const saveMissionPartner = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const data = {
      type: form.value.type.trim(),
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      link: form.value.link.trim(),
    };
    const response = isEditing.value
      ? await MissionPartnersService.update(props.missionPartner!.id, data)
      : await MissionPartnersService.create(data);
    emit("saved", response.data);
    open.value = false;
    resetForm();
  } catch {
    error.value = isEditing.value
      ? "Unable to update this mission partner. Please try again."
      : "Unable to add this mission partner. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

watch(open, (isOpen) => {
  if (isOpen) {
    if (props.missionPartner) loadMissionPartner(props.missionPartner);
    else resetForm();
  }
});

watch(() => props.missionPartner, (missionPartner) => {
  if (open.value && missionPartner) loadMissionPartner(missionPartner);
});
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
      <form class="p-6 sm:p-8" @submit.prevent="saveMissionPartner">
        <div class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              Giving
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              {{ isEditing ? "Edit mission partner" : "Add a mission partner" }}
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ isEditing
                ? "Update this organization’s mission partner details."
                : "Add an organization supported by Hope Valley Church." }}
            </p>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close mission partner dialog"
            class="rounded-full"
            :disabled="isLoading"
            @click="close"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <CInput
            v-model="form.title"
            label="Organization name"
            placeholder="Hands of Hope Foundation"
            required
            class="sm:col-span-2"
          />
          <CInput
            v-model="form.type"
            label="Mission type"
            placeholder="Local Mission"
            required
          />
          <CInput
            v-model="form.link"
            label="Website"
            placeholder="https://example.org"
            type="url"
            required
          />
          <CInput
            v-model="form.description"
            label="Description"
            placeholder="Describe this mission partner"
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
            :label="isEditing ? 'Save changes' : 'Add mission partner'"
            :icon="isEditing ? 'i-lucide-save' : 'i-lucide-plus'"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>