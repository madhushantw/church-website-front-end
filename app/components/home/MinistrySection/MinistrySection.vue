<script setup lang="ts">
import { useUserStore } from "~/stores/user.store";
import { UserRole } from "~/services/users.service";
import { CSection, CSectionHeading } from "../../common";
import {
  MinistriesService,
  type MinistryItem,
} from "~/services/ministries.service";
import MinistryCard from "./MinistryCard.vue";
import MinistryDialog from "./MinistryDialog.vue";

interface Ministry {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
  iconColor?: string;
}

const props = defineProps<{
  hideNavigationButton?: boolean
  allowCreate?: boolean
}>();

const userStore = useUserStore();
const deleteDialogOpen = ref(false);
const ministryToDelete = ref<Ministry | null>(null);
const isDeleting = ref(false);
const deleteError = ref("");
const selectedMinistry = ref<MinistryItem | null>(null);

const { items: ministryItems, loading, error } = useApiList<MinistryItem>(
  "ministries",
  MinistriesService.getAll,
  "Failed to load ministries",
);
const isMinistryDialogOpen = ref(false);

const ministries = computed<Ministry[]>(() =>
  ministryItems.value.map((ministry) => ({
    id: ministry.id,
    title: ministry.name,
    subtitle:
      ministry.description ||
      "Join us as we grow together in faith and service.",
    icon: ministryIcons[ministry.type],
    iconColor: ministryColors[ministry.type],
  })),
);

const canCreateMinistry = computed(
  () => props.allowCreate && userStore.user?.role === UserRole.ROOT,
);

const openCreateMinistry = () => {
  selectedMinistry.value = null;
  isMinistryDialogOpen.value = true;
};

const openEditMinistry = (ministry: Ministry) => {
  selectedMinistry.value =
    ministryItems.value.find((item) => item.id === ministry.id) || null;
  isMinistryDialogOpen.value = true;
};

const saveMinistry = (ministry: MinistryItem) => {
  const index = ministryItems.value.findIndex((item) => item.id === ministry.id);
  if (index !== -1) ministryItems.value[index] = ministry;
  else ministryItems.value = [ministry, ...ministryItems.value];
  console.log(ministryItems.value[index])
  selectedMinistry.value = null;
};

const openDeleteMinistry = (ministry: Ministry) => {
  ministryToDelete.value = ministry;
  deleteError.value = "";
  deleteDialogOpen.value = true;
};

const deleteMinistry = async () => {
  if (!ministryToDelete.value) return;

  isDeleting.value = true;
  deleteError.value = "";

  try {
    await MinistriesService.delete(ministryToDelete.value.id);
    ministryItems.value = ministryItems.value.filter(
      (ministry) => ministry.id !== ministryToDelete.value?.id,
    );
    deleteDialogOpen.value = false;
    ministryToDelete.value = null;
  } catch {
    deleteError.value = "Unable to delete this ministry. Please try again.";
  } finally {
    isDeleting.value = false;
  }
};

const ministryIcons: Record<MinistryItem["type"], string> = {
  general: "lucide:church",
  children: "lucide:baby",
  youth: "lucide:users",
  women: "lucide:heart",
  men: "lucide:user-round",
  worship: "lucide:music",
  outreach: "lucide:hand-heart",
  prayer: "lucide:hand-heart",
  media: "lucide:video",
};

const ministryColors: Record<MinistryItem["type"], string> = {
  general: "primary",
  children: "primary",
  youth: "primary",
  women: "accent",
  men: "primary",
  worship: "primary",
  outreach: "accent",
  prayer: "primary",
  media: "primary",
};

</script>

<template>
  <CSection id="ministries" background-color="muted">
    <CSectionHeading
      label="Ministries"
      title="Growing Together in Faith"
      sub-title="Find where your gifts, passions, and calling intersect with the life of our church."
      centered
    />
    <div v-if="canCreateMinistry" class="mb-6 flex justify-center">
      <button
        class="flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-primary transition-colors hover:text-primary/70"
        @click="openCreateMinistry"
      >
        <UIcon name="lucide:plus" size="16" />
        Add ministry
      </button>
    </div>
    <div v-if="!hideNavigationButton" class="mb-6 flex justify-center">
      <button
        class="flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-primary transition-colors hover:text-primary/70"
        @click="navigateTo('ministries')"
      >
        View all ministries
        <UIcon name="lucide:chevron-right" size="16" />
      </button>
    </div>

    <div v-if="loading" class="py-8 text-center">Loading ministries...</div>

    <div v-else-if="error" class="py-8 text-center text-red-500">
      {{ error }}
    </div>

    <div
      v-else-if="ministries.length > 0"
      class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <MinistryCard
        v-for="ministry in ministries"
        :key="ministry.id"
        :ministry="ministry"
        :can-delete="canCreateMinistry"
        :can-edit="canCreateMinistry"
        @delete="openDeleteMinistry"
        @edit="openEditMinistry"
      />
    </div>

    <div v-else class="py-8 text-center">No ministries found</div>

    <MinistryDialog
      v-if="canCreateMinistry"
      v-model:open="isMinistryDialogOpen"
      :ministry="selectedMinistry"
      @saved="saveMinistry"
    />

    <UModal
      v-model:open="deleteDialogOpen"
      :ui="{
        overlay: 'bg-foreground/30 backdrop-blur-sm',
        content: 'max-w-sm rounded-3xl border border-primary/10 bg-background shadow-2xl',
      }"
    >
      <template #content>
        <div class="p-6">
          <div class="mb-6 flex items-start justify-between gap-4">
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Church community
              </p>
              <h2 class="font-['Playfair_Display'] text-2xl text-foreground">
                Delete ministry?
              </h2>
              <p class="mt-2 text-sm text-muted-foreground">
                This will permanently remove {{ ministryToDelete?.title }}.
              </p>
            </div>
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              aria-label="Close delete ministry dialog"
              class="rounded-full"
              @click="deleteDialogOpen = false"
            />
          </div>
          <p v-if="deleteError" class="mb-4 text-sm text-red-600">{{ deleteError }}</p>
          <div class="flex justify-end gap-3">
            <UButton
              label="Cancel"
              color="neutral"
              variant="soft"
              class="rounded-xl"
              :disabled="isDeleting"
              @click="deleteDialogOpen = false"
            />
            <UButton
              label="Delete ministry"
              icon="i-lucide-trash-2"
              color="error"
              class="rounded-xl"
              :loading="isDeleting"
              @click="deleteMinistry"
            />
          </div>
        </div>
      </template>
    </UModal>
  </CSection>
</template>
