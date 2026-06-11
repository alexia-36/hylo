"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      await supabase.auth.getSession();

      router.replace("/pages/profile");
    }

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Confirming account...
    </div>
  );
}
