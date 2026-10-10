<script setup lang="ts">
import { CInput } from "~/components/common";
import {
  MinistriesService,
  MinistryType,
  type MinistryItem,
} from "~/services/ministries.service";

interface MinistryForm {
  name: string;
  type: MinistryType;
  description: string;
  image: File | null;
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
  image: null,
  leader: "",
});

const form = ref<MinistryForm>(initialForm());
const imagePreview = ref("");
const imageInput = ref<HTMLInputElement | null>(null);
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

const ministryColors: Record<
  MinistryType,
  { background: string; icon: string }
> = {
  [MinistryType.GENERAL]: {
    background: "bg-teal-600/10",
    icon: "text-teal-600",
  },
  [MinistryType.CHILDREN]: {
    background: "bg-orange-400/10",
    icon: "text-orange-500",
  },
  [MinistryType.YOUTH]: {
    background: "bg-sky-600/10",
    icon: "text-sky-600",
  },
  [MinistryType.WOMEN]: {
    background: "bg-rose-500/10",
    icon: "text-rose-500",
  },
  [MinistryType.MEN]: {
    background: "bg-slate-600/10",
    icon: "text-slate-600",
  },
  [MinistryType.WORSHIP]: {
    background: "bg-amber-500/10",
    icon: "text-amber-600",
  },
  [MinistryType.OUTREACH]: {
    background: "bg-emerald-600/10",
    icon: "text-emerald-600",
  },
  [MinistryType.PRAYER]: {
    background: "bg-violet-500/10",
    icon: "text-violet-500",
  },
  [MinistryType.MEDIA]: {
    background: "bg-orange-600/10",
    icon: "text-orange-600",
  },
};

const ministryLabel = (type: MinistryType) =>
  type.charAt(0).toUpperCase() + type.slice(1);

const clearImagePreview = () => {
  if (imagePreview.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreview.value);
  }

  imagePreview.value = "";
};

const resetForm = () => {
  clearImagePreview();
  form.value = initialForm();
  error.value = "";

  if (imageInput.value) {
    imageInput.value.value = "";
  }
};

const loadMinistry = (ministry: MinistryItem) => {
  clearImagePreview();

  form.value = {
    name: ministry.name,
    type: ministry.type,
    description: ministry.description || "",
    image: null,
    leader: ministry.leader || "",
  };

  imagePreview.value = ministry.image || "";
  error.value = "";

  if (imageInput.value) {
    imageInput.value.value = "";
  }
};

const selectImage = (event: Event) => {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    error.value = "Please select a valid image file.";
    input.value = "";
    return;
  }

  clearImagePreview();

  form.value.image = file;
  imagePreview.value = URL.createObjectURL(file);
  error.value = "";
};

const close = () => {
  if (!isLoading.value) {
    open.value = false;
  }
};

const saveMinistry = async () => {

  isLoading.value = true;
  error.value = "";

  const data = {
    name: form.value.name.trim(),
    type: form.value.type,
    description: form.value.description.trim(),
    leader: form.value.leader.trim(),
  };

  try {
    const response = isEditing.value
      ? await MinistriesService.update(props.ministry!.id, {
          ...data,
          ...(form.value.image ? { image: form.value.image } : {}),
        })
      : await MinistriesService.create({
          ...data,
          ...(form.value.image ? { image: form.value.image } : {}),
        });

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
  } else {
    resetForm();
  }
});

watch(
  () => props.ministry,
  (ministry) => {
    if (open.value) {
      if (ministry) loadMinistry(ministry);
      else resetForm();
    }
  },
);

onBeforeUnmount(clearImagePreview);
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content:
        'w-full max-w-2xl overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form
        class="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[calc(100dvh-4rem)]"
        @submit.prevent="saveMinistry"
      >
        <div
          class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8"
        >
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
              {{
                isEditing
                  ? "Update this ministry in the church directory."
                  : "Create a ministry for the church directory."
              }}
            </p>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close add ministry dialog"
            class="shrink-0 rounded-full"
            @click="close"
          />
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
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
                      form.type === type
                        ? 'border-primary'
                        : 'border-transparent',
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
            <div class="sm:col-span-2">
              <label
                for="ministry-image"
                class="mb-1.5 block text-[13px] font-medium text-foreground/70"
              >
                Ministry image
              </label>
              <input
                id="ministry-image"
                ref="imageInput"
                type="file"
                accept="image/*"
                :disabled="isLoading"
                class="block w-full cursor-pointer rounded-xl border border-primary/20 bg-background px-3 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-medium file:text-primary hover:file:bg-primary/15"
                @change="selectImage"
              >
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Ministry image preview"
                class="mt-4 h-44 w-full max-w-sm rounded-xl object-cover"
              >
            </div>
          </div>

          <p v-if="error" class="mt-4 text-sm text-red-600">
            {{ error }}
          </p>
        </div>

        <div
          class="flex shrink-0 justify-end gap-3 border-t border-primary/10 px-6 py-4 sm:px-8"
        >
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
