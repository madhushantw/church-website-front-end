<script setup lang="ts">
import { UserRole, UsersService, type UserItem } from '~/services/users.service'
import UserDialog from './UserDialog.vue'
import ConfirmationDialog from '../common/ConfirmationDialog.vue'

const open = defineModel<boolean>('open', { default: false })
const users = ref<UserItem[]>([])
const isLoading = ref(false)
const error = ref('')
const userDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const selectedUser = ref<UserItem | null>(null)
const isDeleting = ref(false)

const loadUsers = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await UsersService.getAll()
    users.value = response.data
  } catch {
    error.value = 'Unable to load users. Please try again.'
  } finally {
    isLoading.value = false
  }
}

watch(open, (isOpen) => {
  if (isOpen) loadUsers()
})

const openCreateDialog = () => {
  selectedUser.value = null
  userDialogOpen.value = true
}

const openEditDialog = (user: UserItem) => {
  selectedUser.value = user
  userDialogOpen.value = true
}

const openDeleteDialog = (user: UserItem) => {
  selectedUser.value = user
  deleteDialogOpen.value = true
}

const upsertUser = (user: UserItem) => {
  const index = users.value.findIndex((item) => item.id === user.id)

  if (index === -1) {
    users.value.unshift(user)
  } else {
    users.value[index] = user
  }
}

const deleteUser = async () => {
  if (!selectedUser.value) return

  isDeleting.value = true

  try {
    await UsersService.delete(selectedUser.value.id)
    users.value = users.value.filter((user) => user.id !== selectedUser.value?.id)
    deleteDialogOpen.value = false
    selectedUser.value = null
  } catch {
    error.value = 'Unable to delete this user. Please try again.'
  } finally {
    isDeleting.value = false
  }
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
        <div class="flex items-start justify-between border-b border-primary/10 p-6">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Root access
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Users
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Create and manage church accounts.
            </p>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close users sidebar"
            class="rounded-full"
            @click="open = false"
          />
        </div>

        <div class="flex items-center justify-between border-b border-primary/10 px-6 py-4">
          <span class="text-sm font-medium text-foreground">{{ users.length }} users</span>
          <UButton
            label="Create user"
            icon="i-lucide-user-plus"
            size="sm"
            color="primary"
            class="rounded-xl"
            @click="openCreateDialog"
          />
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="isLoading" class="py-12 text-center text-sm text-muted-foreground">
            Loading users...
          </div>
          <div v-else-if="error" class="space-y-4 py-8 text-center">
            <p class="text-sm text-red-600">{{ error }}</p>
            <UButton label="Retry" color="neutral" variant="soft" size="sm" @click="loadUsers" />
          </div>
          <div v-else-if="users.length === 0" class="py-12 text-center text-sm text-muted-foreground">
            No users found.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="user in users"
              :key="user.id"
              class="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white/60 p-3"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-foreground">{{ user.name }}</p>
                <p class="truncate text-xs text-muted-foreground">{{ user.email }}</p>
                <span
                  class="mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  :class="user.role === UserRole.ROOT ? 'bg-accent/15 text-accent' : 'bg-primary/10 text-primary'"
                >
                  {{ user.role }}
                </span>
              </div>
              <div class="flex shrink-0 gap-1">
                <UButton
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  aria-label="Edit user"
                  class="rounded-full"
                  @click="openEditDialog(user)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  size="xs"
                  aria-label="Delete user"
                  class="rounded-full"
                  @click="openDeleteDialog(user)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
  <UserDialog
    v-model:open="userDialogOpen"
    :user="selectedUser"
    @saved="upsertUser"
  />
  <ConfirmationDialog
    v-model="deleteDialogOpen"
    type="delete"
    title="Delete user?"
    :subtitle="`This will permanently remove ${selectedUser?.name}.`"
    @confirm="deleteUser"
  />
</template>
