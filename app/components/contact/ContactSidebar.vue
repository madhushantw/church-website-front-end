<script setup lang="ts">
import { ContactService, type ContactItem } from "~/services/contact.service";
import { ConfirmationDialog } from "../common";

const open = defineModel<boolean>({ default: false });

const {
  items: contacts,
  page,
  total,
  limit,
  loading: isLoading,
  error,
  refresh,
} = useApiPagination<ContactItem>(
  "contacts",
  ContactService.getAll,
  "Unable to load contacts. Please try again.",
);

const expandedContactId = ref<string | null>(null);
const isMarkingAsRead = ref(false);
const deleteDialogOpen = ref(false);
const selectedItem = ref<string | null>(null);

const toggleContact = async (contact: ContactItem) => {
  if (expandedContactId.value === contact.id) {
    expandedContactId.value = null;
    return;
  }

  expandedContactId.value = contact.id;

  if (!contact.isRead) {
    isMarkingAsRead.value = true;

    try {
      await ContactService.markAsRead(contact.id);
      contact.isRead = true;
    } catch (e) {
      console.error(e);
    } finally {
      isMarkingAsRead.value = false;
    }
  }
};

const openDeleteDialog = (id: string) => {
  selectedItem.value = id;
  deleteDialogOpen.value = true;
};

const deleteMessage = async () => {
  if (!selectedItem.value) return;

  try {
    await ContactService.delete(selectedItem.value);

    contacts.value = contacts.value.filter(
      (item) => item.id !== selectedItem.value,
    );
  } catch (e) {
    console.error(e);
  } finally {
    selectedItem.value = null;
    deleteDialogOpen.value = false;
  }
};

const onRefresh = () => {
  page.value = 1
  refresh()
}
</script>

<template>
  <USlideover
    v-model:open="open"
    side="right"
    :ui="{
      content: 'w-full max-w-md bg-background',
    }"
  >
    <template #content>
      <div class="flex h-full flex-col">
        <div
          class="flex items-start justify-between border-b border-primary/10 p-6"
        >
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              Messages
            </p>

            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Contact
            </h2>

            <p class="mt-2 text-sm text-muted-foreground">
              View messages sent through the contact form.
            </p>
          </div>

          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close contacts sidebar"
            class="rounded-full"
            @click="open = false"
          />
        </div>
        <div
          class="flex items-center justify-between border-b border-primary/10 px-6 py-4"
        >
          <span class="text-sm font-medium text-foreground">
            {{ total }} messages
          </span>
          <UIcon
            class="mt-1 size-4 shrink-0 text-muted-foreground"
            name="basil:refresh-outline"
            @click="onRefresh()"
          />
        </div>
        <div class="flex-1 overflow-y-auto p-6">
          <div
            v-if="isLoading"
            class="py-12 text-center text-sm text-muted-foreground"
          >
            Loading messages...
          </div>
          <div v-else-if="error" class="space-y-4 py-8 text-center">
            <p class="text-sm text-red-600">{{ error }}</p>
            <UButton
              label="Retry"
              color="neutral"
              variant="soft"
              size="sm"
              @click="refresh()"
            />
          </div>
          <div
            v-else-if="contacts.length === 0"
            class="py-12 text-center text-sm text-muted-foreground"
          >
            No messages found.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="contact in contacts"
              :key="contact.id"
              class="overflow-hidden rounded-2xl border border-primary/10 bg-white/60"
            >
              <button
                type="button"
                class="flex w-full items-start gap-3 p-4 text-left"
                @click="toggleContact(contact)"
              >
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                >
                  {{ contact.name.charAt(0).toUpperCase() }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p
                      class="truncate text-sm font-semibold text-foreground"
                      :class="{ 'font-bold': !contact.isRead }"
                    >
                      {{ contact.name }}
                    </p>
                    <span
                      v-if="!contact.isRead"
                      class="h-2 w-2 shrink-0 rounded-full bg-accent"
                    />
                  </div>
                  <p class="truncate text-xs text-muted-foreground">
                    {{ contact.subject }}
                  </p>
                  <p class="truncate text-xs text-muted-foreground">
                    {{ contact.email }}
                  </p>
                </div>
                <div class="flex flex-col items-center justify-center gap-2">
                  <UIcon
                    :name="
                      expandedContactId === contact.id
                        ? 'i-lucide-chevron-up'
                        : 'i-lucide-chevron-down'
                    "
                    class="mt-1 size-4 shrink-0 text-muted-foreground"
                  />
                  <UButton
                    :icon="
                      selectedItem === contact.id
                        ? 'i-lucide-chevron-down'
                        : 'i-lucide-trash-2'
                    "
                    color="error"
                    variant="ghost"
                    size="xs"
                    aria-label="Delete user"
                    class="rounded-full"
                    @click="openDeleteDialog(contact.id)"
                  />
                </div>
              </button>
              <div
                v-if="expandedContactId === contact.id"
                class="border-t border-primary/10 px-4 pb-4 pt-3"
              >
                <div class="space-y-3">
                  <div>
                    <p
                      class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      From
                    </p>
                    <p class="mt-1 text-sm text-foreground">
                      {{ contact.name }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ contact.email }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Subject
                    </p>
                    <p class="mt-1 text-sm font-medium text-foreground">
                      {{ contact.subject }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Message
                    </p>
                    <p
                      class="mt-1 whitespace-pre-wrap text-sm leading-6 text-foreground"
                    >
                      {{ contact.message }}
                    </p>
                  </div>
                  <div class="pt-1">
                    <p class="text-xs text-muted-foreground">
                      {{ new Date(contact.createdAt).toLocaleString() }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <UPagination
          v-if="total"
          v-model:page="page"
          :items-per-page="limit"
          :total="total"
          class="mx-auto my-4"
        />
      </div>
    </template>
  </USlideover>
  <ConfirmationDialog
    v-model="deleteDialogOpen"
    type="delete"
    title="Delete user?"
    subtitle="This will permanently remove this message"
    @confirm="deleteMessage"
    @cancel="selectedItem = null"
  />
</template>
