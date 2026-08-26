export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Marketplace &mdash; Capstone E-Commerce Project.</p>
        <p className="mt-1">Built with React, Express, and PostgreSQL.</p>
      </div>
    </footer>
  );
}
