"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/products";

function LoadingGrid() {
  return (
    <div className="loading-grid" aria-label="পণ্য লোড হচ্ছে">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="skeleton" key={index} />
      ))}
    </div>
  );
}

function EmptyCategory({ title = "এই বিভাগে কোনো পণ্য পাওয়া যায়নি" }) {
  return (
    <section className="empty-state">
      <span className="empty-state-icon">🧺</span>
      <h1>{title}</h1>
      <p>অন্য পণ্যের দাম দেখতে হোম পেজে ফিরে যান।</p>
      <Link className="button button-primary" href="/">
        হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    Promise.all([getCategories(), getProducts(slug)])
      .then(([categories, categoryProducts]) => {
        if (!active) return;
        const foundCategory = categories.find((item) => item.slug === slug);
        setCategory(foundCategory || null);
        setProducts(categoryProducts);
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

  const sortedProducts = useMemo(() => {
    if (sort === "default") return products;
    return [...products].sort((a, b) =>
      sort === "asc"
        ? Number(a.today) - Number(b.today)
        : Number(b.today) - Number(a.today),
    );
  }, [products, sort]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-heading">
          <div>
            <h1>বাজারদর লোড হচ্ছে…</h1>
            <p>একটু অপেক্ষা করুন</p>
          </div>
        </div>
        <LoadingGrid />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <EmptyCategory title="বাজারদর লোড করা যায়নি" />
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!category || products.length === 0) {
    return (
      <div className="page-container">
        <EmptyCategory
          title={category ? "এই বিভাগে কোনো পণ্য পাওয়া যায়নি" : "বিভাগটি খুঁজে পাওয়া যায়নি"}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h1>
            <span aria-hidden="true">{category.icon}</span> {category.nameBn}
          </h1>
          <p>এই বিভাগের {products.length}টি পণ্যের আজকের বাজারদর</p>
        </div>
        <label className="sort-control">
          সাজান
          <select
            aria-label="পণ্যের দাম অনুযায়ী সাজান"
            onChange={(event) => setSort(event.target.value)}
            value={sort}
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>
      <div className="product-grid">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
