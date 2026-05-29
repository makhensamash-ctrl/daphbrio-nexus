import fordLogo from "@/assets/client-ford.png";
import clientTouchLogo from "@/assets/client-client-touch.png";
import homeloanLogo from "@/assets/client-homeloan-approved.png";
import botlhaleLogo from "@/assets/client-botlhale.jpeg";

const clients = [
  { name: "Ford Motor Company", logo: fordLogo },
  { name: "Client Touch", logo: clientTouchLogo },
  { name: "HomeLoan Approved", logo: homeloanLogo },
  { name: "Botlhale ke Bokamoso Accounting", logo: botlhaleLogo },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground text-center">
          Trusted by leading enterprises across South Africa
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 items-center">
          {clients.map((c) => (
            <div key={c.name} className="flex items-center justify-center">
              <img
                src={c.logo}
                alt={`${c.name} logo`}
                loading="lazy"
                className="max-h-16 w-auto object-contain opacity-80 hover:opacity-100 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
