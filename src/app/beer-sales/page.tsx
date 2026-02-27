import Link from "next/link";
import SalesCalendar from "@/components/SalesCalendar";
import { pricing } from "@/data/sales-calendar";

export default function BeerSales() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Beer Sales</h1>
          <div className="w-16 h-px bg-amber mx-auto mb-6"></div>
          <p className="text-charcoal/60 max-w-2xl mx-auto leading-relaxed">
            We sell our beer in scheduled windows. Check the calendar below for
            upcoming sales, and place your order during the sale window.
          </p>
        </div>

        {/* Calendar */}
        <section className="mb-16 bg-cream p-6 rounded-lg border border-charcoal/5">
          <h2 className="font-serif text-2xl mb-6">Sales Calendar</h2>
          <SalesCalendar />
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6">Pricing</h2>
          <div className="bg-white rounded-lg overflow-hidden border border-charcoal/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-charcoal/50">
                    Item
                  </th>
                  <th className="text-right px-6 py-4 text-xs uppercase tracking-widest text-charcoal/50">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((row, i) => (
                  <tr
                    key={row.item}
                    className={
                      i < pricing.length - 1 ? "border-b border-charcoal/5" : ""
                    }
                  >
                    <td className="px-6 py-4 text-sm">{row.item}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium">
                      {row.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Rules */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6">How It Works</h2>
          <div className="space-y-4 text-charcoal/70 text-sm leading-relaxed">
            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-charcoal text-cream rounded-full flex items-center justify-center text-xs font-medium">
                1
              </span>
              <p>
                <strong>Check the calendar</strong> — Sale dates are published in
                advance. Each sale features one or more of our beers, available
                during a set time window.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-charcoal text-cream rounded-full flex items-center justify-center text-xs font-medium">
                2
              </span>
              <p>
                <strong>Place your order</strong> — During the sale window, log in
                and select your beer and quantity. One order per person per sale.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-charcoal text-cream rounded-full flex items-center justify-center text-xs font-medium">
                3
              </span>
              <p>
                <strong>Collect or receive</strong> — Orders can be collected from
                the brewery during designated pickup times, or delivered within
                Ireland for an additional fee.
              </p>
            </div>
          </div>
        </section>

        {/* Registration CTA */}
        <section className="text-center bg-charcoal text-cream rounded-lg p-8">
          <h3 className="font-serif text-xl mb-3">
            Register for Sale Notifications
          </h3>
          <p className="text-cream/60 text-sm mb-6 max-w-md mx-auto">
            Create an account to receive notifications when new sales are
            scheduled, and to place orders during sale windows.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-amber text-white px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-amber/90 transition-colors"
          >
            Get in Touch
          </Link>
        </section>
      </div>
    </div>
  );
}
