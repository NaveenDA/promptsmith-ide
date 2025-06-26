"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { selectedPromptIdAtom } from "@/lib/store";
import MainIDELayout from "@/app/MainIDELayout";

export default function PromptDetailPage() {
  const params = useParams();
  const setSelectedPromptId = useSetAtom(selectedPromptIdAtom);

  useEffect(() => {
    if (params?.id) {
      setSelectedPromptId(params.id as string);
    }
    return () => setSelectedPromptId(null);
  }, [params?.id, setSelectedPromptId]);

  return <MainIDELayout />;
} 