import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Upload your song",
    desc: "Drop any WAV or FLAC file. We handle the rest.",
  },
  {
    num: "02",
    title: "AI separates stems",
    desc: "Vocals, drums, bass, and instruments split in seconds — right in your browser.",
  },
  {
    num: "03",
    title: "See it in 3D",
    desc: "Each stem gets a position in 3D space. Rotate, explore, find the problems.",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["3 song analyses", "3D visualization", "Basic overview"],
    cta: "Start free",
    href: "/login",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/ month",
    features: [
      "Unlimited analyses",
      "Timeline graphs",
      "AI mix prescription",
      "Track comparison",
      "DAW export",
    ],
    cta: "Get Pro",
    href: "/login",
    highlight: true,
  },
  {
    name: "Studio",
    price: "$99",
    period: "one-time",
    features: [
      "Pro features, forever",
      "Priority processing",
      "Beta access",
    ],
    cta: "Get Studio",
    href: "/login",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-lg text-text-primary">
            Mix<span className="text-accent-purple">Space</span>
          </span>
          <nav className="flex items-center gap-6">
            <Link href="#pricing" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
              Pricing
            </Link>
            <Link
              href="/login"
              className="px-4 py-1.5 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="px-4 py-1.5 bg-accent-purple hover:bg-purple-500 rounded-lg text-sm text-white font-medium transition-colors"
            >
              Try free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-purple/10 border border-accent-purple/20 rounded-full text-accent-purple text-xs font-medium mb-6">
            3 free analyses — no credit card
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-text-primary leading-tight tracking-tight">
            See your mix<br />
            <span className="text-accent-cyan">in 3D</span>
          </h1>
          <p className="mt-6 text-xl text-text-secondary leading-relaxed max-w-lg">
            Upload any song. Watch it explode into a 3D space. Find what&apos;s masking, what&apos;s flat, what&apos;s missing.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-accent-purple hover:bg-purple-500 rounded-xl text-white font-semibold transition-colors"
            >
              Try free →
            </Link>
            <span className="text-text-muted text-sm">3 songs free, forever</span>
          </div>
        </div>

        {/* 3D Demo placeholder */}
        <div className="relative aspect-square rounded-2xl bg-bg-secondary border border-border overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-radial from-accent-purple/5 to-transparent" />
          <div className="relative flex items-center justify-center gap-8">
            {[
              { color: "#00d4ff", size: 64, label: "Vocals", x: 0, y: -30 },
              { color: "#ff4060", size: 56, label: "Drums", x: -40, y: 20 },
              { color: "#ffd060", size: 72, label: "Bass", x: 40, y: 30 },
              { color: "#60ff90", size: 48, label: "Other", x: -10, y: 10 },
            ].map((stem) => (
              <div
                key={stem.label}
                className="absolute flex flex-col items-center gap-2"
                style={{ transform: `translate(${stem.x}px, ${stem.y}px)` }}
              >
                <div
                  className="rounded-full opacity-80"
                  style={{
                    width: stem.size,
                    height: stem.size,
                    background: stem.color,
                    boxShadow: `0 0 ${stem.size}px ${stem.color}60`,
                  }}
                />
                <span className="text-xs text-text-muted">{stem.label}</span>
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-text-muted text-xs">
            Interactive 3D — coming soon
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-16">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-bg-secondary border border-border rounded-xl p-6">
              <div className="text-accent-purple font-mono text-sm font-bold mb-3">{step.num}</div>
              <h3 className="text-text-primary font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-4">Pricing</h2>
        <p className="text-text-secondary text-center mb-16">Start free. Upgrade when you need more.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-accent-purple bg-accent-purple/5"
                  : "border-border bg-bg-secondary"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-medium text-accent-purple mb-3">MOST POPULAR</div>
              )}
              <h3 className="text-text-primary font-bold text-xl">{plan.name}</h3>
              <div className="mt-2 mb-6">
                <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                <span className="text-text-muted text-sm ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="text-accent-green">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "bg-accent-purple hover:bg-purple-500 text-white"
                    : "border border-border hover:border-text-muted text-text-secondary hover:text-text-primary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-text-muted text-sm">
        <p>MixSpace © 2026 — See your music differently</p>
      </footer>
    </div>
  );
}
