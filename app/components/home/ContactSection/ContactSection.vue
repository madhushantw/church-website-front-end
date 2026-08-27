<script setup lang="ts">
import {
  CButton,
  CInput,
  CSection,
  CSectionHeading,
} from "~/components/common";

interface ContactInfo {
  label: string;
  value: string;
  icon: string;
}

const contactInfo: ContactInfo[] = [
  {
    label: "Address",
    value: "4820 Lakeview Drive\nPinewood, BC V3R 4K1",
    icon: "lucide:map-pin",
  },
  {
    label: "Phone",
    value: "(604) 555-0182",
    icon: "lucide:phone",
  },
  {
    label: "Email",
    value: "hello@gracecommunity.church",
    icon: "lucide:mail",
  },
  {
    label: "Office Hours",
    value: "Mon – Fri: 9:00 AM – 4:00 PM",
    icon: "lucide:clock",
  },
];

interface SocialLink {
  label: string;
  icon: string;
}

const socialLinks: SocialLink[] = [
  {
    label: "Facebook",
    icon: "simple-icons:facebook",
  },
  {
    label: "Instagram",
    icon: "simple-icons:instagram",
  },
  {
    label: "YouTube",
    icon: "simple-icons:youtube",
  },
];

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
});

const submitForm = () => {
  console.log(form);
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
          <h3
            class="mb-5 font-['Playfair_Display'] text-[20px] font-medium text-foreground"
          >
            Find Us
          </h3>

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

        <div class="rounded-lg bg-white p-7">
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

        <form class="space-y-5" @submit.prevent="submitForm">
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
          />

          <CInput
            v-model="form.message"
            label="Message"
            placeholder="Tell us how we can help or what you'd like to know..."
            textarea
            :rows="5"
            required
          />

          <CButton
            title="Send Message"
            color="primary"
            append-icon="lucide:arrow-right"
          />
        </form>
      </div>
    </div>
  </CSection>
</template>
