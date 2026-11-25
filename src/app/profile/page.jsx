"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";

function ProfileContent() {
  const { data: session } = useSession();
  const user = session.user;

  return (
    <section className="page-container profile-page">
      <header className="profile-page-heading">
        <h1>আমার প্রোফাইল</h1>
        <p>আপনার অ্যাকাউন্টের তথ্য দেখুন ও হালনাগাদ করুন।</p>
      </header>
      <div className="profile-user-card">
        <span className="profile-user-avatar">
          {user.image ? (
            <img alt="" src={user.image} />
          ) : (
            user.name?.slice(0, 1) || "👤"
          )}
        </span>
        <div className="profile-user-copy">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
      </div>
      <section className="profile-info-card">
        <h2>তথ্য</h2>
        <div className="profile-readonly-fields">
          <div>
            <span>নাম</span>
            <strong>{user.name}</strong>
          </div>
          <div>
            <span>ইমেইল</span>
            <strong>{user.email}</strong>
          </div>
        </div>
        <Link className="button button-primary profile-info-button" href="/profile/update">
          তথ্য হালনাগাদ
        </Link>
      </section>
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
