import { computed, ref, watch, type Ref } from 'vue'
import type {
  PaginationOptions,
  PaginationResponse,
} from '~/services/interfaces/pagination.interface'

interface UseApiPaginationOptions {
  limit?: number
}

export function useApiPagination<T, P extends Record<string, unknown> = Record<string, never>>(
  key: string,
  fetcher: (
    params: PaginationOptions & P,
  ) => Promise<PaginationResponse<T>>,
  errorMessage: string,
  params?: Ref<P>,
  options: UseApiPaginationOptions = {},
) {
  const page = ref(1)
  const limit = ref(options.limit ?? 5)
  const items = ref<T[]>([]) as Ref<T[]>
  const total = ref(0)
  const totalPages = ref(0)

  const { data, error, status, refresh } = useAsyncData(
    () =>
      `${key}:${page.value}:${limit.value}:${JSON.stringify(params?.value ?? {})}`,
    () =>
      fetcher({
        ...params?.value,
        page: page.value,
        limit: limit.value,
      } as PaginationOptions & P),
    {
      server: false,
    },
  );

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

  watch([limit, () => JSON.stringify(params?.value ?? {})], () => {
    page.value = 1
  })

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