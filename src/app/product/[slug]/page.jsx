"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatBengaliNumber, getProducts, getUnitLabel } from "@/lib/products";

function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProducts()
      .then((products) => {
        if (active) setProduct(products.find((item) => item.slug === slug) || null);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const priceStats = useMemo(() => {
    const markets = product?.markets || [];
    if (!markets.length) {
      const today = Number(product?.today || 0);
      return { min: today, max: today, average: today };
    }

    const min = Math.min(...markets.map((market) => Number(market.min)));
    const max = Math.max(...markets.map((market) => Number(market.max)));
    const average =
      markets.reduce(
        (total, market) => total + (Number(market.min) + Number(market.max)) / 2,
        0,
      ) / markets.length;
    return { min, max, average };
  }, [product]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton skeleton-hero" />
        <div className="loading-grid" style={{ marginTop: 22 }}>
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <section className="empty-state">
          <span className="empty-state-icon">🔎</span>
          <h1>{error ? "পণ্যের তথ্য লোড করা যায়নি" : "পণ্যটি খুঁজে পাওয়া যায়নি"}</h1>
          <p>{error || "এই পণ্যের কোনো তথ্য পাওয়া যায়নি।"}</p>
          <Link className="button button-primary" href="/">
            হোম পেজে ফিরে যান
          </Link>
        </section>
      </div>
    );
  }

  const changeWord =
    product.change?.dir === "up"
      ? "দাম বেড়েছে"
      : product.change?.dir === "down"
        ? "দাম কমেছে"
        : "দাম অপরিবর্তিত";
  const markets = product.markets || [];

  return (
    <div className="page-container">
      <Link className="detail-back" href="/">
        ← সব পণ্যে ফিরে যান
      </Link>
      <div className="detail-summary">
        <section className="detail-product">
          <span className="product-emoji" aria-hidden="true">
            {product.image || product.categoryIcon || "🛍️"}
          </span>
          <div>
            <h1>{product.nameBn}</h1>
            <p>
              আজকের বাজারে {product.nameBn} {changeWord} —{" "}
              {formatBengaliNumber(Math.abs(product.change?.pct || 0))}%।
            </p>
            <div className="detail-tags">
              <span>{product.categoryIcon} {product.categoryNameBn}</span>
              <span>{getUnitLabel(product.unit)}</span>
            </div>
          </div>
        </section>
        <section className="price-summary">
          <h2>আজকের দাম সংক্ষেপে</h2>
          <div className="price-stat-grid">
            <div className="price-stat">
              <span>সর্বনিম্ন</span>
              <strong>{formatBengaliNumber(priceStats.min)} ৳</strong>
            </div>
            <div className="price-stat">
              <span>গড় দাম</span>
              <strong>{formatBengaliNumber(priceStats.average)} ৳</strong>
            </div>
            <div className="price-stat">
              <span>সর্বোচ্চ</span>
              <strong>{formatBengaliNumber(priceStats.max)} ৳</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="market-panel">
        <h2>বাজারভিত্তিক আজকের দাম</h2>
        {markets.length ? (
          <div className="market-table-wrap">
            <table className="market-table">
              <thead>
                <tr>
                  <th>বাজার</th>
                  <th>বিভাগ</th>
                  <th>সর্বনিম্ন দাম</th>
                  <th>সর্বোচ্চ দাম</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((market, index) => (
                  <tr key={`${market.market}-${index}`}>
                    <td>{market.market}</td>
                    <td>{market.division}</td>
                    <td>{formatBengaliNumber(market.min)} টাকা</td>
                    <td>{formatBengaliNumber(market.max)} টাকা</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>এই পণ্যের বাজারভিত্তিক তথ্য এখনো পাওয়া যায়নি।</p>
        )}
      </section>
    </div>
  );
}

export default function ProductPage() {
  return (
    <ProtectedRoute>
      <ProductDetails />
    </ProtectedRoute>
  );
}
