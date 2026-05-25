const clients = [
  "FORD MOTOR COMPANY",
  "ELEGEN CARGO TRADING",
  "KHULIO",
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground text-center">
          Trusted by leading enterprises across South Africa
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-5 items-center">
          {clients.map((c) => (
            <div
              key={c}
              className="font-display text-xs sm:text-sm font-semibold tracking-[0.15em] text-foreground/60 text-center"
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
