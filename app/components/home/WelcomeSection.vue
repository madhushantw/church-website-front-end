<script setup lang="ts">
import { computed, ref } from "vue";
import { CSection, CSectionHeading } from "../common";
import { UserRole } from "~/services/users.service";
import { useChurchInfoStore } from "~/stores/church-info.store";
import { useUserStore } from "~/stores/user.store";
import PastorWelcomeEditDialog from "./PastorWelcomeEditDialog.vue";

const props = defineProps<{
  allowCreate?: boolean;
}>();

const churchInfoStore = useChurchInfoStore();
const userStore = useUserStore();
const isEditOpen = ref(false);
const canEdit = computed(
  () => props.allowCreate && userStore.user?.role === UserRole.ROOT,
);

const churchInfo = computed(() => churchInfoStore.churchInfo);
const pastorName = computed(() => churchInfo.value?.pastorName || "---");
const pastorTitle1 = computed(() => churchInfo.value?.pastorTitle1 || "---");
const pastorTitle2 = computed(() => churchInfo.value?.pastorTitle2 || "---");
const pastorMessage1 = computed(
  () => churchInfo.value?.pastorMessage1 || "---",
);
const pastorMessage2 = computed(
  () => churchInfo.value?.pastorMessage2 || "---",
);
const pastorAvatar = computed(() => churchInfo.value?.pastorAvatar || "");

const videoEmbedUrl = computed(() => {
  const videoUrl = churchInfo.value?.video1;
  if (!videoUrl) return "";

  try {
    const url = new URL(videoUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";

    if (url.hostname === "youtu.be") {
      return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
    }

    if (
      url.hostname.endsWith("youtube.com") ||
      url.hostname.endsWith("youtube-nocookie.com")
    ) {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
      }
      if (url.pathname.startsWith("/embed/")) {
        return `https://www.youtube-nocookie.com${url.pathname}`;
      }
    }

    if (url.hostname.endsWith("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : "";
    }

    return url.href;
  } catch {
    return "";
  }
});
</script>

<template>
  <CSection id="about">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div class="relative group">
        <div
          class="relative rounded-xl overflow-hidden shadow-2xl bg-foreground aspect-video"
        >
          <iframe
            v-if="videoEmbedUrl"
            :src="videoEmbedUrl"
            title="Example welcome video from St Luke's Anglican Church"
            class="absolute inset-0 h-full w-full"
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture;
              web-share;
            "
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          />
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center text-2xl text-white/70"
          >
            ---
          </div>
        </div>
        <div
          class="absolute -bottom-4 -right-4 w-20 h-20 border-2 border-accent/40 rounded-xl -z-10"
        />
      </div>
      <div class="lg:pl-4">
        <div class="mb-4 flex justify-end">
          <UButton
            v-if="canEdit"
            type="button"
            icon="i-lucide-pencil"
            label="Edit"
            color="primary"
            variant="soft"
            class="rounded-xl"
            @click="isEditOpen = true"
          />
        </div>
        <CSectionHeading
          label="A Message From Our Pastor"
          title="Welcome to"
          highlighted="St Luke's"
          header-class="lg:text-6xl"
        />
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-16 h-16 rounded-full overflow-hidden bg-secondary border-2 border-primary/20 shrink-0"
          >
            <img
              v-if="pastorAvatar"
              :src="pastorAvatar"
              :alt="pastorName"
              class="w-full h-full object-cover"
            >
            <span
              v-else
              class="flex h-full w-full items-center justify-center text-sm text-foreground/60"
            >
              ---
            </span>
          </div>
          <div>
            <div class="text-foreground font-semibold text-[15px]">
              {{ pastorName }}
            </div>
            <div class="text-muted-foreground text-[13px]">
              {{ pastorTitle1 }}
            </div>
            <div class="text-primary text-[12px] font-medium mt-0.5">
              {{ pastorTitle2 }}
            </div>
          </div>
        </div>
        <blockquote class="border-l-4 border-primary/30 pl-5 mb-6">
          <p
            class="text-foreground/75 text-[18px] leading-relaxed italic font-['Playfair_Display']"
          >
            {{ pastorMessage1 }}
          </p>
        </blockquote>
        <p class="text-foreground/65 text-[15px] leading-relaxed mb-8">
          {{ pastorMessage2 }}
        </p>
      </div>
    </div>
    <PastorWelcomeEditDialog
      v-if="userStore.user"
      v-model:open="isEditOpen"
    />
  </CSection>
</template>
