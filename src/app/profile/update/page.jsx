"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { authClient, signOut, useSession } from "@/lib/auth-client";

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

  async function handleSignOut() {
    try {
      const result = await signOut();
      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি");
        return;
      }
      toast.success("আপনি সাইন আউট করেছেন");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "সাইন আউট করা যায়নি");
    }
  }

  return (
    <section className="page-container profile-page">
      <Link className="profile-back-link" href="/profile">
        ← প্রোফাইলে ফিরে যান
      </Link>
      <header className="profile-page-heading">
        <h1>আমার প্রোফাইল</h1>
        <p>আপনার অ্যাকাউন্টের তথ্য হালনাগাদ করুন।</p>
      </header>
      <div className="profile-user-card">
        <span className="profile-user-avatar">
          {session.user.image ? (
            <img alt="" src={session.user.image} />
          ) : (
            session.user.name?.slice(0, 1) || "👤"
          )}
        </span>
        <div className="profile-user-copy">
          <strong>{session.user.name}</strong>
          <span>{session.user.email}</span>
        </div>
        <button
          className="button button-danger-outline profile-edit-link"
          onClick={handleSignOut}
          type="button"
        >
          ↗ সাইন আউট
        </button>
      </div>
      <section className="profile-info-card">
        <h2>তথ্য</h2>
        <form className="profile-info-form" onSubmit={handleSubmit}>
          <label className="form-field">
            নাম
            <input
              autoComplete="name"
              maxLength={100}
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
          </label>
          <button
            className="button button-primary profile-info-button"
            disabled={saving}
            type="submit"
          >
            {saving ? "আপডেট হচ্ছে…" : "আপডেট"}
          </button>
        </form>
      </section>
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
