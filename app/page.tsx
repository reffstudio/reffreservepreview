import { AccessForm } from "@/components/access-form"
import { BackgroundTicker } from "@/components/background-ticker"

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-between px-6 pt-12 pb-16 md:px-10 md:pt-16 md:pb-20">
        <BackgroundTicker />

        {/* Top: Logo */}
        <img
          src="/reff-reserve-logo.png"
          alt="REFF RESERVE"
          className="relative z-10 h-20 w-auto sm:h-24 md:h-28 lg:h-32"
        />

        {/* Middle: Tagline + description */}
        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center py-12 text-center">
          <h1 className="whitespace-nowrap text-2xl font-bold tracking-tighter text-foreground sm:text-3xl md:text-[2.75rem] lg:text-5xl">
            INVITE // EVOKE // ORCHESTRATE
          </h1>

          <p className="mt-10 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            We are developing REFF RESERVE. A high-end software ecosystem engineered to transform how
            premium weddings and private galas manage their inner circle. From seamless digital
            invitations to flawless guest validation and door control, we handle the protocol. No
            generic templates. No loose ends. Just ironclad system precision from the first
            confirmation to the final scan.
          </p>
        </div>

        {/* Bottom: Action */}
        <div className="relative z-10 flex w-full justify-center">
          <AccessForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center gap-2 bg-primary px-6 py-5 text-center text-primary-foreground md:flex-row md:justify-between md:px-10 md:text-left">
        <span className="font-mono text-[11px] tracking-[0.15em] uppercase">
          © 2026 REFF RESERVE
        </span>
        <span className="font-mono text-[11px] tracking-[0.15em] uppercase">
          Powered by{" "}
          <a
            href="https://www.reff.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            REFF STUDIO
          </a>
        </span>
      </footer>
    </main>
  )
}
