import Link from "next/link";
import HeroSection from "@/components/HeroSection";

const pillars = [
  {
    title: "Our Story",
    description:
      "From the meaning behind our name to the philosophy that guides every brew. Discover why we chose the path of the artisan.",
    href: "/our-story",
  },
  {
    title: "The Craft",
    description:
      "Three beers, each a canvas. Bourbon-aged complexity, Belgian lightness, and Irish red tradition — brewed with patience.",
    href: "/our-beers",
  },
  {
    title: "Beer Sales",
    description:
      "We sell in scheduled windows, one order at a time. Check the calendar for upcoming sales and secure your crate.",
    href: "/beer-sales",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Philosophy section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            Brewed with purpose
          </h2>
          <p className="text-charcoal/70 leading-relaxed text-lg">
            Ceardaí — from the Gaelic for &ldquo;artisan&rdquo; — is a nano brewery
            in the west of Ireland. We believe that great beer cannot be rushed or
            scaled. Every batch is small, every ingredient is chosen with care, and
            every bottle is a reflection of the craft we love. We don&apos;t brew to
            fill shelves. We brew because it matters.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className="group p-8 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-serif text-2xl mb-3 group-hover:text-amber transition-colors">
                {pillar.title}
              </h3>
              <p className="text-charcoal/60 text-sm leading-relaxed">
                {pillar.description}
              </p>
              <span className="inline-block mt-4 text-sm text-amber uppercase tracking-widest">
                Learn more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
