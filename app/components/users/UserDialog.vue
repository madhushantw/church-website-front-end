<script setup lang="ts">
import axios from 'axios'
import { UsersService, type CreateUser, type UserItem } from '~/services/users.service'
import { CInput } from '~/components/common'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{
  user?: UserItem | null
}>()
const emit = defineEmits<{
  saved: [user: UserItem]
}>()

const form = ref<CreateUser>({
  name: '',
  email: '',
  password: '',
})
const isLoading = ref(false)
const error = ref('')
const isEditing = computed(() => !!props.user)

watch(
  () => [open.value, props.user] as const,
  () => {
    if (!open.value) return

    form.value = {
      name: props.user?.name || '',
      email: props.user?.email || '',
      password: '',
    }
    error.value = ''
  },
  { immediate: true },
)

const close = () => {
  if (!isLoading.value) open.value = false
}

const saveUser = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const response = isEditing.value && props.user
      ? await UsersService.update(
          props.user.id,
          form.value.password
            ? form.value
            : { name: form.value.name, email: form.value.email }
        )
      : await UsersService.create(form.value)

    emit('saved', response.data)
    open.value = false
  } catch (e) {
    if (axios.isAxiosError(e)) {
      error.value = e.response?.data?.message?.[0] ?? 'Something went wrong'
    } else {
      error.value = 'Something went wrong'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content: 'w-full max-w-md overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form
        class="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[calc(100dvh-4rem)]"
        @submit.prevent="saveUser"
      >
        <div class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              User management
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              {{ isEditing ? 'Edit user' : 'Create a user' }}
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ isEditing ? 'Update this account details.' : 'Add a new account to St Lukes.' }}
            </p>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close user dialog"
            class="shrink-0 rounded-full"
            @click="close"
          />
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <div class="space-y-4">
          <CInput
            v-model="form.name"
            label="Name"
            placeholder="Full name"
            required
            class="w-full"
          />
          <CInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Email address"
            required
            class="w-full"
          />
          <CInput
            v-model="form.password"
            label="Password"
            type="password"
            :placeholder="isEditing ? 'Leave blank to keep current password' : 'At least 6 characters'"
            :required="!isEditing"
            class="w-full"
          />
          </div>
          <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>
        </div>
        <div class="flex shrink-0 justify-end gap-3 border-t border-primary/10 px-6 py-4 sm:px-8">
          <UButton
            type="button"
            label="Cancel"
            color="neutral"
            variant="soft"
            class="rounded-xl"
            :disabled="isLoading"
            @click="close"
          />
          <UButton
            type="submit"
            :label="isEditing ? 'Save changes' : 'Create user'"
            :icon="isEditing ? 'i-lucide-check' : 'i-lucide-user-plus'"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
