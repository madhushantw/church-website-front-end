<script setup lang="ts">
import { CPageHero, CSection, CSectionHeading } from "~/components/common";
import BankTransferEditDialog from "~/components/give/BankTransferEditDialog.vue";
import MissionPartnerDialog from "~/components/give/MissionPartnerDialog.vue";
import {
  MissionPartnersService,
  type MissionPartner,
} from "~/services/mission-partners.service";
import { UserRole } from "~/services/users.service";
import { useChurchHeroImage } from "~/composables/useChurchHeroImage";
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
  },
];

const userStore = useUserStore();
const {
  churchInfoStore,
  canEdit: canEditHeroImage,
  isSaving: isSavingHeroImage,
  error: heroImageError,
  saveImage: saveHeroImage,
} = useChurchHeroImage("giveHeroImage");
const giveHeroImage = computed(
  () => churchInfoStore.churchInfo?.giveHeroImage || "",
);
const missionPartners = ref<MissionPartner[]>([]);
const isLoadingPartners = ref(true);
const partnersError = ref("");
const isMissionPartnerDialogOpen = ref(false);
const selectedMissionPartner = ref<MissionPartner | null>(null);
const canManageMissionPartners = computed(
  () => userStore.user?.role === UserRole.ROOT,
);
const isBankTransferDialogOpen = ref(false);
const bankTransferAccount = computed(() => ({
  name: churchInfoStore.churchInfo?.bankAccountName || "---",
  accountNumber: churchInfoStore.churchInfo?.accountNumber || "---",
  routingNumber: churchInfoStore.churchInfo?.routingNumber || "---",
}));

const bankRows = computed(() => [
  { key: "name", label: "Account Name", value: bankTransferAccount.value.name },
  {
    key: "accountNumber",
    label: "Account Number",
    value: bankTransferAccount.value.accountNumber,
  },
  {
    key: "routingNumber",
    label: "BSB Number",
    value: bankTransferAccount.value.routingNumber,
  },
]);

const copiedKey = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

const copyBankDetails = async () => {
  const details = [
    `Account Name: ${bankTransferAccount.value.name}`,
    `Account Number: ${bankTransferAccount.value.accountNumber}`,
    `BSB Number: ${bankTransferAccount.value.routingNumber}`,
  ]
    .filter((detail) => !detail.endsWith(': ---'))
    .join('\n')

  if (!details) return

  try {
    await navigator.clipboard.writeText(details)
    copiedKey.value = true

    if (copiedTimer) clearTimeout(copiedTimer)

    copiedTimer = setTimeout(() => {
      copiedKey.value = false
    }, 1800)
  } catch {
    // Handle clipboard errors if needed
  }
}
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

