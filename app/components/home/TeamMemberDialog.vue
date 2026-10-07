<script setup lang="ts">
import { CInput } from "~/components/common";
import {
  TeamMembersService,
  type TeamMember,
} from "~/services/team-members.service";

interface TeamMemberForm {
  name: string;
  email: string;
  title: string;
  photo: File | null;
}

const open = defineModel<boolean>("open", { default: false });
const props = defineProps<{
  member?: TeamMember | null;
}>();
const emit = defineEmits<{
  saved: [member: TeamMember];
  deleted: [id: string];
}>();

const initialForm = (): TeamMemberForm => ({
  name: "",
  email: "",
  title: "",
  photo: null,
});

const form = ref<TeamMemberForm>(initialForm());
const photoPreview = ref("");
const photoInput = ref<HTMLInputElement | null>(null);
const isLoading = ref(false);
const isDeleting = ref(false);
const confirmDelete = ref(false);
const error = ref("");
const isEditing = computed(() => !!props.member);

const clearPhotoPreview = () => {
  if (photoPreview.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreview.value);
  }
  photoPreview.value = "";
};

const resetForm = () => {
  clearPhotoPreview();
  form.value = initialForm();
  error.value = "";
  confirmDelete.value = false;
  if (photoInput.value) photoInput.value.value = "";
};

const loadMember = (member: TeamMember) => {
  clearPhotoPreview();
  form.value = {
    name: member.name,
    email: member.email,
    title: member.title,
    photo: null,
  };
  photoPreview.value = member.photo;
  error.value = "";
  confirmDelete.value = false;
  if (photoInput.value) photoInput.value.value = "";
};

const selectPhoto = (event: Event) => {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    error.value = "Select an image file for the team member photo.";
    input.value = "";
    return;
  }

  clearPhotoPreview();
  form.value.photo = file;
  photoPreview.value = URL.createObjectURL(file);
  error.value = "";
};

const close = () => {
  if (!isLoading.value && !isDeleting.value) open.value = false;
};

const saveMember = async () => {
  if (!isEditing.value && !form.value.photo) {
    error.value = "Select a photo for this team member.";
    return;
  }

  isLoading.value = true;
  error.value = "";

  const data = {
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    title: form.value.title.trim(),
  };

  try {
    const response = isEditing.value
      ? await TeamMembersService.update(props.member!.id, {
          ...data,
          ...(form.value.photo ? { photo: form.value.photo } : {}),
        })
      : await TeamMembersService.create({
          ...data,
          photo: form.value.photo!,
        });
    emit("saved", response.data);
    open.value = false;
    resetForm();
  } catch {
    error.value = isEditing.value
      ? "Unable to update this team member. Please try again."
      : "Unable to add this team member. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const deleteMember = async () => {
  if (!props.member) return;

  isDeleting.value = true;
  error.value = "";

  try {
    await TeamMembersService.delete(props.member.id);
    emit("deleted", props.member.id);
    open.value = false;
    resetForm();
  } catch {
    error.value = "Unable to delete this team member. Please try again.";
  } finally {
    isDeleting.value = false;
  }
};

watch(open, (isOpen) => {
  if (!isOpen) {
    resetForm();
    return;
  }
  if (props.member) loadMember(props.member);
  else resetForm();
});

watch(() => props.member, (member) => {
  if (open.value && member) loadMember(member);
});

onBeforeUnmount(clearPhotoPreview);
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
        @submit.prevent="saveMember"
      >
        <div
          class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8"
        >
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              Our Team
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              {{ isEditing ? "Edit team member" : "Add a team member" }}
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Manage a Church Council, staff, or ministry director profile.
            </p>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close team member dialog"
            class="shrink-0 rounded-full"
            :disabled="isLoading || isDeleting"
            @click="close"
          />
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <div class="grid gap-4 sm:grid-cols-2">
            <CInput
              v-model="form.name"
              label="Name"
              placeholder="Team member name"
              required
            />
            <CInput
              v-model="form.title"
              label="Title"
              placeholder="Church Council Chair"
              required
            />
            <CInput
              v-model="form.email"
              label="Email"
              placeholder="name@example.org"
              type="email"
              required
            />
            <div class="sm:col-span-2">
              <label
                for="team-member-photo"
                class="mb-1.5 block text-[13px] font-medium text-foreground/70"
              >
                Photo {{ isEditing ? "(optional replacement)" : "(required)" }}
              </label>
              <input
                id="team-member-photo"
                ref="photoInput"
                type="file"
                accept="image/*"
                :required="!isEditing"
                :disabled="isLoading || isDeleting"
                class="block w-full cursor-pointer rounded-xl border border-primary/20 bg-background px-3 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-medium file:text-primary hover:file:bg-primary/15"
                @change="selectPhoto"
              >
              <img
                v-if="photoPreview"
                :src="photoPreview"
                alt="Team member photo preview"
                class="mt-4 h-40 w-32 rounded-xl object-cover"
              >
            </div>
          </div>

          <div
            v-if="isEditing && confirmDelete"
            class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <p class="text-sm text-red-700">
              Delete {{ props.member?.name }} permanently?
            </p>
            <div class="flex gap-2">
              <UButton
                type="button"
                label="Keep member"
                color="neutral"
                variant="soft"
                size="sm"
                :disabled="isDeleting"
                @click="confirmDelete = false"
              />
              <UButton
                type="button"
                label="Confirm delete"
                color="error"
                size="sm"
                :loading="isDeleting"
                @click="deleteMember"
              />
            </div>
          </div>

          <p v-if="error" class="mt-4 text-sm text-red-600">
            {{ error }}
          </p>
        </div>

        <div
          class="flex shrink-0 flex-wrap justify-between gap-3 border-t border-primary/10 px-6 py-4 sm:px-8"
        >
          <UButton
            v-if="isEditing && !confirmDelete"
            type="button"
            label="Delete member"
            icon="i-lucide-trash-2"
            color="error"
            variant="soft"
            class="rounded-xl"
            :disabled="isLoading || isDeleting"
            @click="confirmDelete = true"
          />
          <span v-else />
          <div class="ml-auto flex gap-3">
            <UButton
              type="button"
              label="Cancel"
              color="neutral"
              variant="soft"
              class="rounded-xl"
              :disabled="isLoading || isDeleting"
              @click="close"
            />
            <UButton
              type="submit"
              :label="isEditing ? 'Save changes' : 'Add team member'"
              :icon="isEditing ? 'i-lucide-save' : 'i-lucide-plus'"
              color="primary"
              class="rounded-xl"
              :loading="isLoading"
            />
          </div>
        </div>
      </form>
    </template>
  </UModal>
</template>
