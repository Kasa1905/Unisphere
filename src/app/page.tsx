export default function HomePage() {
  return (
    <main className="container py-12">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Unisphere</h1>
          <p className="mt-1 text-slate-600">College discovery & admissions intelligence</p>
        </div>
        <nav className="text-sm text-slate-700">
          <a href="/api/colleges" className="mr-4 hover:underline">API: /api/colleges</a>
          <a href="/api/predict" className="hover:underline">API: /api/predict</a>
        </nav>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-2">Search & Filter</h2>
          <p className="text-sm text-slate-600">Search colleges by name, city, or category. API supports pagination, filtering and sorting.</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-2">Predictive Matches</h2>
          <p className="text-sm text-slate-600">Post your exam & rank to get banded suggestions (safe/target/reach) from `POST /api/predict`.</p>
        </div>
      </section>
    </main>
  );
}
