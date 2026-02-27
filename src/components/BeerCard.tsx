import { Beer } from "@/data/beers";

export default function BeerCard({ beer }: { beer: Beer }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Placeholder image area */}
      <div
        className="h-48 flex items-center justify-center"
        style={{ backgroundColor: beer.color + "20" }}
      >
        <div
          className="w-16 h-24 rounded-sm"
          style={{ backgroundColor: beer.color }}
        ></div>
      </div>

      <div className="p-6">
        <h3 className="font-serif text-2xl mb-1">{beer.name}</h3>
        <div className="flex items-center gap-3 text-sm text-charcoal/60 mb-4">
          <span>{beer.style}</span>
          <span className="text-charcoal/30">|</span>
          <span className="font-medium">{beer.abv} ABV</span>
        </div>

        <p className="text-charcoal/70 text-sm leading-relaxed mb-4">
          {beer.description}
        </p>

        <div className="border-t border-charcoal/10 pt-4 space-y-3">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-charcoal/50 mb-1">
              Tasting Notes
            </h4>
            <p className="text-sm text-charcoal/70">{beer.tastingNotes}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-charcoal/50 mb-1">
              Food Pairing
            </h4>
            <p className="text-sm text-charcoal/70">{beer.foodPairing}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
