// hooks/useThreads.ts
import useSWR from "swr";
import { getThread } from "@/lib/actions";

// fetcher-nya langsung panggil server action
const fetcher = () => getThread();

export function useThreads() {
  const { data, error, isLoading, mutate } = useSWR("threads", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    threads: data ?? [],
    isLoading,
    isError: error,
    mutateThreads: mutate,
  };
}
