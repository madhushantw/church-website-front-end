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

const addMinistry = (ministry: MinistryItem) => {
  ministryItems.value = [ministry, ...ministryItems.value];
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
        @click="isMinistryDialogOpen = true"
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
      />
    </div>

    <div v-else class="py-8 text-center">No ministries found</div>

    <MinistryDialog
      v-if="canCreateMinistry"
      v-model:open="isMinistryDialogOpen"
      @created="addMinistry"
    />
  </CSection>
</template>
