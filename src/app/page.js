"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { formatBengaliNumber, getProducts } from "@/lib/products";

function ProductSection({ title, subtitle, products, href }) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        </div>
        {href ? (
          <Link className="section-link" href={href}>
            সব দেখুন →
          </Link>
        ) : null}
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function LoadingGrid({ count = 8 }) {
  return (
    <div className="loading-grid" aria-label="পণ্য লোড হচ্ছে">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton" key={index} />
      ))}
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const { risers, fallers } = useMemo(() => {
    const changes = products.filter((product) => Number(product.change?.pct));
    return {
      risers: [...changes]
        .filter((product) => product.change.dir === "up")
        .sort((a, b) => b.change.pct - a.change.pct)
        .slice(0, 6),
      fallers: [...changes]
        .filter((product) => product.change.dir === "down")
        .sort((a, b) => a.change.pct - b.change.pct)
        .slice(0, 6),
    };
  }, [products]);

  return (
    <div className="page-container">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            প্রতিদিনের বাজার, থাকুক আপনার হাতের মুঠোয়
          </span>
          <h1>
            বাজারের সঠিক দাম, <span>সিদ্ধান্ত হোক সহজ</span>
          </h1>
          <p>
            চাল, ডাল, মাছ, মাংস থেকে নিত্যপ্রয়োজনীয় সব পণ্যের হালনাগাদ দাম
            দেখুন এক জায়গায়।
          </p>
          <a className="button button-primary" href="#সব-পণ্য">
            আজকের বাজারদর দেখুন <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="hero-art">
          <Image
            src="/bazar-hero.png"
            alt="তাজা বাজারের পণ্যে ভরা ঝুড়ি"
            width={300}
            height={274}
            priority
          />
          <div className="hero-badge">
            আজকের বাজারদর
            <strong>
              {loading ? "•••" : `${formatBengaliNumber(products.length)} পণ্য`}
            </strong>
          </div>
        </div>
      </section>

      {error ? (
        <section className="empty-state" aria-live="polite">
          <span className="empty-state-icon">⚠️</span>
          <h2>বাজারদর আনা যায়নি</h2>
          <p>{error}</p>
          <button
            className="button button-primary"
            onClick={() => window.location.reload()}
          >
            আবার চেষ্টা করুন
          </button>
        </section>
      ) : loading ? (
        <>
          <section className="section-block">
            <div className="section-heading">
              <div>
                <h2 className="section-title">আজকের বাজারের পরিবর্তন</h2>
                <p className="section-subtitle">সর্বশেষ দাম লোড হচ্ছে…</p>
              </div>
            </div>
            <LoadingGrid count={4} />
          </section>
          <section className="section-block" id="সব-পণ্য">
            <h2 className="section-title">সব পণ্য</h2>
            <p className="section-subtitle">নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম</p>
            <div style={{ marginTop: 22 }}>
              <LoadingGrid />
            </div>
          </section>
        </>
      ) : (
        <>
          <ProductSection
            title="আজ দাম বেড়েছে ▲"
            subtitle="যে পণ্যগুলোর দাম গত দিনের তুলনায় বেড়েছে"
            products={risers}
          />
          <ProductSection
            title="আজ দাম কমেছে ▼"
            subtitle="যে পণ্যগুলোর দাম গত দিনের তুলনায় কমেছে"
            products={fallers}
          />
          <section className="section-block" id="সব-পণ্য">
            <div className="section-heading">
              <div>
                <h2 className="section-title">সব পণ্য</h2>
                <p className="section-subtitle">
                  নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম এক নজরে
                </p>
              </div>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