const removeMissionPartner = (id: string) => {
  missionPartners.value = missionPartners.value.filter(
    (partner) => partner.id !== id,
  );
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

onUnmounted(() => clearTimeout(copiedTimer));
</script>

<template>
  <div>
    <CPageHero
      :image="giveHeroImage"
      :can-edit-image="canEditHeroImage"
      :image-loading="churchInfoStore.isLoading || isSavingHeroImage"
      :image-saving="isSavingHeroImage"
      :image-save-error="heroImageError"
      alt="give"
      label=""
      title=""
      highlighted="Give"
      description="Everything we have belongs to God, and giving is one of the ways we
            worship Him, trust Him, and participate in His mission. Your
            generosity helps support the ministry of St Luke's Anglican Church and
            enables us to bring hope locally, nationally, and globally."
      :buttons="[]"
      @save-image="saveHeroImage"
    />

    <CSection>
      <div class="grid grid-cols-1 items-start gap-14 lg:grid-cols-5 lg:gap-16">
        <div class="lg:col-span-2 lg:sticky lg:top-28">
          <CSectionHeading label="" highlighted="Why Do We Give?" title="" />

          <div class="space-y-5">
            <p class="text-base leading-[1.85] text-foreground/75">
              We believe that everything we have comes from God and ultimately
              belongs to Him. As followers of Jesus, we respond to His
              generosity by stewarding our resources faithfully and returning a
              portion of what He has entrusted to us.
            </p>

            <p
              class="border-l-2 border-accent pl-5 font-['Playfair_Display'] text-xl italic leading-relaxed text-foreground"
            >
              Giving is more than a financial transaction—it's an act of
              worship.
            </p>

            <p class="text-base leading-[1.85] text-foreground/75">
              When we give, we declare that God is our provider and that His
              kingdom is our priority. Through our generosity, we participate in
              God's work, support the ministry of the local church, and help
              bring hope to people in our communities and beyond.
            </p>
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

    <CSection background-color="muted">
      <CSectionHeading
        label=""
        title="Giving Options"
        sub-title="There are a number of ways you can give at St Luke's Anglican Church."
      />

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          v-for="(item, index) in givingOptions"
          :key="index"
          class="group relative isolate flex h-full min-h-72 flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
        >
          <div
            class="pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-primary/20"
          />
          <div
            class="pointer-events-none absolute -bottom-20 -left-16 -z-10 h-44 w-44 rounded-full bg-primary/5 blur-3xl transition-all duration-700 group-hover:scale-125"
          />

          <span
            class="absolute left-0 top-0 h-1 w-0 bg-linear-to-r from-primary to-primary/30 transition-all duration-500 group-hover:w-full"
          />

          <UButton
            v-if="item.title === 'Online Transfer' && canManageMissionPartners"
            type="button"
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Edit online transfer details"
            class="absolute right-4 top-4 rounded-full"
            @click="isBankTransferDialogOpen = true"
          />

          <span
            class="mb-5 inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[12px] font-medium text-primary"
          >
            <UIcon :name="item.icon" size="13" />
            Option {{ String(index + 1).padStart(2, "0") }}
          </span>

          <h3
            class="mb-3 font-['Playfair_Display'] text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
          >
            {{ item.title }}
          </h3>

          <p class="mb-6 text-sm leading-relaxed text-muted-foreground">
            {{ item.description }}
          </p>

          <div
            v-if="item.title === 'Online Transfer'"
            class="mt-auto overflow-hidden rounded-2xl border border-primary/10 bg-primary/2 text-sm"
          >
            <div
              v-for="row in bankRows"
              :key="row.key"
              class="flex items-center justify-between gap-3 px-4 py-3"
            >
                <div
                  class="text-[11px] uppercase tracking-wider text-muted-foreground"
                >
                  {{ row.label }}
                </div>

                <div class="truncate font-medium text-foreground">
                  {{ row.value }}
                </div>
            </div>

            <div class="border-t border-primary/10 p-3">
              <UButton
                block
                :icon="copiedKey ? 'i-lucide-check' : 'i-lucide-copy'"
                :color="copiedKey ? 'success' : 'primary'"
                :label="
                  copiedKey ? 'Bank Details Copied!' : 'Copy Bank Details'
                "
                variant="soft"
                class="rounded-xl"
                @click="copyBankDetails"
              />
            </div>
          </div>
        </div>
      </div>
    </CSection>

    <CSection>
      <div class="flex flex-col justify-between gap-4 md:flex-row">
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
            variant="soft"
            class="my-auto rounded-full"
            @click="openCreateMissionPartner"
          />
        </div>
      </div>

      <div
        v-if="isLoadingPartners"
        class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="h-72 animate-pulse rounded-3xl bg-primary/5"
        />
      </div>

      <div
        v-else-if="partnersError"
        class="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl bg-red-50 px-6 py-10 text-center"
      >
        <UIcon name="i-lucide-triangle-alert" class="size-8 text-red-500" />
        <p class="text-sm text-red-600">{{ partnersError }}</p>
        <UButton
          label="Try again"
          color="error"
          variant="soft"
          class="rounded-full"
          @click="loadMissionPartners"
        />
      </div>

      <div
        v-else-if="missionPartners.length === 0"
        class="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl bg-primary/5 px-6 py-12 text-center"
      >
        <div
          class="flex size-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm"
        >
          <UIcon name="i-lucide-heart-handshake" class="size-7" />
        </div>
        <p class="text-sm text-muted-foreground">
          No mission partners have been added yet.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="item in missionPartners"
          :key="item.id"
          class="group relative isolate flex h-full min-h-72 flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
        >
          <div
            class="pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-primary/20"
          />
          <div
            class="pointer-events-none absolute -bottom-20 -left-16 -z-10 h-44 w-44 rounded-full bg-primary/5 blur-3xl transition-all duration-700 group-hover:scale-125"
          />

          <span
            class="absolute left-0 top-0 h-1 w-0 bg-linear-to-r from-primary to-primary/30 transition-all duration-500 group-hover:w-full"
          />

          <UButton
            v-if="canManageMissionPartners"
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Edit mission partner"
            class="absolute right-4 top-4 rounded-full md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
            @click="openEditMissionPartner(item)"
          />

          <span
            class="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[12px] font-medium text-primary"
          >
            <UIcon name="i-lucide-heart-handshake" size="13" />
            {{ item.type }}
          </span>

          <h3
            class="font-['Playfair_Display'] text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
          >
            {{ item.title }}
          </h3>

          <p class="text-sm leading-6 text-muted-foreground">
            {{ item.description }}
          </p>

          <div
            class="mt-auto flex flex-wrap gap-2 border-t border-primary/10 pt-5"
          >
            <a
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              class="group/link inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1.5 text-[12px] font-medium text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20"
            >
              Learn More
              <UIcon
                name="i-lucide-arrow-up-right"
                size="14"
                class="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>

      <MissionPartnerDialog
        v-if="canManageMissionPartners"
        v-model:open="isMissionPartnerDialogOpen"
        :mission-partner="selectedMissionPartner"
        @saved="addMissionPartner"
        @deleted="removeMissionPartner"
      />
      <BankTransferEditDialog
        v-if="canManageMissionPartners"
        v-model:open="isBankTransferDialogOpen"
      />
    </CSection>
  </div>
</template>
