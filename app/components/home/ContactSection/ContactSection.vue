<script setup lang="ts">
import axios from "axios";
import {
  CButton,
  CInput,
  CSection,
  CSectionHeading,
} from "~/components/common";
import { ContactService } from "~/services/contact.service";
import { UserRole } from "~/services/users.service";
import { useChurchInfoStore } from "~/stores/church-info.store";
import { useUserStore } from "~/stores/user.store";
import ContactInfoEditDialog from "./ContactInfoEditDialog.vue";

interface ContactInfo {
  label: string;
  value: string;
  icon: string;
}

interface SocialLink {
  label: string;
  icon: string;
  url: string;
}

const props = withDefaults(defineProps<{ allowCreate?: boolean }>(), {
  allowCreate: false,
});

const churchInfoStore = useChurchInfoStore();
const userStore = useUserStore();
const isEditOpen = ref(false);
const canEdit = computed(
  () => props.allowCreate && userStore.user?.role === UserRole.ROOT,
);

const contactInfo = computed<ContactInfo[]>(() => [
  {
    label: "Address",
    value: churchInfoStore.churchInfo?.address || "---",
    icon: "lucide:map-pin",
  },
  {
    label: "Phone",
    value: churchInfoStore.churchInfo?.phone || "---",
    icon: "lucide:phone",
  },
  {
    label: "Email",
    value: churchInfoStore.churchInfo?.email || "---",
    icon: "lucide:mail",
  },
]);

const socialLinks = computed<SocialLink[]>(() => [
  {
    label: "Facebook",
    icon: "simple-icons:facebook",
    url: churchInfoStore.churchInfo?.facebookUrl || "",
  },
  {
    label: "Instagram",
    icon: "simple-icons:instagram",
    url: churchInfoStore.churchInfo?.instagramUrl || "",
  },
  {
    label: "YouTube",
    icon: "simple-icons:youtube",
    url: churchInfoStore.churchInfo?.youtubeUrl || "",
  },
].filter((social) => Boolean(social.url)));

const openSocialLink = (url: string) => {
  if (url) window.open(url, "_blank", "noopener,noreferrer");
};

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);
const submitError = ref("");

const submitForm = async () => {
  isSubmitting.value = true;
  submitError.value = "";

  try {
    await ContactService.create({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      subject: form.subject,
      message: form.message,
    });

    form.firstName = "";
    form.lastName = "";
    form.email = "";
    form.subject = "";
    form.message = "";
  } catch (e) {
    if (axios.isAxiosError(e)) {
      submitError.value = e.response?.data?.message?.[0] ?? "Something went wrong";
    } else {
      submitError.value = "Something went wrong";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <CSection id="contact">
    <CSectionHeading
      label="Connect"
      title="We'd Love to Meet You"
      sub-title="Visiting for the first time or just have a question — reach out. We look forward to connecting."
      centered
    />
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div class="space-y-6">
        <div class="rounded-lg bg-white p-7">
          <div class="mb-5 flex items-center justify-between gap-3">
            <h3 class="font-['Playfair_Display'] text-[20px] font-medium text-foreground">
              Find Us
            </h3>
            <UButton
              v-if="canEdit"
              type="button"
              icon="i-lucide-pencil"
              label="Edit"
              color="primary"
              variant="soft"
              size="sm"
              class="rounded-xl"
              @click="isEditOpen = true"
            />
          </div>
          <div class="space-y-5">
            <div
              v-for="info in contactInfo"
              :key="info.label"
              class="flex items-start gap-3"
            >
              <UIcon
                :name="info.icon"
                size="20"
                class="mt-0.5 shrink-0 text-primary"
              />
              <div>
                <div class="text-[14px] font-medium text-foreground">
                  {{ info.label }}
                </div>

                <div
                  class="mt-0.5 whitespace-pre-line text-[13px] text-muted-foreground"
                >
                  {{ info.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="socialLinks.length" class="rounded-lg bg-white p-7">
          <h3
            class="mb-4 font-['Playfair_Display'] text-[20px] font-medium text-foreground"
          >
            Follow Along
          </h3>
          <div class="flex gap-3">
            <button
              v-for="social in socialLinks"
              :key="social.label"
              type="button"
              :aria-label="social.label"
              class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-secondary text-primary transition-colors hover:bg-primary hover:text-white"
              @click="openSocialLink(social.url)"
            >
              <UIcon :name="social.icon" size="19" />
            </button>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white bg-card p-8 lg:col-span-2">
        <h3
          class="mb-6 font-['Playfair_Display'] text-[20px] font-medium text-foreground"
        >
          Send Us a Message
        </h3>
        <form class="space-y-5">
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <CInput
              v-model="form.firstName"
              label="First Name"
              placeholder="John"
              required
            />
            <CInput
              v-model="form.lastName"
              label="Last Name"
              placeholder="Smith"
              required
            />
          </div>
          <CInput
            v-model="form.email"
            label="Email Address"
            type="email"
            placeholder="john.smith@email.com"
            required
          />
          <CInput
            v-model="form.subject"
            label="Subject"
            placeholder="I'd like to plan a visit"
            required
          />
          <CInput
            v-model="form.message"
            label="Message"
            placeholder="Tell us how we can help or what you'd like to know..."
            textarea
            :rows="5"
            required
          />
          <p v-if="submitError" class="text-sm text-red-600">
            {{ submitError }}
          </p>
          <CButton
            title="Send Message"
            color="primary"
            append-icon="lucide:arrow-right"
            :loading="isSubmitting"
            type="submit"
            @on-click="submitForm"
          />
        </form>
      </div>
    </div>
  </CSection>
  <ContactInfoEditDialog
    v-if="userStore.user"
    v-model:open="isEditOpen"
  />
</template>
