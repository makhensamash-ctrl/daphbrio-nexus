import fordLogo from "@/assets/client-ford.png";
import clientTouchLogo from "@/assets/client-client-touch.png";
import homeloanLogo from "@/assets/client-homeloan-approved.png";
import botlhaleLogo from "@/assets/client-botlhale.jpeg";

const clients = [
  { name: "Ford Motor Company", logo: fordLogo },
  { name: "Client Touch", logo: clientTouchLogo, href: "https://www.client-touch.co.za" },
  { name: "HomeLoan Approved", logo: homeloanLogo, href: "https://www.bondapproved.co.za" },
  { name: "Botlhale ke Bokamoso Accounting", logo: botlhaleLogo },
];

function ClientLogo({ client }: { client: typeof clients[number] }) {
  const image = (
    <img
      src={client.logo}
      alt={`${client.name} logo`}
      loading="lazy"
      className="max-h-14 w-auto object-contain opacity-80"
    />
  );
  if (client.href) {
    return (
      <a
        href={client.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center hover:opacity-100 transition"
      >
        {image}
      </a>
    );
  }
  return image;
}

function ClientLogoDesktop({ client }: { client: typeof clients[number] }) {
  const image = (
    <img
      src={client.logo}
      alt={`${client.name} logo`}
      loading="lazy"
      className="max-h-16 w-auto object-contain opacity-80 hover:opacity-100 transition"
    />
  );
  if (client.href) {
    return (
      <a
        href={client.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center"
      >
        {image}
      </a>
    );
  }
  return image;
}

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground text-center">
          Trusted by leading enterprises across South Africa
        </p>

        {/* Mobile: horizontal scrolling marquee */}
        <div className="mt-6 sm:hidden overflow-hidden">
          <div className="marquee-track">
            {[...clients, ...clients].map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                className="flex-shrink-0 flex items-center justify-center px-6"
              >
                <ClientLogo client={c} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="mt-6 hidden sm:grid sm:grid-cols-4 gap-x-8 gap-y-6 items-center">
          {clients.map((c) => (
            <div key={c.name} className="flex items-center justify-center">
              <ClientLogoDesktop client={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
