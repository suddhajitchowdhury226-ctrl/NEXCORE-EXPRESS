'use client'
import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  ArrowRight, Check, ChevronLeft, ChevronRight, Clock3, Globe2, Home, LockKeyhole,
  MapPin, Menu, Package, Phone, ScanLine, ShieldCheck, Star, Truck, UserRound, X, Zap,
} from 'lucide-react'

const services = [
  ['01', Home, 'Residential Moving', 'Door-to-door home moves with professional crews.'],
  ['02', Globe2, 'Commercial Moving', 'Zero-downtime logistics for growing businesses.'],
  ['03', Package, 'Office Relocation', 'Floor plans, IT assets and desks, mapped end to end.'],
  ['04', ScanLine, 'Packing Services', 'Professional-grade materials and trained packers.'],
  ['05', LockKeyhole, 'Storage Solutions', 'Climate-controlled, inventory tracked to the item.'],
  ['06', ShieldCheck, 'Specialty Moving', 'Pianos, art and fragile heirlooms handled with care.'],
] as const

const benefits = [
  [Zap, 'Instant Quotes', 'Pricing based on real moves, delivered in seconds.'],
  [MapPin, 'Live GPS Tracking', 'Watch your crew approach, minute by minute.'],
  [LockKeyhole, 'Transparent Pricing', 'One number. No surprise fees.'],
  [UserRound, 'Professional Movers', 'Background-checked, in-house, uniformed teams.'],
  [ShieldCheck, 'Secure Payments', 'Encrypted checkout with pay-after-delivery options.'],
  [Phone, '24/7 Support', 'Humans on the line whenever you need them.'],
] as const

const heroSlides = [
  { src: '/nexcore-truck-detail.png', alt: 'NexCore Express truck driving through the city at night' },
  { src: '/nexcore-truck-fleet.png', alt: 'NexCore Express branded moving truck fleet outside headquarters' },
]

const reviews = [
  ['AH', 'Amelia Hart', 'Moved Toronto → Montréal', 'The quote took eleven seconds and it was the price I paid. The tracking meant I never had to call anyone.'],
  ['DO', 'Daniel Osei', 'Ops Lead, Kelvin Studios', "We relocated 90 desks over a weekend. Monday morning nobody could tell we'd moved."],
  ['PR', 'Priya Raman', 'Moved Vancouver → Calgary', "The crew wrapped my grandmother's piano like it was a museum piece. Genuinely impressed."],
]

