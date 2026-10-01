<script setup lang="ts">
import { CInput } from "~/components/common";
import { ContactService } from "~/services/contact.service";

const open = defineModel<boolean>("open", { default: false });

const isSubmitting = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

const initialForm = () => ({
  name: "",
  email: "",
  phone: "",
  purposes: [] as string[],
  locations: [] as string[],
  note: "",
});

const form = reactive(initialForm());
const purposes = ["Prayer Request", "Pastoral Care"];
const locations = ["St Lukes Modbury", "ECH Ridgehaven", "None"];

watch(open, (isOpen) => {
  if (!isOpen) return;
  submitError.value = "";
  submitSuccess.value = false;
});

const submitRequest = async () => {
  if (!form.purposes.length || !form.locations.length) {
    submitError.value = "Please select at least one purpose and location.";
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";

  const message = [
    `Phone number: ${form.phone}`,
    `Purpose: ${form.purposes.join(", ")}`,
    `Usual location: ${form.locations.join(", ")}`,
    `Note: ${form.note.trim() || "No additional note provided."}`,
  ].join("\n\n");

  try {
    await ContactService.create({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.purposes.join(" and "),
      message,
    });
    submitSuccess.value = true;
    Object.assign(form, initialForm());
  } catch {
    submitError.value = "Unable to send your message right now. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content:
        'max-w-2xl rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form
        class="max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        @submit.prevent="submitRequest"
      >
        <div class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              We'd love to support you
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Request Prayer
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Share a little about how we can connect and pray with you.
            </p>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close prayer request dialog"
            class="rounded-full"
            :disabled="isSubmitting"
            @click="open = false"
          />
        </div>

        <div
          v-if="submitSuccess"
          class="mb-5 rounded-xl bg-primary/10 p-4 text-sm text-primary"
          role="status"
        >
          Thank you. Your message has been sent, and our team will be in touch.
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2">
          <CInput
            v-model="form.name"
            label="Name"
            placeholder="Your name"
            required
          />
          <CInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <div class="sm:col-span-2">
            <CInput
              v-model="form.phone"
              label="Phone number"
              type="tel"
              placeholder="Your phone number"
              required
            />
          </div>

          <fieldset class="sm:col-span-2">
            <legend class="mb-2 text-sm font-semibold text-foreground">
              For what purpose are you filling out this form?
            </legend>
            <div class="grid gap-2 sm:grid-cols-2">
              <label
                v-for="purpose in purposes"
                :key="purpose"
                class="flex items-center gap-3 rounded-xl border border-primary/15 p-3 text-sm text-foreground"
              >
                <input
                  v-model="form.purposes"
                  type="checkbox"
                  :value="purpose"
                  class="size-4 accent-primary"
                >
                {{ purpose }}
              </label>
            </div>
          </fieldset>

          <fieldset class="sm:col-span-2">
            <legend class="mb-2 text-sm font-semibold text-foreground">
              What location do you normally attend?
            </legend>
            <div class="grid gap-2 sm:grid-cols-3">
              <label
                v-for="location in locations"
                :key="location"
                class="flex items-center gap-3 rounded-xl border border-primary/15 p-3 text-sm text-foreground"
              >
                <input
                  v-model="form.locations"
                  type="checkbox"
                  :value="location"
                  class="size-4 accent-primary"
                >
                {{ location }}
              </label>
            </div>
          </fieldset>

          <div class="sm:col-span-2">
            <CInput
              v-model="form.note"
              label="Note"
              textarea
              placeholder="Share any details you'd like us to know..."
            />
          </div>
        </div>

        <p v-if="submitError" class="mt-4 text-sm text-red-600" role="alert">
          {{ submitError }}
        </p>

        <div v-if="!submitSuccess" class="mt-6 flex justify-end">
          <UButton
            type="submit"
            label="Send Request"
            icon="i-lucide-send"
            color="primary"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="rounded-xl"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
