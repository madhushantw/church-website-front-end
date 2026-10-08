<script setup lang="ts">
import { computed, ref } from "vue";

import { useChurchInfoStore } from "~/stores/church-info.store";
import { useUserStore } from "~/stores/user.store";
import { CSection, CSectionHeading, CStat } from "../common";
import CButton from "../common/CButton.vue";
import SafeHtml from "../common/SafeHtml.vue";
import AboutUsEditDialog from "./AboutUsEditDialog.vue";
import { UserRole } from "~/services/users.service.ts";

const churchInfoStore = useChurchInfoStore();
const userStore = useUserStore();

const stats = [
  {
    value: "70M+",
    label: "Communion Members Worldwide",
  },
  {
    value: "1983",
    label: "Founded",
  },
  {
    value: "70+",
    label: "Years in Communion",
  },
  {
    value: "12",
    label: "Ministries",
  },
];

const churchInfo = computed(() => churchInfoStore.churchInfo ?? null);
const isEditOpen = ref(false);

const sectionTitle = computed(
  () => churchInfo.value?.aboutUsTitle || "External Mission",
);
const sectionSubtitle = computed(
  () => churchInfo.value?.aboutUsSubTitle || "Support Activities",
);
const aboutUsImage = computed(
  () => churchInfo.value?.aboutUsImage || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1800&h=900&fit=crop&auto=format",
);
const aboutUsHtml = computed(() => churchInfo.value?.aboutUs || "");

const handleSaved = (updatedChurchInfo: typeof churchInfo.value) => {
  if (updatedChurchInfo) {
    churchInfoStore.churchInfo = updatedChurchInfo;
  }
};
</script>

<template>
  <CSection id="about">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="grid gap-16 lg:grid-cols-2">
        <div class="relative">
          <div class="relative">
            <img
              :src="aboutUsImage"
              alt="Church building"
              class="h-115 w-full rounded-lg object-cover shadow-xl"
            >
            <div
              class="absolute -bottom-6 -right-6 hidden rounded-lg bg-accent px-7 py-5 text-white shadow-xl md:block"
            >
              <div class="font-['Playfair_Display'] text-5xl leading-none">
                70M+
              </div>
              <div class="mt-1 text-[13px] text-white/80">In Communion Worldwide</div>
            </div>
          </div>
        </div>

        <div class="lg:pl-4">
          <div class="mb-6 flex items-start justify-between gap-4">
            <CSectionHeading
              :label="churchInfo?.aboutUsTitle ? 'About Us' : 'About Us'"
              :title="sectionTitle"
              :highlighted="sectionSubtitle"
              header-class="lg:text-6xl"
            />

            <UButton
              v-if="userStore.user?.role === UserRole.ROOT"
              type="button"
              icon="i-lucide-pencil"
              label="Edit"
              color="primary"
              variant="soft"
              class="rounded-xl"
              @click="isEditOpen = true"
            />
          </div>

          <SafeHtml
            v-if="aboutUsHtml"
            :html="aboutUsHtml"
            class="about-us-rich-content prose prose-sm max-w-none mb-8 text-[16px] leading-relaxed text-foreground/70 prose-p:mb-3 prose-p:mt-0 prose-ul:my-3 prose-li:my-1"
          />

          <p v-else class="mb-8 text-[16px] leading-relaxed text-foreground/70">
            We try to welcome everyone.
          </p>

          <div class="mb-8 grid grid-cols-2 gap-6">
            <CStat v-for="stat in stats" :key="stat.label" v-bind="stat" />
          </div>

          <div class="flex">
            <CButton
              title="Learn more"
              append-icon="ep:right"
              @on-click="navigateTo('/about')"
            />
          </div>
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