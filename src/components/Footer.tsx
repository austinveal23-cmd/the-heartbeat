import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--color-heartbeat)] text-2xl">
                &#9829;
              </span>
              <span className="font-bold text-lg text-white">
                The Heartbeat
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              A field guide for every sales professional — from first call to
              close. Sales consulting, coaching, speaking, and training built on
              the six-beat framework.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Navigate
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="hover:text-white transition-colors"
                >
                  The Book
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Work With Me
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/services#consulting"
                  className="hover:text-white transition-colors"
                >
                  Sales Consulting
                </Link>
              </li>
              <li>
                <Link
                  href="/services#coaching"
                  className="hover:text-white transition-colors"
                >
                  1-on-1 Coaching
                </Link>
              </li>
              <li>
                <Link
                  href="/services#speaking"
                  className="hover:text-white transition-colors"
                >
                  Speaking Events
                </Link>
              </li>
              <li>
                <Link
                  href="/services#training"
                  className="hover:text-white transition-colors"
                >
                  Team Training
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} The Heartbeat. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-500">
            &ldquo;Trust. Listen. Solve. Ask.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
