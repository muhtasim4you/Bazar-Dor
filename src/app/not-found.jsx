import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container">
      <section className="empty-state">
        <span className="empty-state-icon">🔎</span>
        <h1>পাতাটি খুঁজে পাওয়া যায়নি</h1>
        <p>ঠিকানাটি পরীক্ষা করুন, অথবা হোম পেজে ফিরে যান।</p>
        <Link className="button button-primary" href="/">
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </div>
  );
}
