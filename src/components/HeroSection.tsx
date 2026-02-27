export default function HeroSection() {
  return (
    <section className="relative bg-charcoal text-cream py-32 px-4">
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight">
          Ceardaí
        </h1>
        <p className="font-serif text-xl md:text-2xl text-cream/80 italic mb-8">
          &ldquo;We craft to share. We do not share to craft.&rdquo;
        </p>
        <div className="w-16 h-px bg-amber mx-auto mb-8"></div>
        <p className="text-cream/60 max-w-2xl mx-auto leading-relaxed">
          A nano brewery rooted in tradition, guided by craft. Each batch is small,
          each beer is intentional. From the west of Ireland, we brew with patience
          and purpose.
        </p>
      </div>
    </section>
  );
}
