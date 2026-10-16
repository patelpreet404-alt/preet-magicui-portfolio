"use client";

import { useEffect, useState } from 'react';
import { ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { ONLINE_PROFILES, type OnlinePresenceStats } from '@/data/online-presence';
import styles from './online-presence-section.module.css';

type OnlineProfile = (typeof ONLINE_PROFILES)[number];

function ProfileMark({ id }: { id: OnlineProfile['id'] }) {
  if (id === 'github') return <Github size={21} strokeWidth={1.8} aria-hidden="true" />;
  if (id === 'linkedin') return <Linkedin size={21} strokeWidth={1.8} aria-hidden="true" />;
  return <span aria-hidden="true">{id === 'leetcode' ? 'LC' : 'NC'}</span>;
}

function SolvedBreakdown({ easy, medium, hard, solved }: { easy: number; medium: number; hard: number; solved: number }) {
  const total = Math.max(solved, 1);
  return (
    <span className={styles.breakdown}>
      <span className={styles.difficulty}>{easy} Easy <span aria-hidden="true">·</span> {medium} Medium <span aria-hidden="true">·</span> {hard} Hard</span>
      <span className={styles.distribution} aria-hidden="true">
        <span className={styles.easySegment} style={{ width: `${easy / total * 100}%` }} />
        <span className={styles.mediumSegment} style={{ width: `${medium / total * 100}%` }} />
        <span className={styles.hardSegment} style={{ width: `${hard / total * 100}%` }} />
      </span>
    </span>
  );
}

function ProfileCard({ profile, stats, loading }: { profile: OnlineProfile; stats: OnlinePresenceStats | null; loading: boolean }) {
  const leetcode = stats?.leetcode;
  const neetcode = stats?.neetcode;
  const contributions = stats?.github.contributions;
  const publicRepos = stats?.github.publicRepos;
  const rowValue = profile.id === 'neetcode' ? neetcode?.solved : profile.id === 'github' ? contributions : null;
  const rowLabel = profile.id === 'neetcode' ? 'solved' : 'contributions';
  const description = profile.id === 'neetcode' && neetcode
    ? `${neetcode.easy} Easy · ${neetcode.medium} Medium · ${neetcode.hard} Hard`
    : profile.id === 'github' && publicRepos !== null && publicRepos !== undefined
      ? `${publicRepos.toLocaleString()} public repositories`
      : profile.description;

  return (
    <li>
      <a
        className={`${styles.card} ${profile.featured ? styles.featured : styles.compact} ${styles[profile.accent]}`}
        href={profile.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit Preet Patel on ${profile.name} (opens in a new tab)`}
      >
        <span className={styles.mark}><ProfileMark id={profile.id} /></span>
        <span className={styles.identity}>
          <strong>{profile.name}</strong>
          <span className={styles.handle}>{profile.handle}</span>
          <span className={styles.description}>{description}</span>
          {profile.featured && (
            <span className={styles.featureMetrics}>
              {leetcode ? (
                <>
                  <span className={styles.primaryMetric}><strong>{leetcode.solved.toLocaleString()}</strong><span>problems solved</span></span>
                  <SolvedBreakdown {...leetcode} />
                </>
              ) : <span className={styles.metricFallback}>{loading ? 'Loading live stats…' : 'Live stats unavailable'}</span>}
            </span>
          )}
        </span>
        {!profile.featured && (
          <span className={styles.rowMetric}>
            {profile.id === 'linkedin' ? (
              <><strong>{profile.connectionCount}</strong><span>connections</span></>
            ) : rowValue !== null && rowValue !== undefined ? (
              <><strong>{rowValue.toLocaleString()}</strong><span>{rowLabel}</span></>
            ) : <span className={styles.metricFallback}>{loading ? 'Updating…' : 'Stats unavailable'}</span>}
          </span>
        )}
        <span className={styles.action} aria-hidden="true">
          <span>{profile.featured ? 'View profile' : 'Visit'}</span>
          <ArrowUpRight size={19} strokeWidth={1.7} />
        </span>
      </a>
    </li>
  );
}

export default function OnlinePresenceSection() {
  const [stats, setStats] = useState<OnlinePresenceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch('/api/online-presence', { cache: 'no-store' });
        if (!response.ok) throw new Error('Profile statistics could not be loaded');
        const nextStats = await response.json() as OnlinePresenceStats;
        if (active) setStats(nextStats);
      } catch {
        if (active) setStats(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    const refresh = window.setInterval(() => { if (!document.hidden) void load(); }, 15 * 60 * 1000);
    return () => { active = false; window.clearInterval(refresh); };
  }, []);

  return (
    <section id="online-presence" className={styles.section} aria-labelledby="online-presence-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="online-presence-heading">Online Presence</h2>
          <span className={styles.rule} aria-hidden="true" />
          <p>Explore my code, coding practice, and professional background.</p>
        </header>
        <ul className={styles.cards}>
          {ONLINE_PROFILES.map((profile) => <ProfileCard key={profile.id} profile={profile} stats={stats} loading={loading} />)}
        </ul>
        <p className={styles.sourceNote}>Coding and GitHub counts come from public profiles and refresh about every 15 minutes. LinkedIn connections are self-reported.</p>
      </div>
    </section>
  );
}
