import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Link, Route, Switch, useLocation } from 'wouter';
import { schoolContent } from './siteContent';
import {
  ArrowDownRight,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  FlaskConical,
  HeartHandshake,
  Instagram,
  Laptop,
  Mail,
  MapPin,
  MessageCircle,
  Menu,
  Music2,
  Phone,
  Quote,
  School,
  Send,
  Sparkles,
  Table2,
  X,
} from 'lucide-react';
import NotFound from '@/pages/not-found';

const schoolLogo = schoolContent.identity.logo;
const schoolAddress = schoolContent.contact.address;
const whatsappNumber = schoolContent.contact.whatsappNumber;
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(schoolContent.contact.whatsappGreeting)}`;
const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(schoolAddress)}`;
const galleryItems = schoolContent.gallery;
const GALLERY_AUTOPLAY_INTERVAL = 4000;

const facilityIcons = {
  flask: <FlaskConical />,
  laptop: <Laptop />,
  music: <Music2 />,
} as const;
const programmeIcons = {
  sparkles: <Sparkles />,
  book: <BookOpen />,
  award: <Award />,
} as const;

const navItems = [
  { href: '/', label: 'Welcome' },
  { href: '/academics', label: 'Academics' },
  { href: '/admissions', label: 'Admissions' },
  { href: '/fees', label: 'Fees' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/vision', label: 'Vision' },
  { href: '/mission', label: 'Mission' },
  { href: '/contact', label: 'Contact' },
];

function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${compact ? 'max-w-[220px] lg:max-w-[390px]' : ''}`} data-testid="link-logo-home">
      <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#f8eedc] ring-2 ring-[#e3b45b]/50 shadow-sm transition-transform group-hover:rotate-3">
        <img src={schoolLogo} alt={`${schoolContent.identity.shortName} School emblem`} width="512" height="476" loading="eager" fetchPriority="high" decoding="async" className="size-full object-cover" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className={`block font-mono-school text-[7px] font-bold uppercase tracking-[.1em] text-[#e3b45b]/75 ${compact ? 'lg:whitespace-nowrap' : ''}`}>{schoolContent.identity.management}</span>
        {compact ? (
          <>
        <span className="hidden font-display text-[1.35rem] font-bold leading-none tracking-tight text-[#f8eedc] lg:block lg:whitespace-nowrap">{schoolContent.identity.name}</span>
            <span className="block font-display text-[1.8rem] font-bold leading-none tracking-tight text-[#f8eedc] lg:hidden">{schoolContent.identity.shortName}</span>
            <span className="block font-mono-school text-[8px] font-bold uppercase tracking-[.14em] text-[#e3b45b] lg:hidden">Primary English Medium School</span>
          </>
        ) : (
          <>
            <span className="block font-display text-[1.45rem] font-bold tracking-tight text-[#f8eedc]">{schoolContent.identity.shortName}</span>
            <span className="block font-mono-school text-[8px] font-bold uppercase tracking-[.14em] text-[#e3b45b]">Primary English Medium School</span>
          </>
        )}
      </span>
    </Link>
  );
}

