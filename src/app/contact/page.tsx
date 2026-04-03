"use client";

import { useState } from "react";

const serviceOptions = [
  "Speaking Event / Keynote",
  "Sales Consulting",
  "1-on-1 Coaching",
  "Team / Corporate Training",
  "Bulk Book Order",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-warm)] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[var(--color-heartbeat)] font-semibold text-sm uppercase tracking-widest mb-4">
            Work With Me
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Let&rsquo;s Start a Conversation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Whether you need a keynote speaker, a sales consultant, a coach, or
            a training partner — it all starts with a conversation. Tell me
            what you&rsquo;re working on and I&rsquo;ll get back to you
            within 24 hours.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6">
          {submitted ? (
            <div className="text-center py-16">
              <span className="text-[var(--color-heartbeat)] text-5xl block mb-6">
                &#9829;
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Message Received
              </h2>
              <p className="text-gray-500 text-lg">
                Thank you for reaching out. I&rsquo;ll be in touch within 24
                hours. In the meantime, check out{" "}
                <a
                  href="/book"
                  className="text-[var(--color-heartbeat)] hover:underline"
                >
                  the book
                </a>{" "}
                to learn more about the Heartbeat framework.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-heartbeat)] focus:border-transparent outline-none transition"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-heartbeat)] focus:border-transparent outline-none transition"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-heartbeat)] focus:border-transparent outline-none transition"
                  placeholder="jane@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Company / Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-heartbeat)] focus:border-transparent outline-none transition"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  What are you interested in?
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-heartbeat)] focus:border-transparent outline-none transition bg-white"
                >
                  <option value="">Select an option</option>
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Tell me more
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-heartbeat)] focus:border-transparent outline-none transition resize-none"
                  placeholder="What are you working on? What challenges are you facing? What does success look like?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--color-heartbeat)] text-white font-semibold py-3.5 rounded-full hover:bg-[var(--color-heartbeat-dark)] transition-colors text-sm"
              >
                Send Message
              </button>

              <p className="text-xs text-gray-400 text-center">
                I respond to every inquiry personally within 24 hours.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Quick Contact */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Speaking Events</h3>
              <p className="text-gray-500 text-sm">
                Booking keynotes for your conference, kickoff, or leadership
                event.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Consulting &amp; Training
              </h3>
              <p className="text-gray-500 text-sm">
                For companies and teams looking to build a repeatable sales
                process.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Coaching</h3>
              <p className="text-gray-500 text-sm">
                For individual sales professionals ready to level up.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
