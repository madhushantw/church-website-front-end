<script setup lang="ts">
import { CSection, CSectionHeading } from "../../common";
import CreateSermonSlideover from "~/components/sermons/CreateSermonSlideover.vue";
import SermonCard from "./components/SermonCard.vue";
import { SermonsService, type SermonItem } from "~/services/sermons.service";
import { UserRole } from "~/services/users.service";
import { useUserStore } from "~/stores/user.store";
import ConfirmationDialog from "~/components/common/ConfirmationDialog.vue";

const props = defineProps<{
  hideNavigationButton?: boolean
  allowCreate?: boolean
}>();

const sermonSlideoverOpen = ref(false);
const selectedSermon = ref<SermonItem | null>(null);
const deleteDialogOpen = ref(false);
const sermonToDelete = ref<SermonItem | null>(null);
const isDeleting = ref(false);
const deleteError = ref('');
const userStore = useUserStore();
const canManageSermons = computed(() => userStore.user?.role === UserRole.ROOT && props.allowCreate);

const { items: sermons, loading, error, refresh } = useApiList<SermonItem>(
  "sermons",
  SermonsService.getAll,
  "Failed to load sermons",
);

const openCreateSermon = () => {
  selectedSermon.value = null;
  sermonSlideoverOpen.value = true;
};

const openEditSermon = (sermon: SermonItem) => {
  selectedSermon.value = sermon;
  sermonSlideoverOpen.value = true;
};

const openDeleteSermon = (sermon: SermonItem) => {
  sermonToDelete.value = sermon;
  deleteError.value = '';
  deleteDialogOpen.value = true;
};

const deleteSermon = async () => {
  if (!sermonToDelete.value) return;

  isDeleting.value = true;
  deleteError.value = '';

  try {
    await SermonsService.delete(sermonToDelete.value.id);
    deleteDialogOpen.value = false;
    sermonToDelete.value = null;
    await refresh();
  } catch {
    deleteError.value = 'Unable to delete this sermon. Please try again.';
  } finally {
    isDeleting.value = false;
  }
};

const handleSermonSaved = async () => {
  await refresh();
  selectedSermon.value = null;
};
</script>

<template>
  <CSection id="sermons" background-color="muted">
    <div class="flex items-center justify-between gap-4">
      <CSectionHeading label="Messages" title="Weekly pew sheets," highlighted="Readings and sermons" tow-row-title />
      <div class="mb-6 flex items-center gap-3">
        <button
          v-if="props.allowCreate && canManageSermons"
          class="flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-primary transition-colors hover:text-primary/70"
          @click="openCreateSermon"
        >
          <UIcon name="lucide:calendar-plus" size="16" />
          Add sermon
        </button>
        <button
          v-if="!hideNavigationButton"
          class="flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-primary transition-colors hover:text-primary/70"
          @click="navigateTo('sermons')"
        >
          View all messages
          <UIcon name="lucide:chevron-right" size="16" />
        </button>
      </div>
    </div>
    <div v-if="loading" class="text-center py-8">Loading sermons...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>
    <div
      v-else-if="sermons.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <SermonCard
        v-for="sermon in sermons"
        :key="sermon.id"
        :sermon="sermon"
        :can-edit="canManageSermons"
        @edit="openEditSermon"
        @delete="openDeleteSermon"
      />
    </div>
    <div v-else class="text-center py-8">No sermons found</div>
    <CreateSermonSlideover
      v-if="canManageSermons"
      v-model:open="sermonSlideoverOpen"
      :sermon="selectedSermon"
      @saved="handleSermonSaved"
    />
    <ConfirmationDialog
      v-model="deleteDialogOpen"
      type="delete"
      title="Delete sermon?"
      :subtitle="`This will permanently remove ${sermonToDelete?.title}.`"
      @confirm="deleteSermon"
    />
  </CSection>
</template>
