import { notFound } from "next/navigation";
import Link from "next/link";
import { beers } from "@/data/beers";

interface BeerPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return beers.map((beer) => ({ id: beer.id }));
}

export async function generateMetadata({ params }: BeerPageProps) {
  const { id } = await params;
  const beer = beers.find((b) => b.id === id);
  if (!beer) return { title: "Beer Not Found" };
  return {
    title: `${beer.name} — Ceardai`,
    description: beer.description,
  };
}

export default async function BeerPage({ params }: BeerPageProps) {
  const { id } = await params;
  const beer = beers.find((b) => b.id === id);

  if (!beer) {
    notFound();
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/our-beers"
          className="inline-flex items-center text-sm uppercase tracking-widest text-charcoal/50 hover:text-charcoal transition-colors mb-12"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Our Beers
        </Link>

        {/* Artwork: large color block */}
        <div className="bg-white rounded-lg shadow-exhibit overflow-hidden mb-12">
          <div
            className="h-72 md:h-96 flex items-center justify-center"
            style={{ backgroundColor: beer.color + "15" }}
          >
            <div
              className="w-28 h-40 md:w-36 md:h-52 rounded-sm shadow-lg"
              style={{ backgroundColor: beer.color }}
            />
          </div>
        </div>

        {/* Beer details */}
        <div className="max-w-2xl mx-auto">
          {/* Title and meta */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              {beer.name}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-charcoal/60">
              <span className="uppercase tracking-widest">{beer.style}</span>
              <span className="text-charcoal/20">|</span>
              <span className="font-mono text-xs tracking-wider">
                {beer.abv} ABV
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-amber mx-auto mb-12" />

          {/* Description */}
          <p className="text-lg leading-relaxed text-charcoal/80 text-center mb-16">
            {beer.description}
          </p>

          {/* Tasting Notes and Food Pairing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-lg p-8 shadow-exhibit">
              <h2 className="text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-4">
                Tasting Notes
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                {beer.tastingNotes}
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-exhibit">
              <h2 className="text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-4">
                Food Pairing
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                {beer.foodPairing}
              </p>
            </div>
          </div>

          {/* Bottom back link */}
          <div className="text-center pt-8 border-t border-charcoal/10">
            <Link
              href="/our-beers"
              className="text-sm uppercase tracking-widest text-charcoal/50 hover:text-charcoal transition-colors"
            >
              View All Exhibits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
