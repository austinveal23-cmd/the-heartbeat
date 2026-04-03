import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Book — The Heartbeat: Anatomy of a Sale",
  description:
    "A field guide for every sales professional. Six beats from first call to close. Get your copy of The Heartbeat.",
};

const chapters = [
  {
    beat: 1,
    title: "Introduction",
    subtitle: "Establish trust before you ask for anything",
    summary:
      "What you do in the first sixty seconds determines whether the rest of the conversation even happens. Learn to demonstrate competence, credibility, and genuine interest — without saying a word about your product.",
  },
  {
    beat: 2,
    title: "Rapport",
    subtitle: "Build the human connection beneath the business",
    summary:
      "People buy from people they like. Real rapport isn't sports talk or weather chat — it's genuine curiosity. Learn matching, mirroring, and the art of the smooth transition from personal to professional.",
  },
  {
    beat: 3,
    title: "Listen",
    subtitle: "Let your prospect tell you how to sell them",
    summary:
      "This is where most salespeople leave the most on the table. Master open-ended questions, silence as a tool, and active listening that makes your prospect feel truly heard.",
  },
  {
    beat: 4,
    title: "Pain",
    subtitle: "Find the problems worth solving",
    summary:
      "No pain, no sale. Learn the pain funnel — from surface-level frustrations to the deep operational and personal impact that drives buying decisions.",
  },
  {
    beat: 5,
    title: "Pitch",
    subtitle: "Match your solution to their reality",
    summary:
      "A pitch built on discovery almost writes itself. Master the Problem-Solution Bridge and learn to pitch outcomes — not features — using your prospect's own words.",
  },
  {
    beat: 6,
    title: "Close",
    subtitle: "Ask for what you've earned",
    summary:
      "The close is not aggressive — it's generous. You're making it easy to say yes. Learn direct, summary, assumptive, and next-step closes for any sales cycle.",
  },
];

export default function BookPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-warm)] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[var(--color-heartbeat)] font-semibold text-sm uppercase tracking-widest mb-4">
                The Book
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                The Heartbeat:{" "}
                <span className="text-[var(--color-heartbeat)]">
                  Anatomy of a Sale
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                A field guide for every sales professional — from first call to
                close.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Whether your sales cycle is twenty minutes or twenty months, the
                same six phases apply. This book gives you a repeatable, human
                framework for winning business — one that works across
                industries, deal sizes, and experience levels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#buy"
                  className="bg-[var(--color-heartbeat)] text-white font-semibold px-8 py-3.5 rounded-full text-center hover:bg-[var(--color-heartbeat-dark)] transition-colors"
                >
                  Order Your Copy
                </a>
                <Link
                  href="/contact"
                  className="border border-gray-300 text-gray-700 font-semibold px-8 py-3.5 rounded-full text-center hover:bg-white transition-colors"
                >
                  Bulk Orders for Teams
                </Link>
              </div>
            </div>

            {/* Book visual */}
            <div className="flex justify-center">
              <div className="w-72 h-96 bg-gray-900 rounded-lg shadow-2xl flex flex-col items-center justify-center text-white p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-heartbeat)]/20 to-transparent" />
                <div className="relative text-center">
                  <span className="text-[var(--color-heartbeat)] text-5xl block mb-4">
                    &#9829;
                  </span>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
                    THE
                  </p>
                  <h2 className="text-3xl font-bold mb-1">HEARTBEAT</h2>
                  <p className="text-sm text-gray-300 italic">
                    Anatomy of a Sale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            What&rsquo;s Inside
          </h2>
          <p className="text-lg text-gray-500 text-center mb-16 max-w-2xl mx-auto">
            Six beats. Six chapters. Each one a complete phase of the sales
            conversation, with practical guidance and exercises.
          </p>
          <div className="space-y-8">
            {chapters.map((ch) => (
              <div
                key={ch.beat}
                className="flex gap-6 items-start group"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-heartbeat-light)] text-[var(--color-heartbeat)] font-bold text-lg group-hover:bg-[var(--color-heartbeat)] group-hover:text-white transition-colors">
                  {ch.beat}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {ch.title}
                  </h3>
                  <p className="text-sm text-[var(--color-heartbeat)] font-medium mb-2">
                    {ch.subtitle}
                  </p>
                  <p className="text-gray-500 leading-relaxed">{ch.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Who This Book Is For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "New to Sales",
                desc: "Get a complete framework from day one instead of learning through painful trial and error.",
              },
              {
                title: "Experienced Reps",
                desc: "Sharpen your edge with a structured approach that turns instinct into repeatable process.",
              },
              {
                title: "Sales Leaders",
                desc: "Give your team a common language. Debrief deals, diagnose problems, and coach with precision.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--color-heartbeat-light)] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[var(--color-heartbeat)] text-xl">
                    &#9829;
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buy CTA */}
      <section id="buy" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Get Your Copy
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            Available now. Transform your approach to sales with the Heartbeat
            framework.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a
              href="#"
              className="bg-[var(--color-heartbeat)] text-white font-semibold px-10 py-4 rounded-full hover:bg-[var(--color-heartbeat-dark)] transition-colors text-lg"
            >
              Buy Now
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            Need copies for your team?{" "}
            <Link
              href="/contact"
              className="text-[var(--color-heartbeat)] hover:underline"
            >
              Contact me for bulk pricing.
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
