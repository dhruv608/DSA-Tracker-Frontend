import { getAllTopics } from "@/services/admin.service";
import { useEffect, useState } from "react";

export function useTopicsFilter() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    getAllTopics().then(data => {
      setTopics(data.map(t => ({
        label: t.topic_name,
        value: t.slug
      })));
    });
  }, []);

  return topics;
}