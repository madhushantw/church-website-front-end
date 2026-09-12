import type { CResponse } from "~/services/interfaces/Response.interface";

export function useApiList<T>(
  key: string,
  fetcher: () => Promise<CResponse<T[]>>,
  errorMessage: string,
) {
  const { data: items, error, status, refresh } = useAsyncData(
    key,
    async () => (await fetcher()).data,
    {
      default: () => [],
      server: false,
    },
  );

  return {
    items,
    loading: computed(() => status.value === "pending"),
    error: computed(() => (error.value ? errorMessage : null)),
    refresh,
  };
}