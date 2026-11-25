"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCategories, getProducts, formatBengaliNumber } from "@/lib/products";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    setBanglaDate(
      new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );
    getCategories()
      .then(setCategories)
      .catch((error) => toast.error(error.message));
    getProducts()
      .then(setProducts)
      .catch((error) => toast.error(error.message));
  }, []);

  async function handleSignOut() {
    const result = await signOut();
    if (result.error) {
      toast.error(result.error.message || "সাইন আউট করা যায়নি");
      return;
    }
    toast.success("আপনি সাইন আউট করেছেন");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="site-header">
      <div className="nav-main page-container">
        <Link className="brand" href="/" aria-label="বাজার দর হোম">
          <span className="brand-mark">🛒</span>
          <span className="brand-copy">
            <strong>বাজার দর</strong>
            <small>{banglaDate || "বাংলাদেশের বাজারদর"}</small>
          </span>
        </Link>
        <nav className="category-nav" aria-label="পণ্যের বিভাগ">
          <Link className={pathname === "/" ? "nav-link active" : "nav-link"} href="/">
            সব পণ্য
          </Link>
          {categories.map((category) => (
            <Link
              className={
                pathname === `/category/${category.slug}`
                  ? "nav-link active"
                  : "nav-link"
              }
              href={`/category/${category.slug}`}
              key={category.id}
            >
              <span>{category.icon}</span> {category.nameBn}
            </Link>
          ))}
        </nav>
        <div className="nav-auth">
          {session?.user ? (
            <>
              <Link className="profile-link" href="/profile">
                <span className="avatar">{session.user.name?.slice(0, 1) || "👤"}</span>
                <span className="profile-name">{session.user.name}</span>
              </Link>
              <button className="button button-outline button-small" onClick={handleSignOut}>
                সাইন আউট
              </button>
            </>
          ) : !isPending ? (
            <>
              <Link className="button button-text button-small" href="/signin">
                সাইন ইন
              </Link>
              <Link className="button button-primary button-small" href="/signup">
                সাইন আপ
              </Link>
            </>
          ) : (
            <span className="nav-auth-placeholder" aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="price-ticker" aria-label="আজকের বাজারদর">
        <div className="ticker-track">
          {[...products, ...products].map((product, index) => (
            <span className="ticker-item" key={`${product.id}-${index}`}>
              <span>{product.image || product.categoryIcon}</span>
              <strong>{product.nameBn}</strong>
              <span>{formatBengaliNumber(product.today)} টাকা</span>
              <span
                className={`ticker-change ${
                  product.change?.dir === "up"
                    ? "change-up"
                    : product.change?.dir === "down"
                      ? "change-down"
                      : "change-flat"
                }`}
              >
                {product.change?.dir === "up"
                  ? "▲"
                  : product.change?.dir === "down"
                    ? "▼"
                    : "—"}{" "}
                {formatBengaliNumber(Math.abs(product.change?.pct || 0))}%
              </span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
