"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";

function ProfileContent() {
  const { data: session } = useSession();
  const user = session.user;

  return (
    <section className="page-container profile-panel">
      <div className="profile-header">
        <span className="profile-avatar">
          {user.name?.slice(0, 1) || "👤"}
        </span>
        <div>
          <h1>আমার প্রোফাইল</h1>
          <p>আপনার অ্যাকাউন্টের তথ্য</p>
        </div>
      </div>
      <div className="profile-details">
        <p>
          <strong>নাম:</strong> {user.name}
        </p>
        <p>
          <strong>ইমেইল:</strong> {user.email}
        </p>
      </div>
      <div className="profile-actions">
        <Link className="button button-primary" href="/profile/update">
          তথ্য হালনাগাদ করুন
        </Link>
        <Link className="button button-outline" href="/">
          হোম পেজে ফিরুন
        </Link>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
