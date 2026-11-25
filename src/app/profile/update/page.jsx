"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { authClient, useSession } from "@/lib/auth-client";

function UpdateProfileForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  async function handleSubmit(event) {
    event.preventDefault();
    const updatedName = name.trim();
    if (!updatedName) {
      toast.error("নাম লিখুন");
      return;
    }

    setSaving(true);
    try {
      const result = await authClient.updateUser({ name: updatedName });
      if (result.error) {
        toast.error(result.error.message || "তথ্য হালনাগাদ করা যায়নি");
        return;
      }
      toast.success("আপনার নাম হালনাগাদ হয়েছে");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "তথ্য হালনাগাদ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page-container profile-panel">
      <Link className="detail-back" href="/profile">
        ← প্রোফাইলে ফিরে যান
      </Link>
      <h1 className="section-title">প্রোফাইলের তথ্য হালনাগাদ</h1>
      <p className="section-subtitle">আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।</p>
      <form className="form-stack profile-update-form" onSubmit={handleSubmit}>
        <label className="form-field">
          আপনার নাম
          <input
            autoComplete="name"
            maxLength={100}
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
        </label>
        <button className="button button-primary" disabled={saving} type="submit">
          {saving ? "হালনাগাদ হচ্ছে…" : "তথ্য হালনাগাদ করুন"}
        </button>
      </form>
    </section>
  );
}

export default function UpdateProfilePage() {
  return (
    <ProtectedRoute>
      <UpdateProfileForm />
    </ProtectedRoute>
  );
}
