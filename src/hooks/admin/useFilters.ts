import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    level: searchParams.get('level') || '',
    platform: searchParams.get('platform') || '',
    topicSlug: searchParams.get('topicSlug') || '',
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10
  });

  useEffect(() => {
    const params = new URLSearchParams(filters as any);
    router.replace(`?${params.toString()}`);
  }, [filters]);

  return { filters, setFilters };
}