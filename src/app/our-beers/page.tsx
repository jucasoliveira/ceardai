import { beers } from "@/data/beers";
import BeerCard from "@/components/BeerCard";

export default function OurBeers() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Our Beers</h1>
          <div className="w-16 h-px bg-amber mx-auto mb-6"></div>
          <p className="text-charcoal/60 max-w-2xl mx-auto leading-relaxed">
            Three beers, each a canvas for a different expression of craft. Brewed
            in small batches with care and intention.
          </p>
        </div>

        {/* Beer cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beers.map((beer) => (
            <BeerCard key={beer.id} beer={beer} />
          ))}
        </div>
      </div>
    </div>
  );
}
