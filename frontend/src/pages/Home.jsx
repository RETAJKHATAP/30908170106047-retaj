import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Everything you need, one marketplace</h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Browse thousands of curated products, track your orders, and enjoy a shopping
            experience built for speed and simplicity.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Start shopping <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-3">
        <Feature icon={<Truck size={22} />} title="Fast shipping" desc="Free delivery on orders over $100." />
        <Feature icon={<ShieldCheck size={22} />} title="Secure checkout" desc="Your data is protected end to end." />
        <Feature icon={<RotateCcw size={22} />} title="Easy returns" desc="30-day hassle-free return policy." />
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="card flex flex-col items-start gap-2 p-6">
      <div className="rounded-lg bg-brand-50 p-2 text-brand-600">{icon}</div>
      <h3 className="font-display font-semibold">{title}</h3>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );
}
