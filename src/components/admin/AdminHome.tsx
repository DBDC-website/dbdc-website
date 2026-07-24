'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Building2, ClipboardList, Users } from 'lucide-react';
import { cinematicEase, easeOut } from '@/lib/motion';
import type { AdminDashboardStats } from '@/lib/admin/dashboard';

type AdminHomeProps = {
  email: string;
  stats: AdminDashboardStats;
};

const DESTINATIONS = [
  {
    id: 'projects',
    href: '/admin/projects',
    title: 'Projects',
    description:
      'Publish portfolio entries, upload images, and control what appears on the public site.',
    icon: Building2,
    accent: 'from-brand-800 to-brand-950',
    glow: 'bg-brand-700/15',
    statKey: 'projects' as const,
    cta: 'Manage projects',
  },
  {
    id: 'committees',
    href: '/admin/committees',
    title: 'Committees',
    description:
      'Keep commission and committee membership current — roles, order, and visibility.',
    icon: Users,
    accent: 'from-[#5c4a2a] to-brand-900',
    glow: 'bg-gold-500/20',
    statKey: 'committees' as const,
    cta: 'Manage members',
  },
  {
    id: 'registrations',
    href: '/admin/registrations',
    title: 'Registrations',
    description:
      'Review consultant and contractor applications, documents, and approval status.',
    icon: ClipboardList,
    accent: 'from-brand-700 to-[#1e3a5f]',
    glow: 'bg-brand-600/15',
    statKey: 'registrations' as const,
    cta: 'Review submissions',
  },
] as const;

function formatStat(
  key: (typeof DESTINATIONS)[number]['statKey'],
  stats: AdminDashboardStats,
): { primary: string; secondary: string } {
  switch (key) {
    case 'projects':
      return {
        primary: String(stats.projectsTotal),
        secondary: `${stats.projectsPublished} published`,
      };
    case 'committees':
      return {
        primary: String(stats.membersTotal),
        secondary: `${stats.membersActive} active`,
      };
    case 'registrations':
      return {
        primary: String(stats.registrationsTotal),
        secondary: `${stats.registrationsPending} pending`,
      };
  }
}

export default function AdminHome({ email, stats }: AdminHomeProps) {
  const reduceMotion = useReducedMotion();
  const name = email.split('@')[0] ?? 'there';

  return (
    <div className="relative">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] overflow-hidden"
      >
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold-400/25 blur-3xl" />
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-brand-700/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
      </div>

      {/* Hero */}
      <motion.section
        className="pb-10 pt-2 sm:pb-14"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: cinematicEase }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
          Diocesan Building Development Commission
        </p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-tight text-brand-950 sm:text-5xl">
          Welcome back,{' '}
          <span className="text-brand-800">{name}</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
          Content and registrations for the DBDC site.
        </p>
      </motion.section>

      {/* Destination sections */}
      <div className="space-y-8 pb-6 sm:space-y-10">
        {DESTINATIONS.map((item, index) => {
          const Icon = item.icon;
          const { primary, secondary } = formatStat(item.statKey, stats);

          return (
            <motion.section
              key={item.id}
              id={`section-${item.id}`}
              className="scroll-mt-24"
              initial={reduceMotion ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.85,
                delay: reduceMotion ? 0 : index * 0.05,
                ease: easeOut,
              }}
            >
              <Link
                href={item.href}
                className="group relative block overflow-hidden rounded-2xl border border-cream-200/90 bg-white shadow-sm shadow-brand-900/[0.04] transition duration-500 hover:-translate-y-1 hover:border-gold-300/80 hover:shadow-lg hover:shadow-brand-900/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <div
                  aria-hidden
                  className={`absolute -right-16 -top-16 h-56 w-56 rounded-full ${item.glow} blur-2xl transition duration-500 group-hover:scale-110`}
                />
                <div className="relative grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-end sm:p-8 lg:p-10">
                  <div>
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-md`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h2 className="mt-5 font-serif text-3xl font-semibold text-brand-950 sm:text-4xl">
                      {item.title}
                    </h2>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-stone-600 sm:text-base">
                      {item.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-800 transition group-hover:gap-3">
                      {item.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>

                  <div className="rounded-xl border border-cream-200 bg-cream-50/80 px-5 py-4 text-right sm:min-w-[9.5rem]">
                    <p className="font-serif text-4xl font-semibold tabular-nums text-brand-950">
                      {primary}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500">
                      {secondary}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
