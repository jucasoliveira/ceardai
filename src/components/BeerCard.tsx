import Link from "next/link";
import { Beer } from "@/data/beers";

export default function BeerCard({ beer }: { beer: Beer }) {
  return (
    <Link href={`/our-beers/${beer.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-exhibit hover:shadow-exhibit-hover transition-all duration-300">
        {/* Artwork: prominent color block */}
        <div
          className="h-64 flex items-center justify-center"
          style={{ backgroundColor: beer.color + "15" }}
        >
          <div
            className="w-20 h-32 rounded-sm transition-transform duration-300 group-hover:scale-105 shadow-md"
            style={{ backgroundColor: beer.color }}
          />
        </div>

        <div className="p-8">
          <h3 className="font-serif text-2xl mb-2 group-hover:text-amber transition-colors">
            {beer.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-charcoal/60 mb-4">
            <span className="uppercase tracking-wider text-xs">
              {beer.style}
            </span>
            <span className="text-charcoal/20">|</span>
            <span className="font-mono text-xs">{beer.abv} ABV</span>
          </div>

          <p className="text-charcoal/70 text-sm leading-relaxed mb-6">
            {beer.description}
          </p>

          <div className="border-t border-charcoal/10 pt-5 space-y-4">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-1">
                Tasting Notes
              </h4>
              <p className="text-sm text-charcoal/70">{beer.tastingNotes}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-1">
                Food Pairing
              </h4>
              <p className="text-sm text-charcoal/70">{beer.foodPairing}</p>
            </div>
          </div>

          {/* View exhibit prompt */}
          <div className="mt-6 text-xs uppercase tracking-widest text-charcoal/40 group-hover:text-amber transition-colors">
            View Exhibit &rarr;
          </div>
        </div>
      </div>
    </Link>
  );
}
