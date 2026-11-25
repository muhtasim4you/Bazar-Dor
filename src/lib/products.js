const API_BASE_URL =
  process.env.NEXT_PUBLIC_BAZARDOR_API_URL ||
  "https://openapi.programming-hero.com/api/bazardor";

export const unitLabels = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
};

export function formatBengaliNumber(value) {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 1 }).format(
    Number(value) || 0,
  );
}

export function getUnitLabel(unit) {
  return unitLabels[unit] || `প্রতি ${unit || "একক"}`;
}

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`পণ্যের তথ্য লোড করা যায়নি (${response.status})`);
  }
  return response.json();
}

export function getProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return getJson(`/products${query}`);
}

export function getCategories() {
  return getJson("/categories");
}