function PhoneMockup({ driver = false }: { driver?: boolean }) {
  return (
    <div className="phone-shell">
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>NexCore</span>
          <span className="text-orange">{driver ? 'Driver' : 'Customer'}</span>
        </div>
        <div className="phone-map mt-5">
          <span className="map-dot map-dot-a" />
          <span className="map-dot map-dot-b" />
          <Truck className="map-truck" size={18} />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted">{driver ? 'Next stop' : 'ETA'}</p>
            <p className="text-xl font-bold">{driver ? 'Scan item' : '18 min'}</p>
          </div>
          <span className="status-pill"><span className="pulse-dot" />Live</span>
        </div>
        <div className="mt-5 space-y-3 text-xs">
          {(driver
            ? ['Route optimised', 'Scan next item', '3 stops today', 'Proof of delivery']
            : ['Live ETA · 18 min', 'Crew of 4 assigned', 'Inventory: 68 items', 'Pay on delivery']
          ).map((text) => (
            <div key={text} className="flex items-center gap-2 rounded-lg bg-panel px-3 py-2">
              <Check size={13} className="text-orange" />{text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [quote, setQuote] = useState(false)
  const [quoteVisible, setQuoteVisible] = useState(false)
  const [joined, setJoined] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [review, setReview] = useState(0)
  const [cardsVisible, setCardsVisible] = useState(3)

  useEffect(() => {
    function updateCards() {
      if (window.innerWidth < 768) setCardsVisible(1)
      else if (window.innerWidth < 1024) setCardsVisible(2)
      else setCardsVisible(3)
    }
    updateCards()
    window.addEventListener('resize', updateCards)
    return () => window.removeEventListener('resize', updateCards)
  }, [])
  const [tracking, setTracking] = useState('')
  const [trackingMessage, setTrackingMessage] = useState('')
  const [heroSlide, setHeroSlide] = useState(0)
  const estimateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setHeroSlide((c) => (c + 1) % heroSlides.length), 5000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (quote) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setQuoteVisible(true))
      })
      setTimeout(() => estimateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
    }
  }, [quote])

  function submitQuote(e: FormEvent) {
    e.preventDefault()
    setQuote(true)
  }

  function joinList(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) { setEmailError('Please enter your email.'); return }
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    if (!valid) { setEmailError('Please enter a valid email address.'); return }
    setEmailError('')
    console.log('Early access email:', trimmed)
    setJoined(true)
  }

  function track(e: FormEvent) {
    e.preventDefault()
    setTrackingMessage(tracking.trim() ? 'Move #NX-48210 is in transit — your crew is 18 min away.' : 'Enter a move reference to see live status.')
  }

  const maxReview = Math.max(0, reviews.length - cardsVisible)
  const prevReview = () => setReview((r) => Math.max(0, r - 1))
  const nextReview = () => setReview((r) => Math.min(maxReview, r + 1))

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Main navigation">
          <a href="#top" className="flex items-center gap-3 font-mono text-sm font-bold tracking-tight text-white">
            <span className="grid size-8 place-items-center rounded-lg bg-orange text-ink"><Package size={17} /></span>
            NEXCORE <span className="text-orange">/</span> EXPRESS
          </a>
          <div className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#services">Services</a>
            <a href="#fleet">Fleet</a>
            <a href="#tracking">Tracking</a>
            <a href="#why">Why NexCore</a>
            <a href="#app">App</a>
            <a href="#contact">Contact</a>
          </div>
          <a href="#quote" className="hidden rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-ink transition hover:brightness-110 md:block">
            Get a Quote
          </a>
          <button className="text-white md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>
        {menuOpen && (
          <div className="flex flex-col gap-5 border-t border-line px-5 py-5 text-sm text-white md:hidden">
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#tracking" onClick={() => setMenuOpen(false)}>Tracking</a>
            <a href="#why" onClick={() => setMenuOpen(false)}>Why NexCore</a>
            <a href="#app" onClick={() => setMenuOpen(false)}>App</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="top" className="hero relative isolate overflow-hidden">
        <div className="hero-grid" />
        <div className="hero-slides" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <img key={slide.src} src={slide.src} alt="" className={`hero-slide ${index === heroSlide ? 'hero-slide-active' : ''}`} />
          ))}
          <div className="hero-slide-wash" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-32">
          <div className="relative z-10">
            <p className="eyebrow"><span className="pulse-dot" /> Moving across Canada &amp; the USA</p>
            <h1 className="mt-7 max-w-4xl text-balance text-5xl font-bold leading-[.98] tracking-[-.07em] text-white sm:text-7xl lg:text-[6.3rem]">
              Moving Made Simple.<br /><span className="text-orange">Technology Made Smarter.</span>
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted">
              Reliable moving, freight and cross-border logistics across Canada and the United States.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#quote" className="button-primary">Get a Quote <ArrowRight size={17} /></a>
              <a href="#tracking" className="button-ghost">Track Shipment</a>
            </div>
            <div className="mt-14 grid max-w-xl grid-cols-2 gap-y-6 border-t border-line pt-6 sm:grid-cols-4">
              <div><b>25,000+</b><span>Moves</span></div>
              <div><b>4.9/5</b><span>Rated</span></div>
              <div><b>Live</b><span>GPS tracking</span></div>
              <div><b>CA / USA</b><span>Coverage</span></div>
            </div>
          </div>

          {/* Hero floating tracking widget — glass-morphism */}
          <div className="relative hidden min-h-[480px] lg:block">
            <div className="route-card">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>NX / MOVING SYSTEM</span><span className="text-orange">LIVE</span>
              </div>
              <div className="route-map">
                <div className="route-line" />
                <div className="route-point point-one"><span>TORONTO</span></div>
                <div className="route-point point-two"><span>OTTAWA</span></div>
                <Truck className="route-truck" size={25} />
              </div>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted">Your move, in motion</p>
                  <p className="mt-2 text-3xl font-bold text-white">18 min away</p>
                </div>
                <div className="rounded-xl bg-orange/15 px-3 py-2 text-right text-xs text-orange">
                  <Clock3 size={16} className="mb-1 ml-auto" />ETA 11:20
                </div>
              </div>
            </div>
            {/* Glass floating status card */}
            <div className="hero-glass-card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold tracking-widest text-orange">MOVE #NX-48210</span>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                  <span className="pulse-dot-green" />In Transit
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-white">
                <MapPin size={13} className="text-orange flex-none" />
                <span className="text-xs">Toronto, ON <span className="text-muted">→</span> Ottawa, ON</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted">ETA</span>
                <span className="text-lg font-bold text-white">18 min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLEET ── */}
      <section id="fleet" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <div className="fleet-image-card group relative overflow-hidden rounded-2xl border border-line">
            <img src="/nexcore-truck-fleet.png" alt="NexCore Express moving trucks with branded orange logos" className="h-full min-h-[300px] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/95 via-ink/50 to-transparent p-6 pt-20">
              <div>
                <p className="eyebrow orange-text">The NexCore fleet</p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Big moves. One unmistakable mark.</h2>
              </div>
              <span className="hidden rounded-full border border-white/20 bg-ink/70 px-3 py-2 font-mono text-[10px] text-orange sm:block">NX / 001—100</span>
            </div>
          </div>
          <div className="fleet-copy flex flex-col justify-between rounded-2xl border border-line bg-panel p-6 sm:p-8">
            <div>
              <p className="eyebrow orange-text">Built to be seen</p>
              <h3 className="mt-4 text-3xl font-bold tracking-tight text-white">Your move is in good hands — and on the road.</h3>
              <p className="mt-4 text-sm leading-7 text-muted">Every truck carries the NexCore promise: careful crews, smart routing and transparent service from pickup to delivery.</p>
            </div>
            <a href="#quote" className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-orange">Book a branded crew <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section id="quote" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
          <div>
            <p className="eyebrow orange-text">01 / Instant pricing</p>
            <h2 className="section-title">Get an<br />Instant Quote.</h2>
            <p className="mt-5 max-w-sm text-muted">Tell us the essentials. We will do the heavy lifting on the numbers.</p>
          </div>
          <div className="quote-panel">
            <form onSubmit={submitQuote} className="grid gap-4 sm:grid-cols-2">
              <label>Pickup Address
                <div className="input-wrap"><MapPin size={17} /><input required placeholder="Toronto, ON" /></div>
              </label>
              <label>Destination Address
                <div className="input-wrap"><MapPin size={17} /><input required placeholder="Ottawa, ON" /></div>
              </label>
              <label>Property Type
                <select required defaultValue="">
                  <option value="" disabled>Select property type</option>
                  <option>Studio</option><option>1-Bed</option><option>2-Bed</option>
                  <option>3-Bed</option><option>Detached House</option><option>Commercial</option>
                </select>
              </label>
              <label>Moving Date
                <input type="date" required />
              </label>
              <label className="sm:col-span-2">Service Type
                <select required defaultValue="">
                  <option value="" disabled>Select service type</option>
                  <option>Residential Moving</option><option>Commercial Moving</option>
                  <option>Office Relocation</option><option>Packing</option>
                  <option>Storage</option><option>Specialty</option>
                </select>
              </label>
              <button type="submit" className="button-primary sm:col-span-2 sm:justify-center">
                Calculate Quote <ArrowRight size={17} />
              </button>
            </form>
            {quote && (
              <div ref={estimateRef} className={`estimate-card ${quoteVisible ? 'estimate-card-visible' : ''}`}>
                <div>
                  <p className="text-xs uppercase tracking-widest text-orange">Estimated cost</p>
                  <p className="mt-2 text-4xl font-bold text-white">CA$1,480</p>
                </div>
                <div className="grid gap-3 text-sm text-muted sm:grid-cols-3">
                  <span><b className="block text-white">26 ft</b>Recommended truck</span>
                  <span><b className="block text-white">4 Movers</b>Crew size</span>
                  <span><b className="block text-white">7.5 hrs</b>Estimated time</span>
                </div>
                <p className="text-xs text-muted">All-inclusive. Packing materials and insurance included.</p>
                <button className="button-primary w-full justify-center">Book This Move</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="section-dark">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <p className="eyebrow orange-text">02 / Our divisions</p>
          <h2 className="section-title text-white">Every Kind of Move,<br />One Platform.</h2>
          <p className="mt-5 max-w-lg text-muted">Six specialist divisions, one operating system, the same standard of care.</p>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map(([num, Icon, title, copy]) => (
              <article className="service-card" key={title}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-orange">{num}</span>
                  <Icon size={24} className="text-orange" />
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <a href="#quote">Explore <ArrowRight size={15} /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRACKING ── */}
      <section id="tracking" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow orange-text">03 / Live tracking</p>
            <h2 className="section-title">Watch It Move,<br />Live.</h2>
          </div>
          <p className="max-w-md text-muted">Real-time GPS, driver details and a status timeline that updates itself.</p>
        </div>
        <div className="tracking-panel mt-12">
          {/* Animated SVG map */}
          <div className="tracking-map">
            <div className="map-grid" />
            <svg className="tracking-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              {/* Dashed route path */}
              <path id="route-path" d="M 80 190 C 180 190, 220 80, 520 80" stroke="#f97316" strokeWidth="2.5" strokeDasharray="8 5" fill="none" opacity="0.6" />
              {/* Start dot — Toronto */}
              <circle cx="80" cy="190" r="7" fill="#f97316" />
              <circle cx="80" cy="190" r="13" fill="#f97316" opacity="0.2">
                <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* End dot — Ottawa */}
              <circle cx="520" cy="80" r="7" fill="#94a3b8" />
              {/* Animated truck dot along path */}
              <circle r="9" fill="#f97316" filter="url(#glow)">
                <animateMotion dur="8s" repeatCount="indefinite" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" calcMode="spline">
                  <mpath href="#route-path" />
                </animateMotion>
              </circle>
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
            </svg>
            <span className="city city-a">Toronto, ON</span>
            <span className="city city-b">Ottawa, ON</span>
            <div className="map-caption"><span className="pulse-dot" /> Move #NX-48210 — In Transit</div>
          </div>
          {/* Driver info + timeline */}
          <div className="driver-panel">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="avatar">MO</span>
                <div>
                  <b className="text-white">Marcus Obi</b>
                  <p className="text-xs text-muted">Lead Driver · 1,240 moves · <Star size={11} fill="currentColor" className="inline text-orange" /> 4.9</p>
                </div>
              </div>
              <span className="status-pill"><span className="pulse-dot" />18 min away</span>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="stat-box"><b>26 ft</b><span>Truck</span></div>
              <div className="stat-box"><b>4 Movers</b><span>Crew</span></div>
            </div>
            <div className="timeline">
              {[
                ['Crew Dispatched', '08:12', 'done'],
                ['Loading Complete', '10:45', 'done'],
                ['In Transit', '11:02', 'active'],
                ['Arrival & Unload', '16:30', 'upcoming'],
              ].map(([name, time, state]) => (
                <div className="timeline-item" key={name}>
                  <span className={`timeline-dot ${state}`} />
                  <div><b>{name}</b><span>{time}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <form onSubmit={track} className="mx-auto mt-8 flex max-w-xl gap-2">
          <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Enter move reference" className="input flex-1" />
          <button className="button-primary">Track <ArrowRight size={16} /></button>
        </form>
        {trackingMessage && <p className="mt-3 text-center text-sm text-orange">{trackingMessage}</p>}
      </section>

      {/* ── WHY ── */}
      <section id="why" className="section-dark">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <p className="eyebrow orange-text">04 / The NexCore standard</p>
          <h2 className="section-title text-white">Why Teams and Families<br />Choose NexCore.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(([Icon, title, copy]) => (
              <article className="benefit-card" key={title}>
                <Icon size={23} className="text-orange" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP COMING SOON (no phone mockups here) ── */}
      <section id="app" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow orange-text">05 / Coming soon</p>
          <h2 className="section-title">Our App —<br />Coming Soon.</h2>
          <p className="mt-5 text-2xl font-bold tracking-tight text-orange">Watch it move, live.</p>
          <p className="mt-4 max-w-md text-muted">Real-time GPS, driver details and a status timeline that updates itself.</p>
          {/* Progress bar */}
          <div className="mt-8 flex gap-2">
            {['Booked', 'Dispatched', 'Loading', 'In Transit', 'Delivered'].map((stage, i) => (
              <div key={stage} className={`progress-stage ${i === 3 ? 'active' : ''}`}>
                <span /><small>{stage}</small>
              </div>
            ))}
          </div>
          {/* Email capture */}
          <div className="mt-10 border-t border-line pt-8">
            <h3 className="text-2xl font-bold text-white">Be the First to Know</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted">
              Join the early-access list and we&apos;ll send you full download access as soon as it launches.
            </p>
            {joined ? (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-800 bg-emerald-950/40 px-4 py-4">
                <Check size={18} className="mt-0.5 flex-none text-emerald-400" />
                <p className="text-sm leading-6 text-emerald-300">
                  You&apos;re on the list. We&apos;ll notify you as soon as the NexCore Express app is ready for download.
                </p>
              </div>
            ) : (
              <form onSubmit={joinList} className="mt-6 space-y-2">
                <div className="flex max-w-md gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError('') }}
                    placeholder="Email address"
                    className="input flex-1"
                  />
                  <button type="submit" className="button-primary">Join the List</button>
                </div>
                {emailError && <p className="text-xs text-red-400">{emailError}</p>}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 06 — MOBILE APPS (phone mockups live here only) ── */}
      <section className="section-dark">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8 lg:py-24">
          <p className="eyebrow orange-text">06 / The mobile experience</p>
          <h2 className="section-title mx-auto max-w-3xl text-white">Your Move, In Your Pocket.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted">Two apps, one system. Customers track and pay; drivers navigate, scan inventory and close jobs.</p>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 text-left md:grid-cols-2">
            <div className="phone-feature"><h3>Customer App</h3><PhoneMockup /></div>
            <div className="phone-feature"><h3>Driver App</h3><PhoneMockup driver /></div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section id="contact" className="cta-band">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8 lg:py-24">
          <h2 className="text-5xl font-bold tracking-[-.07em] text-white sm:text-7xl">Ready to Move Smarter?</h2>
          <p className="mx-auto mt-5 max-w-md text-lg text-white/70">Book in minutes. Track every mile. Pay one honest price.</p>
          <a href="#quote" className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-ink transition hover:bg-orange hover:text-ink">
            Book Your Move Today <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* ── REVIEWS CAROUSEL ── */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow orange-text">07 / Social proof</p>
            <h2 className="section-title">Rated 4.9/5 Across<br />6,200 Moves.</h2>
          </div>
          <div className="flex gap-2">
            <button className="icon-button" aria-label="Previous review" onClick={prevReview}><ChevronLeft size={18} /></button>
            <button className="icon-button" aria-label="Next review" onClick={nextReview}><ChevronRight size={18} /></button>
          </div>
        </div>
        {/* Carousel viewport */}
        <div className="carousel-viewport mt-12">
          <div className="carousel-track" style={{ transform: `translateX(calc(-${review} * (100% / ${cardsVisible})))` }}>
            {reviews.map(([initials, name, detail, quote], i) => (
              <article key={name} className={`carousel-card review-card ${i === review ? 'review-active' : ''}`} style={{ minWidth: `calc(100% / ${cardsVisible})` }}>
                <div className="flex gap-1 text-orange">{[1,2,3,4,5].map(x => <Star key={x} size={14} fill="currentColor" />)}</div>
                <p className="mt-7 text-lg font-semibold leading-7">&quot;{quote}&quot;</p>
                <div className="mt-8 flex items-center gap-3">
                  <span className="avatar">{initials}</span>
                  <div><b className="text-sm">{name}</b><p className="mt-1 text-xs text-muted">{detail}</p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
        {/* Dot pagination */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: reviews.length - cardsVisible + 1 }, (_, i) => (
            <button
              key={i}
              aria-label={`Go to review ${i + 1}`}
              onClick={() => setReview(i)}
              className={`carousel-dot ${i === review ? 'carousel-dot-active' : ''}`}
            />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="section-dark" id="footer">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <a href="#top" className="flex items-center gap-3 font-mono text-sm font-bold text-white">
              <span className="grid size-8 place-items-center rounded-lg bg-orange text-ink"><Package size={17} /></span>
              NEXCORE / EXPRESS
            </a>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted">NexCore Express Ltd. — Moving and logistics across Canada and the United States.</p>
          </div>
          {[
            ['Services', 'Residential', 'Commercial', 'Office', 'Storage', 'Specialty', 'Packing'],
            ['Quick Links', 'Get a Quote', 'Track Shipment', 'About Us', 'FAQ'],
            ['Service Areas', 'Toronto', 'Vancouver', 'Calgary', 'Ottawa', 'Montréal', 'Cross-Border (Canada–USA)'],
          ].map(([heading, ...items]) => (
            <div key={heading}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-orange">{heading}</h3>
              <ul className="mt-5 space-y-3 text-sm text-muted">
                {items.map(x => <li key={x}><a href="#quote">{x}</a></li>)}
              </ul>
            </div>
          ))}
          {/* Contact column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-orange">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2"><Phone size={13} className="text-orange flex-none" />+1 (800) NEX-CORE</li>
              <li className="flex items-center gap-2"><Package size={13} className="text-orange flex-none" />hello@nexcoreexpress.com</li>
              <li className="flex items-center gap-2"><MapPin size={13} className="text-orange flex-none" />Toronto, Ontario, Canada</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-line px-5 py-6 text-xs text-muted sm:flex-row sm:justify-between lg:px-8">
          <span>© 2026 NexCore Express Ltd. All rights reserved.</span>
          <span>Toronto, ON · +1 (800) NEX-CORE · hello@nexcoreexpress.com</span>
        </div>
      </footer>

    </main>
  )
}
