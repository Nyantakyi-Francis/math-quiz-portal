"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AdminThreadMarkReadProps = {
  learnerId: string;
};

export function AdminThreadMarkRead({ learnerId }: AdminThreadMarkReadProps) {
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    fetch("/admin/messages/mark-read", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        learner_id: learnerId
      }),
      signal: controller.signal
    })
      .then(() => {
        router.refresh();
      })
      .catch(() => {
        // Ignore network errors - the thread can still render.
      });

    return () => controller.abort();
  }, [learnerId, router]);

  return null;
}