function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="grain min-h-[100dvh] overflow-hidden">
      <div className="bg-[#e3b45b] px-4 py-2 text-center font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#202337]">
        <span className="hidden sm:inline">Admissions open for {schoolContent.identity.academicYear}&nbsp;&nbsp;·&nbsp;&nbsp;</span>
        <Link href="/admissions" className="underline decoration-1 underline-offset-4" data-testid="link-top-admissions">Schedule a school visit</Link>
      </div>
      <header className="relative z-40 bg-[#202337] text-[#f8eedc]">
        <div className="page-wrap flex min-h-[76px] items-center justify-between gap-4 py-3 lg:flex-wrap lg:justify-center lg:gap-x-8 lg:gap-y-2 lg:py-4">
          <div className="hidden items-center gap-3 lg:flex">
            <a href={schoolContent.contact.phoneHref} className="flex items-center gap-2 text-[12px] font-semibold text-[#f8eedc]/75 hover:text-[#e3b45b]" data-testid="link-call-header"><Phone size={14} /> {schoolContent.contact.phone}</a>
            <Link href="/mandatory-disclosure" className="text-[13px] font-bold text-[#f8eedc]/75 hover:text-[#e3b45b]" data-testid="link-disclosure-header">Mandatory Disclosure</Link>
          </div>
          <LogoMark compact />
          <div className="hidden items-center gap-3 lg:flex">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[12px] font-semibold text-[#f8eedc]/75 hover:text-[#e3b45b]" data-testid="link-whatsapp-header"><MessageCircle size={14} /> WhatsApp</a>
            <Link href="/admissions" className="flex items-center gap-2 rounded-full bg-[#e3b45b] px-4 py-2.5 text-[12px] font-extrabold text-[#202337] transition-transform hover:-translate-y-0.5" data-testid="link-enquire-header">Enquire now <ArrowDownRight size={15} /></Link>
          </div>
          <button type="button" className="rounded-xl p-2 lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-toggle-menu">
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
        <nav className="hidden border-t border-white/10 lg:flex" aria-label="Main navigation">
          <div className="page-wrap flex flex-wrap items-center justify-center gap-1 py-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors hover:bg-white/10 ${location === item.href ? 'bg-white/10 text-[#e3b45b]' : 'text-[#f8eedc]/75'}`} data-testid={`link-nav-${item.label.toLowerCase()}`}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        {menuOpen && (
          <nav className="border-t border-white/10 px-5 py-4 lg:hidden" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block border-b border-white/10 py-3 text-base font-bold text-[#f8eedc]" data-testid={`link-mobile-${item.label.toLowerCase()}`}>{item.label}</Link>
            ))}
            <Link href="/mandatory-disclosure" onClick={() => setMenuOpen(false)} className="block border-b border-white/10 py-3 text-base font-bold text-[#e3b45b]" data-testid="link-mobile-mandatory-disclosure">Mandatory Disclosure</Link>
            <a href={schoolContent.contact.phoneHref} className="mt-4 flex items-center gap-2 py-2 text-sm text-[#e3b45b]" data-testid="link-call-mobile"><Phone size={15} /> {schoolContent.contact.phone}</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 text-sm text-[#e3b45b]" data-testid="link-whatsapp-mobile"><MessageCircle size={15} /> Chat on WhatsApp</a>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <Footer />
      <Link href="/admissions" className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[#d95340] px-4 py-3 text-xs font-extrabold text-[#fff8ee] shadow-[0_8px_24px_-8px_rgba(217,83,64,.8)] transition-transform hover:-translate-y-1" data-testid="link-floating-enquire">
        <Send size={14} /> Enquire for {schoolContent.identity.academicYear}
      </Link>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#202337] px-5 pb-10 pt-16 text-[#f8eedc]">
      <div className="page-wrap">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr_.8fr_1fr]">
          <div>
            <LogoMark />
            <p className="mt-6 max-w-xs text-sm leading-7 text-[#f8eedc]/60">A spirited English-medium school in {schoolContent.identity.location}, nurturing clear minds, kind hearts and curious hands since {schoolContent.identity.founded}.</p>
            <div className="mt-6 flex gap-3">
              <a href={schoolContent.contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Saraswati School on Instagram" className="grid size-9 place-items-center rounded-full border border-white/15 text-[#e3b45b] hover:bg-white/10" data-testid="link-instagram"><Instagram size={16} /></a>
              <a href={schoolContent.contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Saraswati School on Facebook" className="grid size-9 place-items-center rounded-full border border-white/15 font-display text-lg font-bold text-[#e3b45b] hover:bg-white/10" data-testid="link-facebook">f</a>
              <a href={`mailto:${schoolContent.contact.email}`} aria-label="Email" className="grid size-9 place-items-center rounded-full border border-white/15 text-[#e3b45b] hover:bg-white/10" data-testid="link-footer-email"><Mail size={16} /></a>
              <a href={schoolContent.contact.phoneHref} aria-label="Call school" className="grid size-9 place-items-center rounded-full border border-white/15 text-[#e3b45b] hover:bg-white/10" data-testid="link-footer-phone"><Phone size={16} /></a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Chat with school on WhatsApp" className="grid size-9 place-items-center rounded-full border border-white/15 text-[#e3b45b] hover:bg-white/10" data-testid="link-footer-whatsapp"><MessageCircle size={16} /></a>
            </div>
          </div>
          <div>
            <p className="font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#e3b45b]">Explore</p>
            <div className="mt-5 grid gap-3 text-sm text-[#f8eedc]/65">
              <Link href="/academics" className="hover:text-[#e3b45b]" data-testid="link-footer-academics">Academic journey</Link>
              <Link href="/admissions" className="hover:text-[#e3b45b]" data-testid="link-footer-admissions">Admissions</Link>
              <Link href="/fees" className="hover:text-[#e3b45b]" data-testid="link-footer-fees">Fee structure</Link>
              <Link href="/gallery" className="hover:text-[#e3b45b]" data-testid="link-footer-gallery">School gallery</Link>
               <Link href="/vision" className="hover:text-[#e3b45b]" data-testid="link-footer-vision">Our vision</Link>
               <Link href="/mission" className="hover:text-[#e3b45b]" data-testid="link-footer-mission">Our mission</Link>
            </div>
          </div>
          <div>
            <p className="font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#e3b45b]">Resources</p>
            <div className="mt-5 grid gap-3 text-sm text-[#f8eedc]/65">
              <Link href="/mandatory-disclosure" className="hover:text-[#e3b45b]" data-testid="link-mandatory-disclosure">Mandatory Disclosure</Link>
              <Link href="/contact" className="hover:text-[#e3b45b]" data-testid="link-footer-contact">Contact office</Link>
              <a href={`mailto:${schoolContent.contact.email}`} className="hover:text-[#e3b45b]" data-testid="link-footer-mail">Write to us</a>
            </div>
          </div>
          <div>
            <p className="font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#e3b45b]">Find us</p>
            <p className="mt-5 text-sm leading-6 text-[#f8eedc]/65">{schoolContent.contact.address}</p>
            <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-[#f8eedc]/65 hover:text-[#e3b45b]" data-testid="link-footer-directions"><MapPin size={14} /> Get directions</a>
             <a href={schoolContent.contact.phoneHref} className="mt-4 inline-flex items-center gap-2 text-sm text-[#f8eedc]/65 hover:text-[#e3b45b]"><Phone size={14} /> {schoolContent.contact.phone}</a>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 font-mono-school text-[10px] uppercase tracking-[.12em] text-[#f8eedc]/40 sm:flex-row">
           <span>© {schoolContent.identity.academicYear.slice(0, 4)} {schoolContent.identity.name}</span>
           <span>Under {schoolContent.identity.management} · {schoolContent.identity.board}</span>
        </div>
      </div>
    </footer>
  );
}

function PageIntro({ eyebrow, title, copy, children }: { eyebrow: string; title: ReactNode; copy: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#202337] px-5 py-20 text-[#f8eedc] md:py-28">
      <div className="absolute -right-24 -top-32 size-[430px] rounded-full border-[70px] border-[#d95340]/25" />
      <div className="absolute bottom-[-140px] left-[48%] size-[300px] rounded-full border-[46px] border-[#e3b45b]/20" />
      <div className="page-wrap relative grid gap-8 md:grid-cols-[1fr_.65fr] md:items-end">
        <div className="reveal">
          <p className="font-mono-school text-[10px] font-bold uppercase tracking-[.2em] text-[#e3b45b]">{eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(3.3rem,15vw,6rem)] font-bold leading-[.88] tracking-[-.045em] md:text-8xl">{title}</h1>
        </div>
        <div className="reveal reveal-2">
          <p className="max-w-md text-base leading-7 text-[#f8eedc]/68">{copy}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy?: string; light?: boolean }) {
  return (
    <div className={`max-w-2xl ${light ? 'text-[#f8eedc]' : 'text-[#202337]'}`}>
      <p className="font-mono-school text-[10px] font-bold uppercase tracking-[.2em] text-[#c77a22]">{eyebrow}</p>
      <h2 className="mt-4 font-display text-[clamp(2.6rem,11vw,3.75rem)] font-bold leading-[.94] tracking-[-.04em] md:text-6xl">{title}</h2>
      {copy && <p className={`mt-5 max-w-xl text-base leading-7 ${light ? 'text-[#f8eedc]/65' : 'text-[#202337]/62'}`}>{copy}</p>}
    </div>
  );
}

function HomeGallery() {
  const [active, setActive] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isInteracting || prefersReducedMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % galleryItems.length), GALLERY_AUTOPLAY_INTERVAL);
    return () => window.clearInterval(timer);
  }, [isInteracting]);

  const move = (direction: number) => setActive((current) => (current + direction + galleryItems.length) % galleryItems.length);
  const item = galleryItems[active];

  return (
    <div
      className="relative min-h-[440px] overflow-hidden rounded-[2.4rem] rounded-bl-[6rem] bg-[#3b7f7c] shadow-2xl shadow-[#202337]/15 md:min-h-[540px]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Saraswati School moments"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocusCapture={() => setIsInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsInteracting(false);
      }}
    >
      <img key={item.src} src={item.src} alt={item.title} loading={active === 0 ? 'eager' : 'lazy'} fetchPriority={active === 0 ? 'high' : 'auto'} decoding="async" className="absolute inset-0 size-full object-cover transition-opacity duration-500" data-testid="image-home-gallery" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#202337]/85 via-[#202337]/10 to-[#202337]/10" />
      <div className="absolute left-5 top-5 rounded-full bg-[#f8eedc]/90 px-3 py-2 font-mono-school text-[9px] font-bold uppercase tracking-[.14em] text-[#202337] md:left-7 md:top-7">
        <span data-testid="text-home-gallery-counter">{item.label} · {String(active + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</span>
      </div>
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-[#f8eedc] md:inset-x-7 md:bottom-7">
        <div className="max-w-[70%]">
          <p className="font-mono-school text-[9px] uppercase tracking-[.17em] text-[#e3b45b]">Life at Saraswati</p>
          <p className="mt-2 font-display text-3xl font-bold leading-[.9] md:text-4xl">{item.title}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => move(-1)} className="grid size-10 place-items-center rounded-full border border-[#f8eedc]/35 bg-[#202337]/30 hover:bg-[#202337]/60" aria-label="Previous school photo" data-testid="button-home-gallery-previous"><ChevronLeft size={17} /></button>
          <button type="button" onClick={() => move(1)} className="grid size-10 place-items-center rounded-full bg-[#e3b45b] text-[#202337] hover:bg-[#f4c979]" aria-label="Next school photo" data-testid="button-home-gallery-next"><ChevronRight size={17} /></button>
        </div>
      </div>
      <div className="absolute bottom-5 left-5 flex gap-1.5 md:bottom-7 md:left-7">
        {galleryItems.map((gallery, index) => (
          <button type="button" key={gallery.src} onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all ${index === active ? 'w-8 bg-[#e3b45b]' : 'w-2 bg-[#f8eedc]/60'}`} aria-label={`Show ${gallery.label} photo`} aria-current={index === active ? 'true' : undefined} data-testid={`button-home-gallery-dot-${index}`} />
        ))}
      </div>
    </div>
  );
}

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#f4e6c9] px-5 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="absolute -left-24 top-24 size-72 rounded-full border-[50px] border-[#d95340]/10" />
        <div className="page-wrap grid gap-14 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div className="relative z-10 reveal">
            <div className="mb-7 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#202337] px-3 py-2 font-mono-school text-[10px] font-bold uppercase tracking-[.12em] text-[#e3b45b]"><span className="size-1.5 rounded-full bg-[#e3b45b]" /> {schoolContent.identity.board} School</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d95340]/30 bg-[#fff8ee]/50 px-3 py-2 font-mono-school text-[10px] font-bold uppercase tracking-[.12em] text-[#c94b35]"><span className="size-1.5 rounded-full bg-[#d95340]" /> Registration open</span>
               <span className="font-mono-school text-[10px] font-bold uppercase tracking-[.12em] text-[#202337]/50">Est. {schoolContent.identity.founded}</span>
               <span className="rounded-full border border-[#202337]/12 bg-[#fff8ee]/75 px-3 py-2 text-xs font-bold text-[#202337]">Co-ed education</span>
            </div>
            <h1 className="max-w-3xl font-display text-[clamp(3.35rem,16vw,7.4rem)] font-bold leading-[.82] tracking-[-.06em] text-[#202337]">Where bright<br /><span className="text-[#c94b35]">beginnings</span><br />take root.</h1>
             <p className="mt-8 max-w-lg text-base leading-7 text-[#202337]/65 md:text-lg">{schoolContent.identity.name} is a place to be known, challenged and celebrated — right here in the heart of {schoolContent.identity.location}.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/admissions" className="inline-flex items-center gap-3 rounded-full bg-[#d95340] px-5 py-3.5 text-sm font-extrabold text-[#fff8ee] shadow-lg shadow-[#d95340]/20 transition-transform hover:-translate-y-1" data-testid="link-hero-admissions">Begin your enquiry <ArrowRight size={17} /></Link>
              <Link href="/academics" className="inline-flex items-center gap-2 rounded-full border border-[#202337]/20 px-5 py-3.5 text-sm font-bold text-[#202337] transition-colors hover:bg-[#202337] hover:text-[#f8eedc]" data-testid="link-hero-academics">See the learning journey</Link>
            </div>
          </div>
          <div className="relative min-h-[440px] reveal reveal-2 md:min-h-[540px]">
            <HomeGallery />
            <div className="absolute bottom-24 right-0 z-10 grid size-28 place-items-center rounded-full bg-[#e3b45b] text-center text-[#202337] shadow-lg md:size-36">
               <span><span className="block font-display text-4xl font-bold leading-none">{new Date().getFullYear() - Number(schoolContent.identity.founded)}</span><span className="font-mono-school text-[9px] font-bold uppercase tracking-wider">years of<br />belonging</span></span>
            </div>
          </div>
        </div>
      </section>
      <div className="overflow-hidden border-y border-[#202337]/10 bg-[#202337] py-3 text-[#f8eedc]">
        <div className="marquee-track flex w-max items-center gap-10 font-mono-school text-[10px] font-bold uppercase tracking-[.2em]"><span>Curiosity is our curriculum</span><span className="text-[#e3b45b]">•</span><span>Jalgaon’s school community</span><span className="text-[#e3b45b]">•</span><span>Learning with head and heart</span><span className="text-[#e3b45b]">•</span><span>Curiosity is our curriculum</span><span className="text-[#e3b45b]">•</span><span>Jalgaon’s school community</span><span className="text-[#e3b45b]">•</span></div>
      </div>
      <section className="bg-[#f8eedc] px-5 py-20 md:py-28">
        <div className="page-wrap grid gap-14 lg:grid-cols-[.85fr_1.15fr]">
           <SectionHeading eyebrow="About Us" title="Education that helps every child flourish." copy={schoolContent.about.description} />
          <div className="grid gap-5 sm:grid-cols-2">
             {schoolContent.about.values.map(([num, title, copy]) => <div key={num} className="rounded-[1.5rem] border border-[#202337]/12 bg-[#f4e6c9] p-6 transition-transform hover:-translate-y-1"><span className="font-mono-school text-[10px] font-bold text-[#c94b35]">{num}</span><h3 className="mt-8 font-display text-3xl font-bold text-[#202337]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#202337]/60">{copy}</p></div>)}
          </div>
        </div>
      </section>
      <section className="bg-[#d95340] px-5 py-14 text-[#fff8ee]">
        <div className="page-wrap grid gap-8 md:grid-cols-4 md:items-center">
          <div><p className="font-mono-school text-[10px] uppercase tracking-[.16em] text-[#f8eedc]/65">The numbers behind the warmth</p><p className="mt-2 font-display text-3xl font-bold">A living school.</p></div>
           {schoolContent.about.stats.map(([num, label]) => <div key={label} className="border-l border-[#fff8ee]/25 pl-5"><p className="font-display text-5xl font-bold">{num}</p><p className="font-mono-school mt-1 text-[10px] uppercase tracking-[.15em] text-[#fff8ee]/65">{label}</p></div>)}
        </div>
      </section>
      <section className="bg-[#e3b45b] px-5 py-14 text-[#202337]">
        <div className="page-wrap flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div>
            <p className="font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#202337]/60">Speak with the school office</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-none md:text-5xl">A question is one tap away.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#202337]/70">Call or message us on WhatsApp for admissions, campus visits, fees, or any help your family needs.</p>
          </div>
          <div className="flex flex-wrap gap-3">
             <a href={schoolContent.contact.phoneHref} className="inline-flex w-fit items-center gap-3 rounded-full bg-[#202337] px-6 py-4 text-sm font-extrabold text-[#f8eedc] shadow-lg shadow-[#202337]/15 transition-transform hover:-translate-y-1" data-testid="link-call-now-home"><Phone size={18} /> Call now · {schoolContent.contact.phone}</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-3 rounded-full border-2 border-[#202337]/30 px-6 py-4 text-sm font-extrabold text-[#202337] transition-transform hover:-translate-y-1 hover:bg-[#f8eedc]/45" data-testid="link-whatsapp-home"><MessageCircle size={18} /> WhatsApp us</a>
          </div>
        </div>
      </section>
      <section className="bg-[#202337] px-5 py-20 text-[#f8eedc] md:py-28">
        <div className="page-wrap">
          <SectionHeading eyebrow="Spaces that invite possibility" title="The best lessons don't always happen at a desk." copy="Our facilities are designed for movement, making and music — bright corners where children can follow a question all the way through." light />
          <div className="mt-14 grid gap-4 md:grid-cols-12">
             {schoolContent.facilities.map((facility, index) => <FacilityCard key={facility.title} className={index === 0 ? 'md:col-span-7 md:min-h-[310px]' : index === 1 ? 'md:col-span-5 md:min-h-[310px]' : 'md:col-span-5'} icon={facilityIcons[facility.icon]} title={facility.title} copy={facility.copy} tone={facility.tone} />)}
            <div className="relative min-h-[220px] overflow-hidden rounded-[1.8rem] bg-[#f4e6c9] p-7 text-[#202337] md:col-span-7"><div className="absolute -right-8 -top-12 size-44 rounded-full border-[28px] border-[#d95340]/25" /><div className="relative flex h-full flex-col justify-between"><School size={28} className="text-[#c94b35]" /><div><p className="font-mono-school text-[10px] uppercase tracking-[.15em] text-[#202337]/50">More to explore</p><p className="mt-2 max-w-sm font-display text-3xl font-bold">A campus that feels like it belongs to children.</p></div></div></div>
          </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/gallery" className="inline-flex items-center gap-2 font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#e3b45b] hover:text-[#f8eedc]" data-testid="link-home-gallery">Walk through our spaces <ArrowRight size={15} /></Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#e3b45b] hover:text-[#f8eedc]" data-testid="link-home-whatsapp"><MessageCircle size={15} /> Chat on WhatsApp</a>
            </div>
        </div>
      </section>
      <section className="bg-[#3b7f7c] px-5 py-20 text-[#f8eedc] md:py-24">
        <div className="page-wrap grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><Quote size={32} className="mb-5 text-[#e3b45b]" /><p className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] md:text-6xl">“The school gave our daughter a voice — and the courage to use it.”</p><p className="mt-6 font-mono-school text-[10px] uppercase tracking-[.15em] text-[#f8eedc]/60">— A Saraswati parent, 2025</p></div><Link href="/contact" className="inline-flex items-center gap-2 self-end rounded-full bg-[#e3b45b] px-5 py-3.5 text-sm font-bold text-[#202337] hover:bg-[#f4c979]" data-testid="link-home-contact">Come say hello <ArrowDownRight size={16} /></Link></div>
      </section>
    </>
  );
}

function FacilityCard({ icon, title, copy, tone, className = '' }: { icon: ReactNode; title: string; copy: string; tone: 'saffron' | 'teal' | 'coral'; className?: string }) {
  const styles = { saffron: 'bg-[#e3b45b] text-[#202337]', teal: 'bg-[#3b7f7c] text-[#f8eedc]', coral: 'bg-[#d95340] text-[#fff8ee]' };
  return <div className={`relative overflow-hidden rounded-[1.8rem] p-7 ${styles[tone]} ${className}`}><div className="absolute -right-12 -top-12 size-44 rounded-full border-[26px] border-current opacity-15" /><div className="relative flex h-full flex-col justify-between gap-12"><span className="grid size-12 place-items-center rounded-2xl border border-current/20">{icon}</span><div><h3 className="font-display text-4xl font-bold">{title}</h3><p className="mt-2 text-sm opacity-70">{copy}</p></div></div></div>;
}

function Academics() {
  const programmeStyles = { saffron: 'bg-[#e3b45b]', teal: 'bg-[#3b7f7c] text-[#f8eedc]', coral: 'bg-[#d95340] text-[#fff8ee]' };
  return <>
    <PageIntro eyebrow="The learning journey" title={<>Room to<br /><span className="text-[#e3b45b]">become.</span></>} copy="From first letters to future plans, our programmes meet children where they are and give them the right kind of stretch.">
      <Link href="/admissions" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#e3b45b] hover:text-[#f8eedc]" data-testid="link-academics-enquire">Ask about a class <ArrowRight size={16} /></Link>
    </PageIntro>
      <section className="bg-[#f8eedc] px-5 py-20 md:py-28"><div className="page-wrap"><SectionHeading eyebrow="A clear path, a personal pace" title="Four chapters. One continuous curiosity." copy="Our age-wise programmes are connected by a shared language of care, high expectations and hands-on learning." /><div className="mt-14 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">{schoolContent.programmes.map((p) => <article key={p.num} className={`group relative min-h-[470px] overflow-hidden rounded-[2rem] p-7 ${programmeStyles[p.tone]} transition-transform hover:-translate-y-2`}><div className="flex items-start justify-between"><span className="font-mono-school text-[10px] font-bold opacity-60">{p.num}</span><span className="grid size-12 place-items-center rounded-2xl border border-current/20">{programmeIcons[p.icon]}</span></div><div className="absolute -right-14 top-24 size-48 rounded-full border-[30px] border-current opacity-10" /><div className="relative mt-28"><p className="font-mono-school text-[9px] font-bold uppercase tracking-[.14em] opacity-65">{p.ages}</p><h3 className="mt-3 font-display text-5xl font-bold leading-[.88]">{p.name}</h3><p className="mt-5 text-sm leading-6 opacity-75">{p.copy}</p><ul className="mt-7 grid gap-2 border-t border-current/20 pt-5 text-xs font-semibold">{p.points.map(point => <li key={point} className="flex items-center gap-2"><Check size={14} /> {point}</li>)}</ul></div></article>)}</div></div></section>
    <section className="bg-[#f4e6c9] px-5 py-20 md:py-28"><div className="page-wrap grid gap-14 lg:grid-cols-[.7fr_1.3fr]"><SectionHeading eyebrow="Beyond the timetable" title="The habits that last." copy="We make space for the whole child: the thoughtful teammate, the expressive artist, the careful observer and the steady friend." /><div className="grid gap-3 sm:grid-cols-2">{[['01', 'English communication', 'Read deeply. Speak clearly. Listen generously.'], ['02', 'Creative expression', 'Music, dance, drawing and drama as daily languages.'], ['03', 'Scientific temper', 'Questions are welcome; evidence is even better.'], ['04', 'Community spirit', 'Service, celebration and responsibility close to home.']].map(([n, t, c]) => <div key={n} className="flex gap-5 border-b border-[#202337]/15 py-5"><span className="font-mono-school text-[10px] text-[#c94b35]">{n}</span><div><h3 className="font-bold text-[#202337]">{t}</h3><p className="mt-1 text-sm leading-6 text-[#202337]/60">{c}</p></div></div>)}</div></div></section>
    <section className="bg-[#202337] px-5 py-20 text-[#f8eedc]"><div className="page-wrap flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="font-mono-school text-[10px] uppercase tracking-[.18em] text-[#e3b45b]">Ready when you are</p><h2 className="mt-4 max-w-2xl font-display text-5xl font-bold leading-[.9] md:text-7xl">Find the right<br />starting point.</h2></div><Link href="/admissions" className="inline-flex items-center gap-2 rounded-full bg-[#e3b45b] px-5 py-3.5 text-sm font-extrabold text-[#202337]" data-testid="link-academics-cta">Explore admissions <ArrowRight size={16} /></Link></div></section>
  </>;
}

function Admissions() {
  const [status, setStatus] = useState<'idle' | 'ready'>('idle');
  const [form, setForm] = useState({ student: '', parent: '', email: '', phone: '', className: '', message: '' });
  const update = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [key]: event.target.value });
  const sendEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = [
      `Namaste ${schoolContent.identity.shortName} School,`,
      '',
      'I would like to enquire about admissions.',
      '',
      `Student name: ${form.student}`,
      `Parent / guardian: ${form.parent}`,
      `Parent contact: ${form.phone}`,
      `Email: ${form.email}`,
      `Grade applying for: ${form.className}`,
      form.message.trim() ? `Message: ${form.message.trim()}` : '',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setStatus('ready');
  };
  return <>
     <PageIntro eyebrow={`Admissions · ${schoolContent.identity.academicYear}`} title={<>Start with a<br /><span className="text-[#d95340]">conversation.</span></>} copy="Choosing a school is personal. Our admissions team is here to answer the practical questions and help you picture your child’s day with us." />
     <section className="bg-[#f8eedc] px-5 py-20 md:py-28"><div className="page-wrap grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><SectionHeading eyebrow="Good to know" title="The details, made clear." copy="Keep these essentials close as you plan your next step. We look forward to meeting your family." /><div className="mt-10 grid gap-3"><InfoRow icon={<CalendarDays />} title="Registration deadlines" text={schoolContent.admissions.deadlines} /><InfoRow icon={<Clock3 />} title="Meeting hours" text={`${schoolContent.contact.meetingHours.principal} on ${schoolContent.contact.meetingHours.office}. ${schoolContent.contact.meetingHours.teachers}.`} /><InfoRow icon={<MapPin />} title="Visit the campus" text={schoolContent.contact.address} /></div></div><div className="rounded-[2rem] bg-[#f4e6c9] p-7 md:p-10"><div className="flex items-start justify-between gap-5"><div><p className="font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#c77a22]">Before you visit</p><h2 className="mt-3 font-display text-4xl font-bold text-[#202337]">Bring these along.</h2></div><div className="grid size-12 place-items-center rounded-2xl bg-[#202337] text-[#e3b45b]"><Table2 size={20} /></div></div><div className="mt-8 grid gap-3">{schoolContent.admissions.requiredDocuments.map(item => <div key={item} className="flex items-start gap-3 rounded-xl border border-[#202337]/10 bg-[#f8eedc]/70 p-3 text-sm text-[#202337]/75"><CircleCheck size={16} className="mt-0.5 shrink-0 text-[#3b7f7c]" />{item}</div>)}</div><p className="mt-6 text-xs leading-5 text-[#202337]/50">{schoolContent.admissions.visitNote}</p></div></div></section>
     <section className="bg-[#3b7f7c] px-5 py-20 text-[#f8eedc] md:py-28"><div className="page-wrap grid gap-14 lg:grid-cols-[.72fr_1.28fr]"><div><p className="font-mono-school text-[10px] uppercase tracking-[.18em] text-[#e3b45b]">Your first step</p><h2 className="mt-4 font-display text-5xl font-bold leading-[.9] md:text-7xl">Tell us a little<br />about your family.</h2><p className="mt-6 max-w-sm text-sm leading-6 text-[#f8eedc]/65">Share a few details and we’ll open WhatsApp with a ready-to-send message addressed to the school admissions team.</p></div><div className="rounded-[2rem] bg-[#f8eedc] p-6 text-[#202337] md:p-9">{status === 'ready' ? <div className="flex min-h-[410px] flex-col items-center justify-center text-center"><div className="grid size-16 place-items-center rounded-full bg-[#3b7f7c] text-[#f8eedc]"><MessageCircle size={30} /></div><h2 className="mt-6 font-display text-5xl font-bold">WhatsApp is ready.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-[#202337]/60">Your enquiry details are pre-filled in WhatsApp. Tap send there to complete your message to the school.</p><button type="button" onClick={() => setStatus('idle')} className="mt-7 font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#c94b35] underline underline-offset-4" data-testid="button-submit-another">Edit enquiry</button></div> : <form onSubmit={sendEnquiry} className="grid gap-5"><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold">Student name<input required name="student" value={form.student} onChange={update('student')} placeholder="Child's full name" className="school-input" data-testid="input-student-name" /></label><label className="grid gap-2 text-xs font-bold">Parent / guardian name<input required name="parent" value={form.parent} onChange={update('parent')} placeholder="Your full name" className="school-input" data-testid="input-parent-name" /></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold">Parent contact<input required name="phone" type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 00000 00000" className="school-input" data-testid="input-phone" /></label><label className="grid gap-2 text-xs font-bold">Email address<input required name="email" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className="school-input" data-testid="input-email" /></label></div><label className="grid gap-2 text-xs font-bold">Grade applying for<select required name="className" value={form.className} onChange={update('className')} className="school-input" data-testid="select-class"><option value="">Choose a grade</option><option>Pre-Primary</option><option>Class 1–4</option><option>Class 5–10</option></select></label><label className="grid gap-2 text-xs font-bold">Message<textarea name="message" value={form.message} onChange={update('message')} rows={4} placeholder="Tell us how we can help..." className="school-input resize-none" /></label><button type="submit" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#d95340] px-5 py-3.5 text-sm font-extrabold text-[#fff8ee] transition-transform hover:-translate-y-0.5" data-testid="button-submit-enquiry">Open WhatsApp enquiry <MessageCircle size={16} /></button><p className="text-[11px] text-[#202337]/45">Your details stay in this form until you choose to open WhatsApp. Nothing is sent to a website backend.</p></form>}</div></div></section>
  </>;
}

function InfoRow({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="flex gap-4 rounded-2xl border border-[#202337]/10 bg-[#f4e6c9] p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#202337] text-[#e3b45b]">{icon}</span><div><h3 className="text-sm font-bold text-[#202337]">{title}</h3><p className="mt-1 text-xs leading-5 text-[#202337]/60">{text}</p></div></div>;
}

function Fees() {
  return <>
     <PageIntro eyebrow={`Fees · ${schoolContent.identity.academicYear}`} title={<>A clear view<br /><span className="text-[#e3b45b]">of the year.</span></>} copy="We keep our fee structure straightforward, with quarterly planning that helps families make confident decisions." />
     <section className="bg-[#f8eedc] px-5 py-20 md:py-28"><div className="page-wrap"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><SectionHeading eyebrow="Quarterly fee comparison" title="Plan the year with ease." copy="The schedule below shows the standard academic fee by programme. Please contact the office for the latest admission and transport details." /><span className="inline-flex items-center gap-2 rounded-full bg-[#e3b45b] px-4 py-2 font-mono-school text-[10px] font-bold uppercase tracking-[.12em] text-[#202337]"><CalendarDays size={14} /> {schoolContent.identity.academicYear}</span></div><div className="mt-12 overflow-x-auto rounded-[1.7rem] border border-[#202337]/12 bg-[#f4e6c9]"><table className="w-full min-w-[720px] border-collapse text-left" data-testid="table-fees"><thead><tr className="border-b border-[#202337]/15 font-mono-school text-[10px] uppercase tracking-[.12em] text-[#202337]/55"><th className="px-6 py-5">Programme</th>{schoolContent.fees.columns.map(column => <th key={column} className={`px-4 py-5 ${column === 'Annual total' ? 'text-[#c94b35]' : ''}`}>{column}</th>)}</tr></thead><tbody>{schoolContent.fees.rows.map((row, i) => <tr key={row.programme} className={`border-b border-[#202337]/10 text-sm last:border-0 ${i === 1 ? 'bg-[#e3b45b]/20' : ''}`}><th className="px-6 py-6 font-bold">{row.programme}</th>{row.quarters.map((cell, index) => <td key={cell + index} className="px-4 py-6 text-[#202337]/65">{cell}</td>)}<td className="px-6 py-6 font-extrabold text-[#c94b35]">{row.annualTotal}</td></tr>)}</tbody></table></div><div className="mt-5 flex gap-3 text-xs leading-5 text-[#202337]/55"><span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#3b7f7c] text-[#f8eedc]"><Check size={10} /></span><p>{schoolContent.fees.note}</p></div></div></section>
    <section className="bg-[#f4e6c9] px-5 py-20 md:py-24"><div className="page-wrap grid gap-4 md:grid-cols-3"><div className="rounded-[1.7rem] bg-[#202337] p-7 text-[#f8eedc] md:col-span-2"><p className="font-mono-school text-[10px] uppercase tracking-[.16em] text-[#e3b45b]">Need a closer number?</p><h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[.95]">Our office will walk you through the full picture.</h2><Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e3b45b] px-5 py-3 text-sm font-bold text-[#202337]" data-testid="link-fees-contact">Talk to the office <ArrowRight size={15} /></Link></div><div className="rounded-[1.7rem] bg-[#d95340] p-7 text-[#fff8ee]"><HeartHandshake size={28} /><p className="mt-16 font-display text-3xl font-bold leading-none">No surprises.<br />Just support.</p></div></div></section>
  </>;
}

function Gallery() {
  const [active, setActive] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isInteracting || prefersReducedMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % galleryItems.length), GALLERY_AUTOPLAY_INTERVAL);
    return () => window.clearInterval(timer);
  }, [isInteracting]);

  const item = galleryItems[active];
  const move = (direction: number) => setActive((current) => (current + direction + galleryItems.length) % galleryItems.length);
  return <>
    <PageIntro eyebrow="A glimpse inside" title={<>Come see<br /><span className="text-[#d95340]">the feeling.</span></>} copy="A school is more than its walls. Take a small walk through the spaces, rituals and bright details that make Saraswati ours." />
    <section className="bg-[#f4e6c9] px-5 py-16 md:py-24"><div className="page-wrap"><div className="relative overflow-hidden rounded-[2rem] bg-[#202337]" role="region" aria-roledescription="carousel" aria-label="Saraswati School gallery" onMouseEnter={() => setIsInteracting(true)} onMouseLeave={() => setIsInteracting(false)} onFocusCapture={() => setIsInteracting(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsInteracting(false); }}><div className="grid min-h-[500px] md:grid-cols-[1.35fr_.65fr]"><div className="relative min-h-[330px]"><img key={item.src} src={item.src} alt={item.title} loading={active === 0 ? 'eager' : 'lazy'} fetchPriority={active === 0 ? 'high' : 'auto'} decoding="async" className="absolute inset-0 size-full object-cover opacity-85" /><div className="absolute inset-0 bg-gradient-to-r from-[#202337]/35 to-transparent" /><div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-[#f8eedc]/90 px-3 py-2 font-mono-school text-[9px] font-bold uppercase tracking-[.14em] text-[#202337] md:left-8"><span className="size-1.5 rounded-full bg-[#d95340]" /> {item.label}</div></div><div className="flex flex-col justify-between p-7 text-[#f8eedc] md:p-10"><div><span className="font-mono-school text-[10px] text-[#e3b45b]">{String(active + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</span><h2 className="mt-7 font-display text-5xl font-bold leading-[.88] md:text-6xl">{item.title}</h2><p className="mt-6 text-sm leading-6 text-[#f8eedc]/60">{item.text}</p></div><div className="mt-12 flex items-center justify-between"><div className="flex gap-2">{galleryItems.map((gallery, index) => <button type="button" key={gallery.title} onClick={() => setActive(index)} className={`h-1 rounded-full transition-all ${index === active ? 'w-10 bg-[#e3b45b]' : 'w-5 bg-[#f8eedc]/25'}`} aria-label={`Show ${gallery.title}`} data-testid={`button-gallery-dot-${index}`} />)}</div><div className="flex gap-2"><button type="button" onClick={() => move(-1)} className="grid size-11 place-items-center rounded-full border border-[#f8eedc]/20 hover:bg-[#f8eedc]/10" aria-label="Previous gallery image" data-testid="button-gallery-previous"><ChevronLeft size={18} /></button><button type="button" onClick={() => move(1)} className="grid size-11 place-items-center rounded-full bg-[#e3b45b] text-[#202337] hover:bg-[#f4c979]" aria-label="Next gallery image" data-testid="button-gallery-next"><ChevronRight size={18} /></button></div></div></div></div></div><div className="mt-14 grid gap-5 md:grid-cols-4">{galleryItems.map((gallery, index) => <button type="button" onClick={() => setActive(index)} key={gallery.title} className={`group text-left ${index === active ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} data-testid={`button-gallery-card-${index}`}><div className="aspect-[1.35] overflow-hidden rounded-2xl bg-[#3b7f7c]"><img src={gallery.src} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><p className="mt-4 font-mono-school text-[10px] font-bold uppercase tracking-[.14em] text-[#c77a22]">{gallery.label}</p><p className="mt-2 font-display text-2xl font-bold text-[#202337]">{gallery.title}</p></button>)}</div></div></section>
  </>;
}

function Contact() {
  const [mapOpen, setMapOpen] = useState(false);
  return <>
    <PageIntro eyebrow="Come by, call, write" title={<>Let's make<br /><span className="text-[#e3b45b]">it real.</span></>} copy="The best way to know Saraswati is to visit. Our office team is ready with directions, answers and a cup of time." />
     <section className="bg-[#f8eedc] px-5 py-20 md:py-28"><div className="page-wrap grid gap-14 lg:grid-cols-[.72fr_1.28fr]"><div><SectionHeading eyebrow="The school office" title="We are easy to find." copy="Reach out in the way that suits your family. We will get back to you during meeting hours." /><div className="mt-10 grid gap-5"><ContactLine icon={<MapPin />} label="Address" content={<><span>{schoolAddress}</span><a href={directionsHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 font-bold text-[#c94b35] hover:underline" data-testid="link-contact-directions">Get directions <ArrowRight size={14} /></a></>} /><ContactLine icon={<Phone />} label="Phone" content={<a href={schoolContent.contact.phoneHref} className="hover:text-[#c94b35]" data-testid="link-contact-phone">{schoolContent.contact.phone}</a>} /><ContactLine icon={<MessageCircle />} label="WhatsApp" content={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-[#c94b35]" data-testid="link-contact-whatsapp">{schoolContent.contact.whatsappDisplay}</a>} /><ContactLine icon={<Mail />} label="Email" content={<a href={`mailto:${schoolContent.contact.email}`} className="hover:text-[#c94b35]" data-testid="link-contact-email">{schoolContent.contact.email}</a>} /><ContactLine icon={<Clock3 />} label="Meeting hours" content={<>{schoolContent.contact.meetingHours.principal}<br />{schoolContent.contact.meetingHours.office}</>} /></div></div><div><div className={`relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#d9c59b] ${mapOpen ? 'ring-4 ring-[#e3b45b]' : ''}`}><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(30deg, #3b7f7c 12%, transparent 12.5%, transparent 87%, #3b7f7c 87.5%, #3b7f7c), linear-gradient(150deg, #3b7f7c 12%, transparent 12.5%, transparent 87%, #3b7f7c 87.5%, #3b7f7c), linear-gradient(30deg, #3b7f7c 12%, transparent 12.5%, transparent 87%, #3b7f7c 87.5%, #3b7f7c), linear-gradient(150deg, #3b7f7c 12%, transparent 12.5%, transparent 87%, #3b7f7c 87.5%, #3b7f7c)', backgroundPosition: '0 0, 0 0, 20px 35px, 20px 35px', backgroundSize: '40px 70px' }} /><div className="absolute inset-0 bg-[#f4e6c9]/40" /><div className="absolute left-[58%] top-[37%] grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#fff8ee]/80 bg-[#d95340] text-[#fff8ee] shadow-xl"><MapPin size={29} fill="currentColor" /></div><div className="absolute bottom-0 left-0 right-0 flex flex-col justify-between gap-4 bg-[#202337]/95 p-6 text-[#f8eedc] sm:flex-row sm:items-end"><div><p className="font-mono-school text-[9px] uppercase tracking-[.14em] text-[#e3b45b]">School location</p><p className="mt-2 font-display text-2xl font-bold">{schoolContent.identity.name}</p><p className="mt-1 text-xs text-[#f8eedc]/55">{schoolContent.contact.shortAddress}</p></div><div className="flex flex-wrap gap-2"><a href={directionsHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#e3b45b] px-4 py-2 text-xs font-bold text-[#202337]" data-testid="link-map-directions">Navigate <ArrowRight size={14} /></a><button type="button" onClick={() => setMapOpen(!mapOpen)} className="inline-flex items-center gap-2 rounded-full border border-[#f8eedc]/20 px-4 py-2 text-xs font-bold hover:bg-white/10" data-testid="button-map-toggle">{mapOpen ? 'Close preview' : 'Open preview'} <ChevronDown size={14} className={mapOpen ? 'rotate-180' : ''} /></button></div></div></div><p className="mt-4 text-xs leading-5 text-[#202337]/50">Use Navigate to open Google Maps with this school address already selected.</p></div></div></section>
     <section className="bg-[#e3b45b] px-5 py-16"><div className="page-wrap flex flex-col justify-between gap-7 md:flex-row md:items-center"><div><p className="font-mono-school text-[10px] uppercase tracking-[.16em] text-[#202337]/60">Stay in the loop</p><h2 className="mt-3 font-display text-4xl font-bold text-[#202337]">Follow our school days.</h2></div><div className="flex flex-wrap gap-3"><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#202337] px-5 py-3 text-sm font-bold text-[#f8eedc]" data-testid="link-contact-whatsapp-cta"><MessageCircle size={16} /> WhatsApp</a><a href={schoolContent.contact.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#202337]/25 px-5 py-3 text-sm font-bold text-[#202337]" data-testid="link-contact-instagram"><Instagram size={16} /> Instagram</a><a href={schoolContent.contact.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#202337]/25 text-[#202337] px-5 py-3 text-sm font-bold" data-testid="link-contact-facebook">Facebook</a><a href={schoolContent.contact.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-[#202337]/25 px-5 py-3 text-sm font-bold text-[#202337]" data-testid="link-contact-call"><Phone size={15} /> Call now</a></div></div></section>
  </>;
}

function ContactLine({ icon, label, content }: { icon: ReactNode; label: string; content: ReactNode }) {
  return <div className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#202337] text-[#e3b45b]">{icon}</span><div><p className="font-mono-school text-[10px] font-bold uppercase tracking-[.14em] text-[#c77a22]">{label}</p><div className="mt-1 text-sm leading-6 text-[#202337]/70">{content}</div></div></div>;
}

function MandatoryDisclosure() {
  const documentSections = schoolContent.mandatoryDisclosure.documentSections;
  const [generalInformation, staffTeaching, schoolInfrastructure] = schoolContent.mandatoryDisclosure.sections;
  return <>
     <PageIntro eyebrow="For transparency" title={<>Mandatory<br /><span className="text-[#e3b45b]">Disclosure.</span></>} copy="Important school information, shared clearly for families and the wider school community." />
     <section className="bg-[#f4e6c9] px-5 py-20 md:py-28"><div className="page-wrap"><SectionHeading eyebrow="A–C · School information and records" title="School records, ready to view." copy="Published documents are managed by the school office. Any record without an uploaded PDF remains marked as pending." /><div className="mt-12 grid gap-12"><DisclosureSection section={generalInformation} />{documentSections.map(section => <DisclosureDocumentSection key={section.code} section={section} />)}</div></div></section>
      <AnnualAcademicCalendar />
      <section className="bg-[#f8eedc] px-5 py-20 md:py-28"><div className="page-wrap"><SectionHeading eyebrow="D–E · People and place" title="The essentials, in one place." copy={`${schoolContent.identity.name} is a ${schoolContent.identity.board} school managed by the ${schoolContent.identity.management}.`} /><div className="mt-12 grid gap-10"><DisclosureSection section={staffTeaching} /><DisclosureSection section={schoolInfrastructure} /></div></div></section>
     <section className="bg-[#3b7f7c] px-5 py-20 text-[#f8eedc]"><div className="page-wrap grid gap-8 md:grid-cols-3">{schoolContent.disclosureHighlights.map(([title, copy]) => <div key={title} className="border-t border-[#f8eedc]/25 pt-5"><p className="font-mono-school text-[10px] uppercase tracking-[.14em] text-[#e3b45b]">{title}</p><p className="mt-5 font-display text-3xl font-bold leading-none">{copy}</p></div>)}</div></section>
  </>;
}

function AnnualAcademicCalendar() {
  const { academicCalendar } = schoolContent.mandatoryDisclosure;
  return (
    <section className="bg-[#e3b45b] px-5 py-20 md:py-28" aria-labelledby="annual-academic-calendar">
      <div className="page-wrap">
        <SectionHeading eyebrow="Annual academic calendar" title={academicCalendar.title} copy={academicCalendar.copy} />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {academicCalendar.documents.map((document, index) => (
            <article key={document.title} className="rounded-[1.7rem] bg-[#f8eedc] p-6 text-[#202337]">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#202337] text-[#e3b45b]"><CalendarDays size={18} /></span>
                <span className="font-mono-school text-[10px] font-bold text-[#c94b35]">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h2 id={index === 0 ? 'annual-academic-calendar' : undefined} className="mt-8 font-display text-3xl font-bold leading-none">{document.title}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-[#202337]/60">{document.description}</p>
              <div className="mt-6 border-t border-[#202337]/10 pt-4">
                <p className="mb-1 font-mono-school text-[9px] font-bold uppercase tracking-[.1em] text-[#c77a22]">Uploaded document link (PDF)</p>
                <DocumentLink document={document} index={index} section="Calendar" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type DisclosureDocumentSectionData = { code: string; title: string; documents: readonly { title: string; file: string }[] };

function DisclosureDocumentSection({ section }: { section: DisclosureDocumentSectionData }) {
  return <section aria-labelledby={`document-section-${section.code.toLowerCase()}`}><h2 id={`document-section-${section.code.toLowerCase()}`} className="mb-5 rounded-xl bg-[#202337] px-5 py-4 font-mono-school text-base font-bold uppercase tracking-[.08em] text-[#f8eedc] sm:text-lg">{section.code}. {section.title}</h2><div className="overflow-hidden rounded-[1.7rem] border border-[#202337]/12 bg-[#f8eedc]"><div className="hidden overflow-x-auto md:block"><table className="w-full border-collapse text-left"><thead><tr className="border-b border-[#202337]/15 bg-[#202337]/5 font-mono-school text-xs font-bold uppercase tracking-[.1em] text-[#202337]/70"><th className="w-20 px-5 py-4">SL No.</th><th className="px-5 py-4">Documents / Information</th><th className="w-64 px-5 py-4">Uploaded Document Link (PDF)</th></tr></thead><tbody>{section.documents.map((document, index) => <tr key={document.title} className="border-b border-[#202337]/10 last:border-0"><td className="px-5 py-5 align-top font-mono-school text-sm font-bold text-[#c77a22]">{index + 1}</td><th scope="row" className="px-5 py-5 text-base font-bold leading-6 text-[#202337]">{document.title}</th><td className="px-5 py-5 align-top"><DocumentLink document={document} index={index} section={section.code} /></td></tr>)}</tbody></table></div><div className="grid gap-3 p-3 md:hidden">{section.documents.map((document, index) => <div key={document.title} className="rounded-2xl border border-[#202337]/10 bg-[#f4e6c9] p-4"><div className="flex items-start gap-3"><span className="font-mono-school text-sm font-bold text-[#c77a22]">{String(index + 1).padStart(2, '0')}</span><p className="min-w-0 flex-1 text-base font-bold leading-6 text-[#202337]">{document.title}</p></div><div className="mt-3 border-t border-[#202337]/10 pt-3"><p className="mb-1 font-mono-school text-[10px] font-bold uppercase tracking-[.1em] text-[#c77a22]">Uploaded document link (PDF)</p><DocumentLink document={document} index={index} section={section.code} /></div></div>)}</div></div></section>;
}

function DocumentLink({ document, index, section }: { document: { title: string; file: string }; index: number; section: string }) {
  return document.file ? <span className="flex flex-wrap gap-x-4 gap-y-2"><a href={document.file} target="_blank" rel="noopener noreferrer" className="font-bold uppercase text-[#3b5794] underline decoration-1 underline-offset-2 hover:text-[#c94b35]" data-testid={`link-disclosure-pdf-${section}-${index}`}>[View PDF]</a><a href={document.file} download className="font-bold uppercase text-[#3b5794] underline decoration-1 underline-offset-2 hover:text-[#c94b35]" data-testid={`download-disclosure-pdf-${section}-${index}`}>[Download]</a></span> : <span className="font-bold uppercase text-[#202337]/40" data-testid={`status-disclosure-pdf-${section}-${index}`}>[PDF pending]</span>;
}

type DisclosureTableSectionData = { code: string; title: string; rows: readonly (readonly [string, string])[] };

function DisclosureSection({ section }: { section: DisclosureTableSectionData }) {
  const headingId = `disclosure-${section.code.toLowerCase()}-${section.title.toLowerCase().replace(/\s+/g, '-')}`;
  return <section aria-labelledby={headingId}><h2 id={headingId} className="font-display text-4xl font-bold text-[#202337] md:text-5xl">{section.code}. {section.title}</h2><div className="mt-6 hidden overflow-hidden rounded-[1.7rem] border border-[#202337]/12 bg-[#f4e6c9] md:block"><table className="w-full border-collapse text-left"><thead><tr className="border-b border-[#202337]/15 bg-[#202337] font-mono-school text-xs font-bold uppercase tracking-[.12em] text-[#f8eedc]"><th className="w-20 px-5 py-4">Sr. No.</th><th className="px-5 py-4">Document / Information</th><th className="px-5 py-4">Details</th></tr></thead><tbody>{section.rows.map(([label, detail], index) => <tr key={label} className="border-b border-[#202337]/10 last:border-0"><td className="px-5 py-4 font-mono-school text-sm font-bold text-[#c77a22]">{index + 1}</td><th scope="row" className="px-5 py-4 text-base font-bold text-[#202337]">{label}</th><td className="px-5 py-4 text-base font-medium leading-7 text-[#202337]/70"><DisclosureDetail label={label} detail={detail} /></td></tr>)}</tbody></table></div><div className="mt-6 grid gap-3 md:hidden">{section.rows.map(([label, detail], index) => <div key={label} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-2xl border border-[#202337]/10 bg-[#f4e6c9] p-4"><span className="font-mono-school text-sm font-bold text-[#c77a22]">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><p className="font-mono-school text-xs font-bold uppercase leading-5 tracking-[.06em] text-[#202337]">{label}</p><p className="mt-1 break-words text-base font-bold leading-7 text-[#202337]/75"><DisclosureDetail label={label} detail={detail} /></p></div></div>)}</div></section>;
}

function DisclosureDetail({ label, detail }: { label: string; detail: string }) {
  if (label !== 'CBSE Inspection Video') return detail;
  return detail ? (
    <a href={detail} target="_blank" rel="noopener noreferrer" className="font-bold text-[#3b5794] underline decoration-1 underline-offset-2 hover:text-[#c94b35]">View inspection video</a>
  ) : (
    <span className="inline-block min-h-5 min-w-44 border-b border-[#202337]/25" aria-label="CBSE inspection video link space">&nbsp;</span>
  );
}

function DirectionPage({ page }: { page: 'vision' | 'mission' }) {
  const content = schoolContent[page];
  const otherPage = page === 'vision' ? 'mission' : 'vision';
  const otherLabel = page === 'vision' ? 'Read our mission' : 'Read our vision';

  return <>
    <PageIntro eyebrow={content.eyebrow} title={content.title} copy={content.intro}>
      <Link href={`/${otherPage}`} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#e3b45b] hover:text-[#f8eedc]" data-testid={`link-${page}-switch`}>
        {otherLabel} <ArrowRight size={16} />
      </Link>
    </PageIntro>
    <section className="bg-[#f8eedc] px-5 py-20 md:py-28">
      <div className="page-wrap grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
        <SectionHeading eyebrow="What guides us" title={content.promiseTitle} copy={content.promiseCopy} />
        <div className="grid gap-4">
          {content.pillars.map(([number, title, copy], index) => (
            <article key={number} className={`relative overflow-hidden rounded-[1.7rem] p-7 md:p-8 ${index === 0 ? 'bg-[#e3b45b] text-[#202337]' : index === 1 ? 'bg-[#3b7f7c] text-[#f8eedc]' : 'bg-[#d95340] text-[#fff8ee]'}`}>
              <div className="absolute -right-10 -top-12 size-40 rounded-full border-[24px] border-current opacity-15" />
              <div className="relative">
                <span className="font-mono-school text-[10px] font-bold opacity-65">{number}</span>
                <h2 className="mt-12 max-w-md font-display text-4xl font-bold leading-[.95] md:text-5xl">{title}</h2>
                <p className="mt-4 max-w-lg text-sm leading-6 opacity-75">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    <section className="bg-[#202337] px-5 py-20 text-[#f8eedc] md:py-24">
      <div className="page-wrap flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="font-mono-school text-[10px] font-bold uppercase tracking-[.18em] text-[#e3b45b]">A school with heart</p>
          <h2 className="mt-4 max-w-2xl font-display text-5xl font-bold leading-[.9] md:text-7xl">Come see these values in action.</h2>
        </div>
        <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#e3b45b] px-5 py-3.5 text-sm font-extrabold text-[#202337]" data-testid={`link-${page}-contact`}>Visit the school <ArrowRight size={16} /></Link>
      </div>
    </section>
  </>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/academics" component={Academics} /><Route path="/admissions" component={Admissions} /><Route path="/fees" component={Fees} /><Route path="/gallery" component={Gallery} /><Route path="/vision"><DirectionPage page="vision" /></Route><Route path="/mission"><DirectionPage page="mission" /></Route><Route path="/contact" component={Contact} /><Route path="/mandatory-disclosure" component={MandatoryDisclosure} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  useEffect(() => {
    document.title = schoolContent.identity.name;
    const metaContent = [
      ['meta[name="description"]', schoolContent.identity.metaDescription],
      ['meta[property="og:title"]', schoolContent.identity.name],
      ['meta[property="og:description"]', schoolContent.identity.ogDescription],
      ['meta[name="twitter:title"]', schoolContent.identity.name],
      ['meta[name="twitter:description"]', schoolContent.identity.ogDescription],
    ] as const;
    metaContent.forEach(([selector, content]) => {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
    });
  }, []);
  return <TooltipProvider><div className="font-sans"><RoutedErrorBoundary><SiteShell><Router /></SiteShell></RoutedErrorBoundary></div><Toaster /></TooltipProvider>;
}

export default App;