<script setup lang="ts">
import { computed, ref } from "vue";
import { useChurchInfoStore } from "~/stores/church-info.store";
import { useUserStore } from "~/stores/user.store";
import { CSection, CSectionHeading, CStat } from "../common";
import CButton from "../common/CButton.vue";
import SafeHtml from "../common/SafeHtml.vue";
import AboutUsEditDialog from "./AboutUsEditDialog.vue";
import { UserRole } from "~/services/users.service.ts";

defineProps<{
  allowCreate?: boolean;
}>();

const churchInfoStore = useChurchInfoStore();
const userStore = useUserStore();

const stats = [
  {
    value: "60+",
    label: "Years serving modbury",
  },
  {
    value: "70M+",
    label: "Anglicans worldwide",
  },
  {
    value: "1972",
    label: "Current church dedicated",
  },
  {
    value: "1965",
    label: "Our story began",
  },
];

const churchInfo = computed(() => churchInfoStore.churchInfo ?? null);
const isEditOpen = ref(false);

const sectionTitle = computed(
  () => churchInfo.value?.aboutUsTitle || "---",
);
const sectionSubtitle = computed(
  () => churchInfo.value?.aboutUsSubTitle || "---",
);
const aboutUsImage = computed(
  () =>
    churchInfo.value?.aboutUsImage ||
    "",
);
const aboutUsHtml = computed(() => churchInfo.value?.aboutUs || "");

const handleSaved = (updatedChurchInfo: typeof churchInfo.value) => {
  if (updatedChurchInfo) {
    churchInfoStore.churchInfo = updatedChurchInfo;
  }
};
</script>

<template>
  <CSection id="about" container-class="max-w-[90rem]">
    <div class="grid gap-14 lg:grid-cols-2 lg:gap-20">
      <div class="relative mx-auto w-full max-w-xl lg:max-w-none">
        <div
          class="pointer-events-none absolute -bottom-10 -left-10 -z-10 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          class="group relative overflow-hidden rounded-4xl shadow-2xl shadow-primary/15"
        >
          <img
            :src="aboutUsImage"
            alt="Church building"
            class="h-104 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 lg:h-136"
          >
          <div
            class="absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent"
          />
          <div
            class="absolute inset-x-5 bottom-5 rounded-2xl border border-white/30 bg-white/15 px-6 py-4 text-white shadow-lg backdrop-blur-xl sm:right-auto"
          >
            <div
              class="font-['Playfair_Display'] text-4xl leading-none sm:text-5xl"
            >
              70M+
            </div>
            <div class="mt-1.5 text-[13px] text-white/90">
              Anglicans worldwide
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="mb-8 flex items-start justify-between gap-4">
          <CSectionHeading
            label="About Us"
            :title="sectionTitle"
            :highlighted="sectionSubtitle"
            header-class="lg:text-6xl"
            highlighted-class="lg:text-5xl"
            tow-row-title
          />

          <UButton
            v-if="(userStore.user?.role === UserRole.ROOT || userStore.user?.role === UserRole.ADMIN) && allowCreate"
            type="button"
            icon="i-lucide-pencil"
            label="Edit"
            color="primary"
            variant="soft"
            class="shrink-0 rounded-full"
            @click="isEditOpen = true"
          />
        </div>

        <SafeHtml
          v-if="aboutUsHtml"
          :html="aboutUsHtml"
          class="about-us-rich-content prose prose-sm mb-10 max-w-none text-base leading-[1.85] text-foreground/75 md:text-[17px] prose-p:mb-4 prose-p:mt-0 prose-ul:my-3 prose-li:my-1"
        />

        <p v-else class="mb-10 text-base leading-relaxed text-foreground/70">
          ---
        </p>

        <div class="mb-10 grid grid-cols-2 gap-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-2xl bg-white/50 p-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_18px_40px_-15px_rgba(0,0,0,0.2)]"
          >
            <CStat v-bind="stat" />
          </div>
        </div>

        <div v-if="!allowCreate" class="flex">
          <CButton
            title="Learn more"
            append-icon="ep:right"
            @on-click="navigateTo('/about')"
          />
        </div>
      </div>
    </div>

    <AboutUsEditDialog
      v-if="userStore.user"
      v-model:open="isEditOpen"
      :church-info="churchInfo"
      @saved="handleSaved"
    />
  </CSection>
</template>
