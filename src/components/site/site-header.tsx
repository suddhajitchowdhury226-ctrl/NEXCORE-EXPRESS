import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/nexcore-logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/moving-services", label: "Moving" },
  { to: "/pricing", label: "Pricing" },
  { to: "/service-areas", label: "Service areas" },
  { to: "/track", label: "Track shipment" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="motion-slide-down bg-nex-lime text-nex-ink">
        <div className="mx-auto flex max-w-7xl justify-between px-5 py-2 text-xs font-bold tracking-wide sm:px-8">
          <span>Moving across Canada &amp; the USA</span>
          <span className="hidden items-center gap-2 sm:flex">
            <Phone className="size-3.5" aria-hidden="true" />
            +1 (800) NEX-CORE
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-nex-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:py-5">
          <Link to="/" aria-label="NexCore Express home">
            <img
              src={logo}
              alt="NexCore Express Ltd."
              className="h-20 w-auto object-contain sm:h-24"
              width={340}
              height={96}
            />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-bold text-nex-ink xl:flex">
            {NAV.slice(1).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-nex-green" }}
                className="transition-colors hover:text-nex-green"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a className="flex items-center gap-2 text-sm font-bold" href="tel:18006392673">
              <span className="grid size-9 place-items-center rounded-full bg-nex-lime">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              +1 (800) NEX-CORE
            </a>
            <Link to="/quote" className="bg-nex-orange px-5 py-3 text-sm font-extrabold text-white">
              Get a quote
              <ArrowRight className="ml-2 inline size-4" aria-hidden="true" />
            </Link>
          </div>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="p-2 xl:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-nex-line bg-white xl:hidden">
            <nav className="mx-auto grid max-w-7xl gap-1 px-5 py-4 sm:px-8">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-nex-line py-3 text-sm font-bold text-nex-ink"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/quote"
                onClick={() => setOpen(false)}
                className="mt-3 bg-nex-orange px-5 py-3 text-center text-sm font-extrabold text-white"
              >
                Get a quote
              </Link>
              <a
                href="tel:18006392673"
                className="mt-2 flex items-center justify-center gap-2 border border-nex-line py-3 text-sm font-bold"
              >
                <Phone className="size-4" /> +1 (800) NEX-CORE
              </a>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 py-2 text-xs font-bold text-nex-muted"
              >
                <X className="size-3.5" /> Close
              </button>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
