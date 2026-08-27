<script setup lang="ts">
import { CButton, CSection, CSectionHeading } from "../common";

interface GivingOption {
  title: string;
  description: string;
  icon: string;
}

const givingOptions: GivingOption[] = [
  {
    title: "Tithes & General Fund",
    description: "Support our weekly ministry, facilities, and staff.",
    icon: "💛",
  },
  {
    title: "Missions Fund",
    description: "Equip missionaries serving locally and around the world.",
    icon: "🌍",
  },
  {
    title: "Building Fund",
    description:
      "Help us maintain and improve our facilities for generations to come.",
    icon: "🏛️",
  },
];
</script>

<template>
  <CSection id="gospel" background-color="muted">
    <div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
      <div>
        <CSectionHeading
          label="Generosity"
          title="Partner With Us"
          highlighted="in Giving"
        />

        <p class="mb-6 max-w-xl text-[16px] leading-relaxed text-foreground/70">
          Your generosity makes everything we do possible — from Sunday worship
          to community outreach, youth programs, and global missions. Every gift
          is an act of faith.
        </p>

        <div class="flex flex-col gap-4 sm:flex-row">
          <CButton
            title="Give Online"
            color="accent"
            prepend-icon="lucide:heart"
          />

          <CButton title="Learn About Stewardship" outlined color="primary" />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5">
        <div
          v-for="option in givingOptions"
          :key="option.title"
          class="group flex items-start gap-5 rounded-lg border border-accent/10 bg-card p-6 transition-colors hover:border-accent/30 bg-white"
        >
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center text-2xl"
          >
            {{ option.icon }}
          </div>

          <div>
            <h4
              class="mb-1 font-['Playfair_Display'] text-[20px] font-medium text-foreground"
            >
              {{ option.title }}
            </h4>

            <p class="text-[14px] leading-relaxed text-muted-foreground">
              {{ option.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </CSection>
</template>
