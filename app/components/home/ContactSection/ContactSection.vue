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
  href?: string;
}

interface SocialLink {
  label: string;
  icon: string;
  url: string;
}

const props = withDefaults(defineProps<{ allowCreate?: boolean }>(), {
  allowCreate: false,
});

const PLACEHOLDER = "---";

const churchInfoStore = useChurchInfoStore();
const userStore = useUserStore();
const isEditOpen = ref(false);
const canEdit = computed(
  () => props.allowCreate && userStore.user?.role === UserRole.ROOT,
);

const contactInfo = computed<ContactInfo[]>(() => {
  const address = churchInfoStore.churchInfo?.address || PLACEHOLDER;
  const phone = churchInfoStore.churchInfo?.phone || PLACEHOLDER;
  const email = churchInfoStore.churchInfo?.email || PLACEHOLDER;

  return [
    {
      label: "Address",
      value: address,
      icon: "lucide:map-pin",
      href:
        address !== PLACEHOLDER
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
          : "",
    },
    {
      label: "Phone",
      value: phone,
      icon: "lucide:phone",
      href: phone !== PLACEHOLDER ? `tel:${phone.replace(/\s+/g, "")}` : "",
    },
    {
      label: "Email",
      value: email,
      icon: "lucide:mail",
      href: email !== PLACEHOLDER ? `mailto:${email}` : "",
    },
  ];
});

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

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;
  submitError.value = "";
  submitSuccess.value = false;

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
    submitSuccess.value = true;
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
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div class="space-y-6 lg:col-span-2">
        <div
          class="group relative isolate overflow-hidden rounded-3xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 sm:p-7"
        >
          <div
            class="pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-primary/20"
          />
          <span
            class="absolute left-0 top-0 h-1 w-0 bg-linear-to-r from-primary to-primary/30 transition-all duration-500 group-hover:w-full"
          />
          <div class="mb-6 flex items-center justify-between gap-3">
            <h3
              class="font-['Playfair_Display'] text-xl font-semibold tracking-tight text-foreground"
            >
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
              class="rounded-full"
              @click="isEditOpen = true"
            />
          </div>

          <div class="space-y-3">
            <component
              :is="info.href ? 'a' : 'div'"
              v-for="info in contactInfo"
              :key="info.label"
              :href="info.href || undefined"
              :target="info.label === 'Address' && info.href ? '_blank' : undefined"
              :rel="info.label === 'Address' && info.href ? 'noopener noreferrer' : undefined"
              class="group/info flex items-center gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-3.5 transition-all duration-300"
              :class="info.href ? 'hover:border-primary/30 hover:bg-primary/10' : ''"
            >
              <span
                class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/60 text-white shadow-sm transition-transform duration-300 group-hover/info:scale-110 group-hover/info:-rotate-6"
              >
                <UIcon :name="info.icon" size="18" />
              </span>

              <span class="min-w-0">
                <span
                  class="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {{ info.label }}
                </span>
                <span
                  class="block whitespace-pre-line wrap-break-word text-sm font-medium text-foreground"
                >
                  {{ info.value }}
                </span>
              </span>
            </component>
          </div>
        </div>
        <div
          v-if="socialLinks.length"
          class="group relative isolate overflow-hidden rounded-3xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 sm:p-7"
        >
          <div
            class="pointer-events-none absolute -bottom-16 -left-16 -z-10 h-44 w-44 rounded-full bg-primary/5 blur-3xl transition-all duration-700 group-hover:scale-125"
          />
          <h3
            class="mb-5 font-['Playfair_Display'] text-xl font-semibold tracking-tight text-foreground"
          >
            Follow Along
          </h3>
          <div class="flex gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.url"
              :aria-label="social.label"
              target="_blank"
              rel="noopener noreferrer"
              class="flex size-11 items-center justify-center rounded-full border border-primary/15 bg-primary/5 text-primary transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25"
            >
              <UIcon :name="social.icon" size="18" />
            </a>
          </div>
        </div>
      </div>
      <div
        class="group relative isolate overflow-hidden rounded-3xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 sm:p-8 lg:col-span-3 lg:p-10"
      >
        <div
          class="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          class="pointer-events-none absolute -bottom-24 -left-20 -z-10 h-56 w-56 rounded-full bg-primary/5 blur-3xl"
        />
        <span
          class="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-primary to-primary/20"
        />

        <div class="mb-8">
          <h3
            class="font-['Playfair_Display'] text-2xl font-semibold tracking-tight text-foreground"
          >
            Send Us a Message
          </h3>
          <p class="mt-2 text-sm text-muted-foreground">
            We usually reply within a day or two.
          </p>
        </div>

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
          <div
            v-if="submitSuccess"
            class="flex items-center gap-3 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            <UIcon name="i-lucide-circle-check" class="size-5 shrink-0" />
            Thank you — your message has been sent. We'll be in touch soon.
          </div>
          <div
            v-if="submitError"
            class="flex items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            <UIcon name="i-lucide-triangle-alert" class="size-5 shrink-0" />
            {{ submitError }}
          </div>
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