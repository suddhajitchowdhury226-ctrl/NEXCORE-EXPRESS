import type { ReactNode } from "react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-nex-ink px-5 py-16 text-white sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow flex items-center gap-2 text-nex-lime">
          <span className="h-px w-10 bg-nex-lime" />
          {eyebrow}
        </p>
        <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro ? <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function Section({
  children,
  tone = "white",
  id,
}: {
  children: ReactNode;
  tone?: "white" | "paper" | "ink";
  id?: string;
}) {
  const bg =
    tone === "paper" ? "bg-nex-paper" : tone === "ink" ? "bg-nex-ink text-white" : "bg-white";
  return (
    <section id={id} className={`${bg} px-5 py-20 sm:px-8 lg:py-28`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
