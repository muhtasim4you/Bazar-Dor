"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

export default function ProtectedRoute({ children }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isPending || session?.user) return;
    toast.error("এই পৃষ্ঠাটি দেখতে সাইন ইন করুন");
    router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
  }, [isPending, pathname, router, session]);

  if (isPending || !session?.user) {
    return (
      <div className="page-container protected-loading" role="status">
        <div className="skeleton" style={{ width: 260, minHeight: 24 }} />
        <p>আপনার অ্যাকাউন্ট যাচাই করা হচ্ছে…</p>
      </div>
    );
  }

  return children;
}
