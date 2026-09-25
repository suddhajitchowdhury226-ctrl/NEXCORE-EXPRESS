import { Link } from "@tanstack/react-router";

import logo from "@/assets/nexcore-logo.png";

export function SiteFooter() {
  return (
    <footer className="bg-nex-ink px-5 py-14 text-white sm:px-8" id="contact">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <img
              src={logo}
              alt="NexCore Express Ltd."
              className="h-20 w-auto object-contain object-left brightness-0 invert"
              width={260}
              height={80}
              loading="lazy"
            />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
              NexCore Express Ltd. — Moving and logistics across Canada and the United States.
            </p>
          </div>

          <div>
            <p className="footer-heading">Services</p>
            <div className="mt-4 grid gap-3 text-sm text-white/65">
              <Link to="/services/$slug" params={{ slug: "residential-moving" }}>
                Residential
              </Link>
              <Link to="/services/$slug" params={{ slug: "commercial-moving" }}>
                Commercial
              </Link>
              <Link to="/services/$slug" params={{ slug: "office-relocation" }}>
                Office
              </Link>
              <Link to="/services/$slug" params={{ slug: "storage-solutions" }}>
                Storage
              </Link>
              <Link to="/services/$slug" params={{ slug: "specialty-moving" }}>
                Specialty
              </Link>
              <Link to="/services/$slug" params={{ slug: "packing-services" }}>
                Packing
              </Link>
            </div>
          </div>

          <div>
            <p className="footer-heading">Quick links</p>
            <div className="mt-4 grid gap-3 text-sm text-white/65">
              <Link to="/quote">Get a quote</Link>
              <Link to="/track">Track shipment</Link>
              <Link to="/about">About us</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/admin">Staff login</Link>
            </div>
          </div>

          <div>
            <p className="footer-heading">Service areas</p>
            <div className="mt-4 grid gap-3 text-sm text-white/65">
              <span>Toronto · Vancouver</span>
              <span>Calgary · Ottawa</span>
              <span>Montréal</span>
              <span>Canada–USA cross-border</span>
              <a href="mailto:hello@nexcoreexpress.com">hello@nexcoreexpress.com</a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <span>© 2026 NexCore Express Ltd. All rights reserved.</span>
          <span>Toronto, ON · +1 (800) NEX-CORE</span>
        </div>
      </div>
    </footer>
  );
}
