import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10 text-center">
        <p className="text-5xl font-extrabold text-slate-200">404</p>
        <h1 className="mt-2 text-xl font-extrabold text-slate-900">Page not found</h1>
        <p className="mt-1 text-xs text-slate-500">The link may be mistyped or the page may have moved.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-700"
          >
            Public website
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
