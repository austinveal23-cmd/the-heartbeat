import Link from "next/link";

const beats = [
  {
    num: 1,
    name: "Introduction",
    desc: "Establish who you are and earn the right to the conversation.",
  },
  {
    num: 2,
    name: "Rapport",
    desc: "Build genuine human connection beneath the business.",
  },
  {
    num: 3,
    name: "Listen",
    desc: "Your prospect holds the key. Create the conditions for them to hand it to you.",
  },
  {
    num: 4,
    name: "Pain",
    desc: "Surface the problems that truly matter. No pain, no sale.",
  },
  {
    num: 5,
    name: "Pitch",
    desc: "Match your solution to their reality. Outcomes, not features.",
  },
  {
    num: 6,
    name: "Close",
    desc: "The natural conclusion of a well-run conversation. Ask for the business.",
  },
];

const services = [
  {
    title: "Speaking Events",
    desc: "Energize your audience with a keynote built on the Heartbeat framework. Perfect for sales kickoffs, conferences, and leadership summits.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 110-6 3 3 0 010 6z" />
      </svg>
    ),
  },
  {
    title: "Sales Consulting",
    desc: "Diagnose what's broken in your sales process and build a repeatable system that scales. For companies ready to grow.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "1-on-1 Coaching",
    desc: "Personalized coaching for individual sales professionals who want to sharpen their edge and close more deals.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Team Training",
    desc: "Workshops and multi-session programs that give your entire sales team a common language and repeatable framework.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-heartbeat)] to-transparent" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-40">
          <div className="max-w-2xl">
            <p className="text-[var(--color-heartbeat)] font-semibold text-sm uppercase tracking-widest mb-4">
              The Heartbeat Framework
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Every Sale Has a{" "}
              <span className="text-[var(--color-heartbeat)]">Heartbeat</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-xl">
              A six-beat framework that transforms how you sell — from first
              call to close. Not scripts. Not tricks. A repeatable, human
              approach to winning business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="bg-[var(--color-heartbeat)] text-white font-semibold px-8 py-3.5 rounded-full text-center hover:bg-[var(--color-heartbeat-dark)] transition-colors"
              >
                Get the Book
              </Link>
              <Link
                href="/contact"
                className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-full text-center hover:bg-white/10 transition-colors"
              >
                Hire Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-[var(--color-warm)] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote className="text-2xl md:text-3xl font-light text-gray-800 italic leading-relaxed">
            &ldquo;Sales is not something you do <em>to</em> people. It is
            something you do <em>with</em> them.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* The Six Beats */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Six Beats
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Like the waveform of a heartbeat, each phase is essential.
              Skip one and the rhythm breaks down.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beats.map((beat) => (
              <div
                key={beat.num}
                className="group border border-gray-200 rounded-2xl p-7 hover:border-[var(--color-heartbeat)] hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-heartbeat-light)] text-[var(--color-heartbeat)] font-bold text-sm">
                    {beat.num}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">
                    {beat.name}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {beat.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/book"
              className="inline-block text-[var(--color-heartbeat)] font-semibold hover:underline"
            >
              Explore the full framework &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How I Can Help
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Whether you need a keynote that ignites your team or a hands-on
              engagement that transforms your sales process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-[var(--color-heartbeat)] mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-block text-[var(--color-heartbeat)] font-semibold hover:underline"
            >
              View all services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Rhythm?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Whether you want the book, need a speaker for your next event, or
            want to transform your sales team — let&rsquo;s talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-[var(--color-heartbeat)] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[var(--color-heartbeat-dark)] transition-colors"
            >
              Get the Book
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Work With Me
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
