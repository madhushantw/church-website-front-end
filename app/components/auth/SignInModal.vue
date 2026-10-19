
<script setup lang="ts">
import { AuthService } from '~/services/auth.service'
import { useUserStore } from '~/stores/user.store'
import { CInput } from '../common'

type AuthMode = 'login' | 'forgot' | 'reset'

const open = defineModel<boolean>('open', { default: false })

const mode = ref<AuthMode>('login')
const email = ref('')
const password = ref('')
const otp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const isLoading = ref(false)
const signInError = ref('')
const successMessage = ref('')

const userStore = useUserStore()

const clearMessages = () => {
  signInError.value = ''
  successMessage.value = ''
}

const changeMode = (nextMode: AuthMode) => {
  clearMessages()
  mode.value = nextMode
}

const signIn = async () => {
  clearMessages()
  isLoading.value = true

  try {
    const response = await AuthService.login({
      email: email.value,
      password: password.value,
    })

    userStore.setSession(response.data.accessToken, response.data.user)

    open.value = false
    password.value = ''
    mode.value = 'login'
  } catch {
    signInError.value = 'Unable to sign in. Please check your details.'
  } finally {
    isLoading.value = false
  }
}

const requestOtp = async () => {
  clearMessages()
  isLoading.value = true

  try {
    await AuthService.forgotPassword(email.value.trim())

    // The backend intentionally returns a generic response.
    // Continue to the OTP form without revealing whether the email exists.
    mode.value = 'reset'
    successMessage.value =
      'If an account exists for this email, a reset code will be sent. Check your inbox and spam folder.'
  } catch {
    signInError.value =
      'Unable to process your request. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const resetPassword = async () => {
  clearMessages()

  if (newPassword.value !== confirmPassword.value) {
    signInError.value = 'Passwords do not match.'
    return
  }

  if (!/^\d{6}$/.test(otp.value)) {
    signInError.value = 'Enter the six-digit code from your email.'
    return
  }

  isLoading.value = true

  try {
    await AuthService.resetPassword({
      email: email.value.trim(),
      otp: otp.value,
      newPassword: newPassword.value,
    })

    password.value = ''
    otp.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    mode.value = 'login'
    successMessage.value =
      'Password reset successfully. Please sign in with your new password.'
  } catch (error: unknown) {
    const response = error as {
      response?: {
        data?: {
          message?: string | string[]
        }
      }
    }

    const message = response.response?.data?.message

    signInError.value = Array.isArray(message)
      ? message.join(' ')
      : message || 'Unable to reset password. Check your OTP and try again.'
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  open.value = false
  clearMessages()
}

watch(open, (isOpen) => {
  if (!isOpen) {
    mode.value = 'login'
    clearMessages()
    otp.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content:
        'w-full max-w-md overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form
        class="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[calc(100dvh-4rem)]"
        @submit.prevent="
          mode === 'login'
            ? signIn()
            : mode === 'forgot'
              ? requestOtp()
              : resetPassword()
        "
      >
        <!-- Header -->
        <div
          class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8"
        >
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              {{
                mode === 'login'
                  ? 'Welcome back'
                  : mode === 'forgot'
                    ? 'Account recovery'
                    : 'Secure your account'
              }}
            </p>

            <h2
              class="font-['Playfair_Display'] text-3xl text-foreground"
            >
              {{
                mode === 'login'
                  ? 'Sign in'
                  : mode === 'forgot'
                    ? 'Forgot password?'
                    : 'Reset password'
              }}
            </h2>

            <p class="mt-2 text-sm text-muted-foreground">
              {{
                mode === 'login'
                  ? "Continue your journey with St Luke's Anglican Church."
                  : mode === 'forgot'
                    ? "Enter your email and we'll send instructions to reset your password."
                    : 'Enter the six-digit code sent to your email and choose a new password.'
              }}
            </p>
          </div>

          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close sign in"
            class="shrink-0 rounded-full"
            @click="closeModal"
          />
        </div>

        <!-- Form fields -->
        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <div class="space-y-4">
            <CInput
              v-model="email"
              type="email"
              placeholder="Email address"
              icon="i-lucide-mail"
              required
              class="w-full"
              :disabled="isLoading || mode === 'reset'"
            />

            <template v-if="mode === 'login'">
              <CInput
                v-model="password"
                type="password"
                placeholder="Password"
                icon="i-lucide-lock-keyhole"
                required
                class="w-full"
                :disabled="isLoading"
              />

              <div class="text-right">
                <UButton
                  type="button"
                  label="Forgot password?"
                  color="primary"
                  variant="link"
                  size="sm"
                  :disabled="isLoading"
                  @click="changeMode('forgot')"
                />
              </div>
            </template>

            <template v-else-if="mode === 'reset'">
              <UInput
                v-model="otp"
                placeholder="Six-digit email OTP"
                icon="i-lucide-shield-check"
                inputmode="numeric"
                maxlength="6"
                required
                class="w-full"
                :disabled="isLoading"
              />

              <CInput
                v-model="newPassword"
                type="password"
                placeholder="New password"
                icon="i-lucide-lock-keyhole"
                required
                class="w-full"
                :disabled="isLoading"
              />

              <CInput
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                icon="i-lucide-lock-keyhole"
                required
                class="w-full"
                :disabled="isLoading"
              />

              <div class="flex justify-between gap-3">
                <UButton
                  type="button"
                  label="Change email"
                  color="neutral"
                  variant="link"
                  size="sm"
                  :disabled="isLoading"
                  @click="changeMode('forgot')"
                />

                <UButton
                  type="button"
                  label="Resend code"
                  color="primary"
                  variant="link"
                  size="sm"
                  :disabled="isLoading"
                  @click="requestOtp"
                />
              </div>
            </template>
          </div>

          <p
            v-if="signInError"
            class="mt-4 text-sm text-red-600"
            role="alert"
          >
            {{ signInError }}
          </p>

          <p
            v-if="successMessage"
            class="mt-4 text-sm text-green-700"
            role="status"
          >
            {{ successMessage }}
          </p>
        </div>

        <!-- Footer -->
        <div
          class="shrink-0 border-t border-primary/10 px-6 py-4 sm:px-8"
        >
          <UButton
            v-if="mode === 'login'"
            type="submit"
            label="Sign in"
            icon="i-lucide-arrow-right"
            trailing
            block
            size="xl"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />

          <UButton
            v-else-if="mode === 'forgot'"
            type="submit"
            label="Send reset code"
            icon="i-lucide-mail"
            trailing
            block
            size="xl"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />

          <UButton
            v-else
            type="submit"
            label="Reset password"
            icon="i-lucide-shield-check"
            trailing
            block
            size="xl"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />

          <div v-if="mode !== 'login'" class="mt-3 text-center">
            <UButton
              type="button"
              label="Back to sign in"
              color="neutral"
              variant="link"
              size="sm"
              :disabled="isLoading"
              @click="changeMode('login')"
            />
          </div>
        </div>
      </form>
    </template>
  </UModal>
</template>
