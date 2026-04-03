import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Sales Consulting, Coaching, Speaking & Training",
  description:
    "Transform your sales organization with consulting, 1-on-1 coaching, keynote speaking, and team training built on the Heartbeat framework.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[var(--color-heartbeat)] font-semibold text-sm uppercase tracking-widest mb-4">
            Services
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Transform How Your Team Sells
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From keynotes that spark change to hands-on engagements that rebuild
            your sales process from the ground up. Every offering is built on
            the Heartbeat framework.
          </p>
        </div>
      </section>

      {/* Speaking */}
      <section id="speaking" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-[var(--color-heartbeat-light)] text-[var(--color-heartbeat)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                Speaking
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Keynotes &amp; Speaking Events
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                An energizing keynote built on the Heartbeat framework. Perfect
                for sales kickoffs, annual conferences, leadership summits, and
                industry events.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Your audience will walk away with a clear, memorable framework
                they can apply immediately — not just motivation, but a system.
              </p>
              <h4 className="font-bold text-gray-900 mb-3">Popular Topics</h4>
              <ul className="space-y-2 mb-8">
                {[
                  "The Six Beats: A Framework for Every Sales Conversation",
                  "Why Your Best Reps Can't Teach What They Do (And How to Fix It)",
                  "The Listening Advantage: Outselling by Outlistening",
                  "Closing Without Pressure: Making It Easy to Say Yes",
                ].map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-2 text-gray-600 text-sm"
                  >
                    <span className="text-[var(--color-heartbeat)] mt-0.5">
                      &#9829;
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact?service=speaking"
                className="inline-block bg-[var(--color-heartbeat)] text-white font-semibold px-8 py-3 rounded-full hover:bg-[var(--color-heartbeat-dark)] transition-colors"
              >
                Book a Speaking Event
              </Link>
            </div>
            <div className="bg-[var(--color-warm)] rounded-2xl p-12 flex items-center justify-center min-h-[350px]">
              <div className="text-center">
                <svg
                  className="w-20 h-20 text-[var(--color-heartbeat)] mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 110-6 3 3 0 010 6z"
                  />
                </svg>
                <p className="text-gray-600 font-medium">
                  Keynotes &amp; Breakout Sessions
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  30 minutes to half-day formats
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consulting */}
      <section id="consulting" className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-white rounded-2xl p-12 flex items-center justify-center min-h-[350px] border border-gray-100">
              <div className="text-center">
                <svg
                  className="w-20 h-20 text-[var(--color-heartbeat)] mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-gray-600 font-medium">
                  Sales Process Audit &amp; Design
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Quarterly or project-based engagements
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="inline-block bg-[var(--color-heartbeat-light)] text-[var(--color-heartbeat)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                Consulting
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sales Consulting
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                I work directly with sales leaders to diagnose what&rsquo;s
                broken, design a repeatable process, and build the systems that
                scale.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Every engagement starts with a deep-dive assessment of your
                current pipeline, win/loss patterns, and team capabilities —
                then we build the playbook together.
              </p>
              <h4 className="font-bold text-gray-900 mb-3">What I Help With</h4>
              <ul className="space-y-2 mb-8">
                {[
                  "Sales process design and optimization",
                  "Pipeline analysis and conversion strategy",
                  "Sales playbook development",
                  "Hiring and onboarding frameworks for new reps",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-gray-600 text-sm"
                  >
                    <span className="text-[var(--color-heartbeat)] mt-0.5">
                      &#9829;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact?service=consulting"
                className="inline-block bg-[var(--color-heartbeat)] text-white font-semibold px-8 py-3 rounded-full hover:bg-[var(--color-heartbeat-dark)] transition-colors"
              >
                Start a Conversation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching */}
      <section id="coaching" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-[var(--color-heartbeat-light)] text-[var(--color-heartbeat)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                Coaching
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                1-on-1 Sales Coaching
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Personalized coaching for individual sales professionals. We
                work together on your real deals, real calls, and real
                challenges.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Whether you&rsquo;re a new rep building your foundation or a
                veteran looking to break through a plateau, coaching accelerates
                growth faster than anything else.
              </p>
              <h4 className="font-bold text-gray-900 mb-3">
                What Coaching Looks Like
              </h4>
              <ul className="space-y-2 mb-8">
                {[
                  "Bi-weekly or monthly 1-on-1 sessions",
                  "Call review and real-time feedback",
                  "Deal strategy and pipeline coaching",
                  "Personalized development plan based on the six beats",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-gray-600 text-sm"
                  >
                    <span className="text-[var(--color-heartbeat)] mt-0.5">
                      &#9829;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact?service=coaching"
                className="inline-block bg-[var(--color-heartbeat)] text-white font-semibold px-8 py-3 rounded-full hover:bg-[var(--color-heartbeat-dark)] transition-colors"
              >
                Apply for Coaching
              </Link>
            </div>
            <div className="bg-[var(--color-warm)] rounded-2xl p-12 flex items-center justify-center min-h-[350px]">
              <div className="text-center">
                <svg
                  className="w-20 h-20 text-[var(--color-heartbeat)] mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-gray-600 font-medium">
                  Personalized Development
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Tailored to your deals and your goals
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training */}
      <section id="training" className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-white rounded-2xl p-12 flex items-center justify-center min-h-[350px] border border-gray-100">
              <div className="text-center">
                <svg
                  className="w-20 h-20 text-[var(--color-heartbeat)] mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-gray-600 font-medium">
                  Workshops &amp; Multi-Session Programs
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Half-day, full-day, or multi-week formats
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="inline-block bg-[var(--color-heartbeat-light)] text-[var(--color-heartbeat)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                Training
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Team &amp; Corporate Training
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Give your entire sales team a common language and a repeatable
                framework. Training programs are customized to your industry,
                your sales cycle, and your team&rsquo;s current skill level.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Every session combines the Heartbeat framework with hands-on
                practice, roleplay, and real-world application so learning
                sticks.
              </p>
              <h4 className="font-bold text-gray-900 mb-3">Program Options</h4>
              <ul className="space-y-2 mb-8">
                {[
                  "Half-day Heartbeat Intensive workshop",
                  "Multi-week sales development program",
                  "New hire onboarding curriculum",
                  "Custom programs for enterprise sales teams",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-gray-600 text-sm"
                  >
                    <span className="text-[var(--color-heartbeat)] mt-0.5">
                      &#9829;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact?service=training"
                className="inline-block bg-[var(--color-heartbeat)] text-white font-semibold px-8 py-3 rounded-full hover:bg-[var(--color-heartbeat-dark)] transition-colors"
              >
                Discuss Training Options
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Not Sure Where to Start?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Let&rsquo;s have a conversation. I&rsquo;ll listen to where you are,
            understand your goals, and recommend the right path forward.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[var(--color-heartbeat)] text-white font-semibold px-10 py-4 rounded-full hover:bg-[var(--color-heartbeat-dark)] transition-colors text-lg"
          >
            Let&rsquo;s Talk
          </Link>
        </div>
      </section>
    </>
  );
}
