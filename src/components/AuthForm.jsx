"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";

export default function AuthForm({ mode }) {
  const isSignUp = mode === "signup";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState("/");

  useEffect(() => {
    const requestedPath = new URLSearchParams(window.location.search).get("next");
    if (requestedPath?.startsWith("/") && !requestedPath.startsWith("//")) {
      setNextPath(requestedPath);
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const result = isSignUp
        ? await signUp.email({ name, email, password })
        : await signIn.email({ email, password });

      if (result.error) {
        toast.error(result.error.message || "অনুরোধটি সম্পন্ন করা যায়নি");
        return;
      }

      if (isSignUp) {
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
        router.push("/signin");
      } else {
        toast.success("স্বাগতম! আপনি সাইন ইন করেছেন।");
        router.push(nextPath);
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "একটি সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider) {
    setLoading(true);
    try {
      const result = await signIn.social({
        provider,
        callbackURL: isSignUp ? "/" : nextPath,
      });
      if (result?.error) {
        toast.error(
          result.error.message || `${provider} দিয়ে সাইন ইন করা যায়নি`,
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `${provider} দিয়ে সাইন ইন করা যায়নি`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container auth-page">
      <section className="auth-aside">
        <span className="eyebrow">
          <span className="eyebrow-dot" />
          বাজারদর থাকুক সবসময় হাতের কাছে
        </span>
        <h1>সচেতন বাজার, সাশ্রয়ী জীবন</h1>
        <p>
          আপনার এলাকার নিত্যপ্রয়োজনীয় পণ্যের দাম জানুন এবং প্রতিদিনের বাজার
          পরিকল্পনা করুন আরও সহজে।
        </p>
        <Image
          src="/bazar-hero.png"
          alt="তাজা বাজারের ঝুড়ি"
          width={250}
          height={228}
        />
      </section>

      <section className="auth-form-card">
        <h2>{isSignUp ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "আপনার অ্যাকাউন্টে সাইন ইন করুন"}</h2>
        <p>
          {isSignUp
            ? "বাজার দর ব্যবহার শুরু করতে তথ্যগুলো দিন।"
            : "আপনার বাজারদর অ্যাকাউন্টে ফিরে আসুন।"}
        </p>
        <form
          className="form-stack"
          onInvalid={(event) => {
            event.preventDefault();
            toast.error("অনুগ্রহ করে সব তথ্য সঠিকভাবে পূরণ করুন");
          }}
          onSubmit={handleSubmit}
        >
          {isSignUp ? (
            <label className="form-field">
              আপনার নাম
              <input
                autoComplete="name"
                maxLength={100}
                name="name"
                placeholder="যেমন: মোহাম্মদ রহিম"
                required
              />
            </label>
          ) : null}
          <label className="form-field">
            ইমেইল
            <input
              autoComplete="email"
              name="email"
              placeholder="name@example.com"
              required
              type="email"
            />
          </label>
          <label className="form-field">
            পাসওয়ার্ড
            <input
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={8}
              name="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              required
              type="password"
            />
          </label>
          <button
            className="button button-primary form-submit"
            disabled={loading}
            type="submit"
          >
            {loading ? "অপেক্ষা করুন…" : isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
          </button>
        </form>

        <div className="auth-divider">অথবা</div>
        <div className="social-actions">
          <button
            className="social-button"
            disabled={loading}
            onClick={() => handleSocialSignIn("google")}
            type="button"
          >
            <span aria-hidden="true">G</span> Google দিয়ে চালিয়ে যান
          </button>
          <button
            className="social-button"
            disabled={loading}
            onClick={() => handleSocialSignIn("github")}
            type="button"
          >
            <span aria-hidden="true">⌘</span> GitHub দিয়ে চালিয়ে যান
          </button>
        </div>
        <p className="auth-switch">
          {isSignUp ? "আগে থেকেই অ্যাকাউন্ট আছে? " : "অ্যাকাউন্ট নেই? "}
          <Link href={isSignUp ? "/signin" : "/signup"}>
            {isSignUp ? "সাইন ইন করুন" : "সাইন আপ করুন"}
          </Link>
        </p>
      </section>
    </div>
  );
}
