<script setup lang="ts">
import { CPageHero, CSection, CSectionHeading } from "~/components/common";
import MissionPartnerDialog from "~/components/give/MissionPartnerDialog.vue";
import {
  MissionPartnersService,
  type MissionPartner,
} from "~/services/mission-partners.service";
import { UserRole } from "~/services/users.service";
import { useUserStore } from "~/stores/user.store";

interface GivingFor {
  title: string;
  description: string;
  icon: string;
}

const givingFore: GivingFor[] = [
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

const givingOptions = [
  {
    title: "Online Giving",
    description: "Give securely through our website.",
    icon: "i-lucide-globe",
  },
  {
    title: "In-Person Giving",
    description:
      "Offering boxes and envelopes are available at our Sunday gatherings.",
    icon: "i-lucide-hand-heart",
  },
  {
    title: "Online Transfer",
    description: "Give directly via bank transfer",
    icon: "i-lucide-landmark",
    account: {
      name: "St Luke's anglican Church",
      bank: "Bank of Hope",
      accountNumber: "123456789",
      routingNumber: "987654321",
    },
  },
];

const userStore = useUserStore();
const missionPartners = ref<MissionPartner[]>([]);
const isLoadingPartners = ref(true);
const partnersError = ref("");
const isMissionPartnerDialogOpen = ref(false);
const selectedMissionPartner = ref<MissionPartner | null>(null);
const canManageMissionPartners = computed(
  () => userStore.user?.role === UserRole.ROOT,
);

const loadMissionPartners = async () => {
  isLoadingPartners.value = true;
  partnersError.value = "";

  try {
    const response = await MissionPartnersService.getAll({
      page: 1,
      limit: 100,
    });
    missionPartners.value = response.data.items;
  } catch {
    partnersError.value = "Unable to load mission partners. Please try again.";
  } finally {
    isLoadingPartners.value = false;
  }
};

const addMissionPartner = (missionPartner: MissionPartner) => {
  const index = missionPartners.value.findIndex(
    (partner) => partner.id === missionPartner.id,
  );

  if (index === -1)
    missionPartners.value = [missionPartner, ...missionPartners.value];
  else missionPartners.value[index] = missionPartner;

  selectedMissionPartner.value = null;
};

const openCreateMissionPartner = () => {
  selectedMissionPartner.value = null;
  isMissionPartnerDialogOpen.value = true;
};

const openEditMissionPartner = (missionPartner: MissionPartner) => {
  selectedMissionPartner.value = missionPartner;
  isMissionPartnerDialogOpen.value = true;
};

onMounted(loadMissionPartners);
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
        </div>
        <div class="grid grid-cols-1 gap-5">
          <div
            v-for="option in givingFore"
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
    <CSection background-color="muted">
      <CSectionHeading
        label=""
        title="Giving Options"
        sub-title="There are a number of ways you can give at Hope Valley Church."
      />
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          v-for="(item, index) in givingOptions"
          :key="index"
          class="rounded-2xl bg-white p-6 shadow-sm"
        >
          <div
            class="mb-5 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <UIcon :name="item.icon" class="size-6" />
          </div>
          <h3 class="mb-3 text-xl font-semibold text-primary">
            {{ item.title }}
          </h3>
          <p class="text-sm leading-6 text-gray-600">
            {{ item.description }}
          </p>
          <div
            v-if="item.account"
            class="mt-5 space-y-2 border-t border-gray-100 pt-5 text-sm"
          >
            <div class="flex justify-between gap-4">
              <span class="text-gray-500">Account Name</span>
              <span class="font-medium text-gray-800">
                {{ item.account.name }}
              </span>
            </div>
            <div class="flex justify-between gap-4">
              <span class="text-gray-500">Bank</span>
              <span class="font-medium text-gray-800">
                {{ item.account.bank }}
              </span>
            </div>
            <div class="flex justify-between gap-4">
              <span class="text-gray-500">Account Number</span>
              <span class="font-medium text-gray-800">
                {{ item.account.accountNumber }}
              </span>
            </div>
            <div class="flex justify-between gap-4">
              <span class="text-gray-500">Routing Number</span>
              <span class="font-medium text-gray-800">
                {{ item.account.routingNumber }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </CSection>
    <CSection>
      <CSectionHeading
        label=""
        title="Our Mission Partners"
        sub-title="Explore some of the ministries and organizations we support through our monthly Mission Offering."
      />
      <div v-if="canManageMissionPartners" class="mb-6 flex justify-center">
        <UButton
          label="Add mission partner"
          icon="i-lucide-plus"
          color="primary"
          class="rounded-xl"
          @click="openCreateMissionPartner"
        />
      </div>
      <p v-if="isLoadingPartners" class="py-8 text-center text-gray-600">
        Loading mission partners...
      </p>
      <p v-else-if="partnersError" class="py-8 text-center text-red-600">
        {{ partnersError }}
      </p>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(item, index) in missionPartners"
          :key="index"
          class="relative flex h-120 flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          <UButton
            v-if="canManageMissionPartners"
            icon="i-lucide-pencil"
            color="neutral"
            variant="soft"
            size="sm"
            aria-label="Edit mission partner"
            class="absolute right-4 top-4 rounded-lg"
            @click="openEditMissionPartner(item)"
          />
          <span class="inline-flex text-xs font-medium text-primary">
            {{ item.type }}
          </span>
          <h3
            class="font-['Playfair_Display'] text-3xl font-normal text-foreground"
          >
            {{ item.title }}
          </h3>
          <p class="text-sm leading-6 text-gray-600">
            {{ item.description }}
          </p>
          <a
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-muted px-4 py-3 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-transparent"
          >
            Learn More
            <UIcon name="i-lucide-arrow-up-right" class="size-4" />
          </a>
        </div>
      </div>
      <p
        v-if="
          !isLoadingPartners && !partnersError && missionPartners.length === 0
        "
        class="py-8 text-center text-gray-600"
      >
        No mission partners have been added yet.
      </p>
      <MissionPartnerDialog
        v-if="canManageMissionPartners"
        v-model:open="isMissionPartnerDialogOpen"
        :mission-partner="selectedMissionPartner"
        @saved="addMissionPartner"
      />
    </CSection>
  </div>
</template>
