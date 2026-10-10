<script setup lang="ts">
import { CButton, CSection, CSectionHeading } from "../common";

interface GivingOption {
  title: string;
  description: string;
  icon: string;
}

const givingFore: GivingOption[] = [
  {
    title: "Support Our Ministries",
    description:
      "Your giving enable us to run various programs and ministries that uplift and support individuals and families in our community.",
    icon: "💛",
  },
  {
    title: "Equip Our Place Of Worship",
    description:
      "Your giving help maintain our church building as a welcoming and safe space for worship, prayer, and community events.",
    icon: "🌍",
  },
  {
    title: "Empower Mission",
    description:
      "We are a church without walls, participating in God's mission both locally and globally. Your generosity helps support outreach initiatives, mission partners, and practical expressions of hope that make a difference in the lives of others.",
    icon: "🏛️",
  },
];
</script>

<template>
  <CSection id="give" background-color="muted">
    <div class="grid grid-cols-1 items-start gap-14 lg:grid-cols-5 lg:gap-16">
      <div class="lg:col-span-2 lg:sticky lg:top-28">
        <CSectionHeading label="" highlighted="Why Do We Give?" title="" />

        <div class="space-y-5">
          <p class="text-base leading-[1.85] text-foreground/75">
            We believe that everything we have comes from God and ultimately
            belongs to Him. As followers of Jesus, we respond to His generosity
            by stewarding our resources faithfully and returning a portion of
            what He has entrusted to us.
          </p>

          <p
            class="border-l-2 border-accent pl-5 font-['Playfair_Display'] text-xl italic leading-relaxed text-foreground"
          >
            Giving is more than a financial transaction—it's an act of worship.
          </p>

          <p class="text-base leading-[1.85] text-foreground/75">
            When we give, we declare that God is our provider and that His
            kingdom is our priority. Through our generosity, we participate in
            God's work, support the ministry of the local church, and help bring
            hope to people in our communities and beyond.
          </p>
          <div class="flex flex-col gap-4 sm:flex-row">
            <CButton
              title="Learn More"
              color="primary"
              outlined
              prepend-icon="lucide:heart"
              @on-click="navigateTo('/give')"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5 lg:col-span-3">
        <div
          v-for="(option, index) in givingFore"
          :key="option.title"
          class="group relative flex items-start gap-5 overflow-hidden rounded-3xl bg-white p-6 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.22)] sm:p-7"
        >
          <span
            class="pointer-events-none absolute -right-2 -top-4 font-['Playfair_Display'] text-8xl font-bold leading-none text-primary/5 transition-colors duration-500 group-hover:text-primary/10"
          >
            {{ String(index + 1).padStart(2, "0") }}
          </span>

          <div
            class="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-primary/5 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
          >
            {{ option.icon }}
          </div>

          <div class="relative">
            <h4
              class="mb-2 font-['Playfair_Display'] text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary"
            >
              {{ option.title }}
            </h4>

            <p class="text-sm leading-relaxed text-muted-foreground">
              {{ option.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </CSection>
</template>
