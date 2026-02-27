export default function OurStory() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Our Story</h1>
          <div className="w-16 h-px bg-amber mx-auto"></div>
        </div>

        {/* The Name */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-4">The Name</h2>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            <em>Ceardaí</em> is the Irish word for a workshop or forge — a place
            where artisans shape raw material into something meaningful through
            skill, patience, and intention. It shares its root with{" "}
            <em>ceardaíocht</em>, the art of craftsmanship itself.
          </p>
          <p className="text-charcoal/70 leading-relaxed">
            We chose this name because it captures what we believe brewing should
            be: a craft practised with care, not a product manufactured at scale.
            Every batch that leaves our brewery has been shaped by hand, guided by
            tradition, and made with the kind of attention that only small-scale
            brewing allows.
          </p>
        </section>

        {/* Origin */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-4">Origins</h2>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            Ceardaí was born from a simple conviction: the best beer comes from
            brewers who have time. Time to source the right ingredients. Time to let
            fermentation happen at its own pace. Time to sit with a batch and decide
            whether it truly meets the standard.
          </p>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            Nestled in the landscape of Connemara, our brewery draws inspiration
            from the monastic brewing traditions of Europe — particularly the
            Trappist approach, where beer is brewed to sustain community, not to
            maximise profit. We are not monks, but we share their belief that craft
            is a form of devotion.
          </p>
          <p className="text-charcoal/70 leading-relaxed">
            As a nano brewery, we produce in very small quantities. This is by
            design. It means we can focus entirely on quality, experiment freely,
            and maintain a direct relationship with every person who drinks our
            beer.
          </p>
        </section>

        {/* Philosophy */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-4">Philosophy</h2>
          <blockquote className="border-l-2 border-amber pl-6 my-8">
            <p className="font-serif text-xl text-charcoal/80 italic">
              &ldquo;We craft to share. We do not share to craft.&rdquo;
            </p>
          </blockquote>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            This distinction matters to us. We don&apos;t brew because there&apos;s
            a market for it. We brew because the act of creating something honest
            and well-made is worthwhile in itself. The sharing comes naturally —
            good beer finds its people.
          </p>
          <p className="text-charcoal/70 leading-relaxed">
            We sell on a calendar basis, in scheduled windows, much like the
            Trappist breweries we admire. One order per person. No rush, no
            pressure. If a beer is available, you&apos;ll know. If it isn&apos;t,
            another sale will come.
          </p>
        </section>

        {/* The Canvas Concept */}
        <section>
          <h2 className="font-serif text-2xl mb-4">The Canvas</h2>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            Every beer we make carries the name &ldquo;Canvas&rdquo; — because
            that&apos;s how we think about each recipe. A canvas is a starting
            point, a space where ingredients, technique, and time come together to
            create something unique.
          </p>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            <strong>Bourbon Canvas</strong> is our darkest and most complex — aged
            in bourbon barrels, painted in layers of vanilla and oak.{" "}
            <strong>Moonlight Canvas</strong> is our lightest — a crisp witbier
            sketched in citrus and coriander.{" "}
            <strong>Crimson Canvas</strong> sits between them — an Irish red ale
            drawn in toffee and malt.
          </p>
          <p className="text-charcoal/70 leading-relaxed">
            Three canvases. Three expressions of what beer can be when you give it
            the time and space it deserves.
          </p>
        </section>
      </div>
    </div>
  );
}
