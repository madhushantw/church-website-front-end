<script setup lang="ts">
import { useUserStore } from "~/stores/user.store";
import { UserRole } from "~/services/users.service";
import { CSection, CSectionHeading, ConfirmationDialog } from  "~/components/common";
import {
  MinistriesService,
  type MinistryItem,
} from "~/services/ministries.service";
import MinistryCard from "./MinistryCard.vue";
import MinistryDialog from "./MinistryDialog.vue";

const props = defineProps<{
  hideNavigationButton?: boolean
  allowCreate?: boolean
}>();

const userStore = useUserStore();
const deleteDialogOpen = ref(false);
const ministryToDelete = ref<MinistryItem | null>(null);
const isDeleting = ref(false);
const deleteError = ref("");
const selectedMinistry = ref<MinistryItem | null>(null);

const { items: ministryItems, loading, error, page, total, limit } = useApiPagination<MinistryItem>(
  "ministries",
  MinistriesService.getAll,
  "Failed to load ministries",
);
const isMinistryDialogOpen = ref(false);

const canCreateMinistry = computed(
  () => props.allowCreate && userStore.user?.role === UserRole.ROOT,
);

const openCreateMinistry = () => {
  selectedMinistry.value = null;
  isMinistryDialogOpen.value = true;
};

const openEditMinistry = (ministry: MinistryItem) => {
  selectedMinistry.value =
    ministryItems.value.find((item) => item.id === ministry.id) || null;
  isMinistryDialogOpen.value = true;
};

const saveMinistry = (ministry: MinistryItem) => {
  const index = ministryItems.value.findIndex((item) => item.id === ministry.id);
  if (index !== -1) ministryItems.value[index] = ministry;
  else ministryItems.value = [ministry, ...ministryItems.value];
  selectedMinistry.value = null;
};

const openDeleteMinistry = (ministry: MinistryItem) => {
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
      v-else-if="ministryItems.length > 0"
      class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <MinistryCard
        v-for="ministry in ministryItems"
        :key="ministry.id"
        :ministry="ministry"
        :can-delete="canCreateMinistry"
        :can-edit="canCreateMinistry"
        @delete="openDeleteMinistry"
        @edit="openEditMinistry"
      />
    </div>
    <div v-else class="py-8 text-center">No ministries found</div>
    <UPagination v-if="total && hideNavigationButton" v-model:page="page" :items-per-page="limit" :total="total" class="my-4 mx-auto" />
    <MinistryDialog
      v-if="canCreateMinistry"
      v-model:open="isMinistryDialogOpen"
      :ministry="selectedMinistry"
      @saved="saveMinistry"
    />
    <ConfirmationDialog
      v-model="deleteDialogOpen"
      type="delete"
      title="Delete ministry?"
      :subtitle="`This will permanently remove ${ministryToDelete?.name}.`"
      @confirm="deleteMinistry"
    />
  </CSection>
</template>
