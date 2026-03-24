import { getAdminQuestions } from "@/services/admin.service";
import { useEffect, useState } from "react";

export function useQuestions(filters) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1
  });

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await getAdminQuestions(filters);
      setQuestions(res.data);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [filters]);

  return { questions, loading, pagination, reload: loadQuestions };
}