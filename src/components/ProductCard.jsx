import Link from "next/link";
import {
  formatBengaliNumber,
  getUnitLabel,
} from "@/lib/products";

export default function ProductCard({ product }) {
  const direction = product.change?.dir || "flat";
  const changeIcon =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";
  return (
    <Link
      className="product-card"
      href={`/product/${product.slug}`}
      aria-label={`${product.nameBn} — বিস্তারিত দেখুন`}
    >
      <div className="product-card-top">
        <span className="product-emoji" aria-hidden="true">
          {product.image || product.categoryIcon || "🛍️"}
        </span>
        <span className="category-pill">
          {product.categoryNameBn || "পণ্য"}
        </span>
      </div>
      <h3 className="product-name">{product.nameBn}</h3>
      <p className="product-unit">{getUnitLabel(product.unit)}</p>
      <div className="product-price-row">
        <div>
          <span className="price-label">আজকের দাম</span>
          <strong className="product-price">
            {formatBengaliNumber(product.today)}
            <small>টাকা</small>
          </strong>
        </div>
        <span className={`change-badge change-${direction}`}>
          {changeIcon} {formatBengaliNumber(Math.abs(product.change?.pct || 0))}%
        </span>
      </div>
    </Link>
  );
}
