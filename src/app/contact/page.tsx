import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Contact</h1>
          <div className="w-16 h-px bg-amber mx-auto mb-6"></div>
          <p className="text-charcoal/60 max-w-2xl mx-auto leading-relaxed">
            Have a question about our beers, sales, or brewery? We&apos;d love to
            hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl mb-6">Send a Message</h2>
            <ContactForm />
          </div>

          {/* Info */}
          <div>
            <h2 className="font-serif text-2xl mb-6">Find Us</h2>

            <div className="space-y-6 text-sm text-charcoal/70">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                  Address
                </h3>
                <p>Ceardaí Brewery</p>
                <p>The Old Mill</p>
                <p>Connemara, Co. Galway</p>
                <p>Ireland</p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                  Email
                </h3>
                <a
                  href="mailto:hello@ceardai.ie"
                  className="text-amber hover:underline"
                >
                  hello@ceardai.ie
                </a>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                  Brewery Visits
                </h3>
                <p>
                  We welcome visitors by appointment. Please get in touch to
                  arrange a visit and tasting.
                </p>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 h-64 bg-charcoal/5 rounded-lg flex items-center justify-center border border-charcoal/10">
              <div className="text-center text-charcoal/40">
                <svg
                  className="w-8 h-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm">Map placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
