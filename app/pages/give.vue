<script setup lang="ts">
import {
  CButton,
  CPageHero,
  CSection,
  CSectionHeading,
} from "~/components/common";

interface GivingOption {
  title: string;
  description: string;
  icon: string;
}

const givingOptions: GivingOption[] = [
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

const gotContact = () => {
  document.getElementById("contact")?.scrollIntoView({
    behavior: "smooth",
  });
};
</script>

<template>
  <div>
    <CPageHero
      image="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1800&h=900&fit=crop&auto=format"
      alt="give"
      label=""
      title=""
      highlighted="Give"
      description="Everything we have belongs to God, and giving is one of the ways we
            worship Him, trust Him, and participate in His mission. Your
            generosity helps support the ministry of Hope Valley Church and
            enables us to bring hope locally, nationally, and globally."
      :buttons="[]"
    />
    <CSection>
      <div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <CSectionHeading label="" highlighted="Why Do We Give?" title="" />
          <p
            class="mb-6 max-w-xl text-[16px] leading-relaxed text-foreground/70"
          >
            We believe that everything we have comes from God and ultimately
            belongs to Him. As followers of Jesus, we respond to His generosity
            by stewarding our resources faithfully and returning a portion of
            what He has entrusted to us.
          </p>
          <p
            class="mb-6 max-w-xl text-[16px] leading-relaxed text-foreground/70"
          >
            Giving is more than a financial transaction—it's an act of worship.
            When we give, we declare that God is our provider and that His
            kingdom is our priority.
          </p>
          <p
            class="mb-6 max-w-xl text-[16px] leading-relaxed text-foreground/70"
          >
            Through our generosity, we participate in God's work, support the
            ministry of the local church, and help bring hope to people in our
            communities and beyond.
          </p>
          <div class="flex flex-col gap-4 sm:flex-row">
            <CButton
              title="Give Online"
              color="accent"
              prepend-icon="lucide:heart"
              @on-click="gotContact"
            />
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
  </div>
</template>
