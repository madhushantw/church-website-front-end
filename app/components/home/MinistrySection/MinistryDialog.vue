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
const props = defineProps<{
  ministry?: MinistryItem | null;
}>();
const emit = defineEmits<{
  saved: [ministry: MinistryItem];
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
const isEditing = computed(() => !!props.ministry);

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
const ministryColors: Record<MinistryType, { background: string; icon: string }> = {
  [MinistryType.GENERAL]: { background: "bg-teal-600/10", icon: "text-teal-600" },
  [MinistryType.CHILDREN]: { background: "bg-orange-400/10", icon: "text-orange-500" },
  [MinistryType.YOUTH]: { background: "bg-sky-600/10", icon: "text-sky-600" },
  [MinistryType.WOMEN]: { background: "bg-rose-500/10", icon: "text-rose-500" },
  [MinistryType.MEN]: { background: "bg-slate-600/10", icon: "text-slate-600" },
  [MinistryType.WORSHIP]: { background: "bg-amber-500/10", icon: "text-amber-600" },
  [MinistryType.OUTREACH]: { background: "bg-emerald-600/10", icon: "text-emerald-600" },
  [MinistryType.PRAYER]: { background: "bg-violet-500/10", icon: "text-violet-500" },
  [MinistryType.MEDIA]: { background: "bg-orange-600/10", icon: "text-orange-600" },
};

const ministryLabel = (type: MinistryType) =>
  type.charAt(0).toUpperCase() + type.slice(1);

const resetForm = () => {
  form.value = initialForm();
  error.value = "";
};

const loadMinistry = (ministry: MinistryItem) => {
  form.value = {
    name: ministry.name,
    type: ministry.type,
    description: ministry.description || "",
    image: ministry.image || "",
    leader: ministry.leader || "",
  };
  error.value = "";
};

const close = () => {
  if (!isLoading.value) open.value = false;
};

const saveMinistry = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const response = isEditing.value
      ? await MinistriesService.update(props.ministry!.id, form.value)
      : await MinistriesService.create(form.value);
    emit("saved", response.data);
    open.value = false;
    resetForm();
  } catch {
    error.value = isEditing.value
      ? "Unable to update the ministry. Please try again."
      : "Unable to create the ministry. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

watch(open, (isOpen) => {
  if (isOpen) {
    if (props.ministry) loadMinistry(props.ministry);
    else resetForm();
  }
});

watch(() => props.ministry, (ministry) => {
  if (open.value && ministry) loadMinistry(ministry);
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
      <form class="p-6 sm:p-8" @submit.prevent="saveMinistry">
        <div class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              Church community
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              {{ isEditing ? "Edit ministry" : "Add a ministry" }}
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ isEditing
                ? "Update this ministry in the church directory."
                : "Create a ministry for the church directory." }}
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
                  :class="[
                    ministryColors[type].background,
                    form.type === type ? 'border-primary' : 'border-transparent',
                  ]"
                  @click="form.type = type"
                >
                  <UIcon
                    :name="ministryIcons[type]"
                    size="26"
                    :class="ministryColors[type].icon"
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
            :label="isEditing ? 'Save changes' : 'Create ministry'"
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
