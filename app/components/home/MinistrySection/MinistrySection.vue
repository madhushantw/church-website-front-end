<script setup lang="ts">
import { onMounted, ref } from "vue";
import { CSection, CSectionHeading } from "../../common";
import {
  MinistriesService,
  type MinistryItem,
} from "~/services/ministries.service";
import MinistryCard from "./MinistryCard.vue";

interface Ministry {
  title: string;
  subtitle: string;
  icon?: string;
  iconColor?: string;
}

defineProps<{ hideNavigationButton?: boolean }>();

const ministries = ref<Ministry[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

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

onMounted(async () => {
  try {
    const response = await MinistriesService.getAll();
    ministries.value = response.data.map((ministry) => ({
      title: ministry.name,
      subtitle:
        ministry.description ||
        "Join us as we grow together in faith and service.",
      icon: ministryIcons[ministry.type],
      iconColor: ministryColors[ministry.type],
    }));
  } catch (err) {
    console.error("Failed to fetch ministries:", err);
    error.value = "Failed to load ministries";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <CSection id="ministries" background-color="muted">
    <CSectionHeading
      label="Ministries"
      title="Growing Together in Faith"
      sub-title="Find where your gifts, passions, and calling intersect with the life of our church."
      centered
    />
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
        :key="ministry.title"
        :ministry="ministry"
      />
    </div>

    <div v-else class="py-8 text-center">No ministries found</div>
  </CSection>
</template>
