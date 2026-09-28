import { ref, watch } from "vue";
import type { PaginationOptions, PaginationResponse } from "~/services/interfaces/pagination.interface";

export function useApiPagination<T>(
  key: string,
  fetcher: (params: PaginationOptions) => Promise<PaginationResponse<T>>,
  errorMessage: string,
) {
  const page = ref(1);
  const limit = ref(20);
  const items = ref<T[]>([]);
  const total = ref(0);
  const totalPages = ref(0);

  const { data, error, status, refresh } = useAsyncData(
    key,
    () =>
      fetcher({
        page: page.value,
        limit: limit.value,
      }),
    {
      server: false,
    },
  );

  watch(
    data,
    (value) => {
      if (!value) return;

      items.value = value.data.items;
      total.value = value.data.total;
      totalPages.value = value.data.totalPages;
    },
    { immediate: true },
  );

  return {
    items,
    total,
    totalPages,
    page,
    limit,
    loading: computed(() => status.value === "pending"),
    error: computed(() => (error.value ? errorMessage : null)),
    refresh,
  };
}
