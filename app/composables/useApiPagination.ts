import { computed, ref, watch, type Ref } from 'vue'
import type {
  PaginationOptions,
  PaginationResponse,
} from '~/services/interfaces/pagination.interface'

export function useApiPagination<T, P extends Record<string, unknown> = Record<string, never>>(
  key: string,
  fetcher: (
    params: PaginationOptions & P,
  ) => Promise<PaginationResponse<T>>,
  errorMessage: string,
  params?: Ref<P>,
) {
  const page = ref(1)
  const limit = ref(5)
  const items = ref<T[]>([])
  const total = ref(0)
  const totalPages = ref(0)

  const { data, error, status, refresh } = useAsyncData(
    key,
    () =>
      fetcher({
        ...params?.value,
        page: page.value,
        limit: limit.value,
      } as PaginationOptions & P),
    {
      server: false,
    },
  )

  watch(
    data,
    value => {
      if (!value) return

      items.value = value.data.items
      total.value = value.data.total
      totalPages.value = value.data.totalPages
    },
    { immediate: true },
  )

  watch([() => page.value, () => limit.value, () => params?.value], () => {
    refresh()
  }, { immediate: true })

  return {
    items,
    total,
    totalPages,
    page,
    limit,
    loading: computed(() => status.value === 'pending'),
    error: computed(() => (error.value ? errorMessage : null)),
    refresh,
  }
}