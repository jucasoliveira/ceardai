import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl text-cream mb-3">Ceardaí</h3>
            <p className="text-sm leading-relaxed">
              Artisan nano brewery. We craft to share.
              <br />
              Small batches, honestly brewed.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-cream text-sm uppercase tracking-widest mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/our-story" className="hover:text-amber transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/our-beers" className="hover:text-amber transition-colors">
                  Our Beers
                </Link>
              </li>
              <li>
                <Link href="/beer-sales" className="hover:text-amber transition-colors">
                  Beer Sales
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream text-sm uppercase tracking-widest mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Ceardaí Brewery</li>
              <li>The Old Mill, Connemara</li>
              <li>Co. Galway, Ireland</li>
              <li className="pt-2">
                <a
                  href="mailto:hello@ceardai.ie"
                  className="hover:text-amber transition-colors"
                >
                  hello@ceardai.ie
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-8 pt-8 text-center text-xs text-cream/40">
          &copy; {new Date().getFullYear()} Ceardaí Brewery. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
