'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  BookOpenCheck, BriefcaseBusiness, ChartNoAxesCombined, ChevronDown, ChevronLeft, ChevronRight,
  Code2, Cpu, FileSearch, Flag, GraduationCap, Infinity,
  Landmark, Rocket, ShieldCheck, Trophy, type LucideIcon
} from 'lucide-react';
import { useMotionSettings } from '@/components/motion-settings';
import { JOURNEY_BEYOND, JOURNEY_MILESTONES, type JourneyIcon, type JourneyMilestone } from '@/data/journey';
import styles from './journey-section.module.css';

const ICONS: Record<JourneyIcon, LucideIcon> = {
  graduation: GraduationCap,
  code: Code2,
  university: Landmark,
  trophy: Trophy,
  brain: BookOpenCheck,
  search: FileSearch,
  cpu: Cpu,
  chart: ChartNoAxesCombined,
  briefcase: BriefcaseBusiness,
  shield: ShieldCheck,
  rocket: Rocket,
  infinity: Infinity,
  flag: Flag
};

interface JourneyChapter {
  id: string;
  milestoneIds: readonly string[];
  title?: string;
  dateLabel?: string;
  category?: string;
  description?: string;
}

const CHAPTERS: readonly JourneyChapter[] = [
  {
    id: 'school', milestoneIds: ['foundation', 'computer-science'],
    title: 'From Foundations to Computer Science', dateLabel: 'APR 2019 — MAR 2023', category: 'Education',
    description: 'My school years in Saudi Arabia built a foundation in mathematics, science, and programming.'
  },
  { id: 'dtu', milestoneIds: ['dtu'] },
  { id: 'hackathon', milestoneIds: ['hackathon'] },
  {
    id: 'ai-projects', milestoneIds: ['learning-apps', 'rag'],
    title: 'Building with Applied AI', dateLabel: 'DURING B.TECH', category: 'Software Engineering & AI',
    description: 'Built learning and research tools using full-stack development, document retrieval, and generative AI.'
  },
  {
    id: 'systems-data', milestoneIds: ['compiler', 'data'],
    title: 'Systems and Data', dateLabel: 'DURING B.TECH', category: 'Engineering & Analytics',
    description: 'Explored compiler internals alongside predictive modeling, customer behavior, and analytics.'
  },
  { id: 'rang', milestoneIds: ['rang'] },
  { id: 'research', milestoneIds: ['research'] },
  { id: 'product-thinking', milestoneIds: ['product-thinking'] },
  { id: 'current', milestoneIds: ['current'] },
  { id: 'next', milestoneIds: ['next'] }
];

const MILESTONES_BY_ID = new Map(JOURNEY_MILESTONES.map((milestone) => [milestone.id, milestone]));

function MilestoneDetails({ milestone }: { milestone: JourneyMilestone }) {
  return (
    <>
      {milestone.projects && (
        <div className={styles.projects} aria-label={milestone.projects.length === 1 ? 'Featured project' : 'Featured projects'}>
          {milestone.projects.map((project) => <span key={project}>{project}</span>)}
        </div>
      )}
      {milestone.highlights && (
        <ul className={styles.highlights} aria-label="Highlights">
          {milestone.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
      )}
      {milestone.technologies && (
        <ul className={styles.technologies} aria-label={milestone.id === 'current' ? 'Current focus' : 'Technologies'}>
          {milestone.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      )}
    </>
  );
}

function JourneyCard({ chapter, index, active, revealed }: {
  chapter: JourneyChapter;
  index: number;
  active: boolean;
  revealed: boolean;
}) {
  const milestones = chapter.milestoneIds.map((id) => MILESTONES_BY_ID.get(id)!);
  const main = milestones[0];
  const grouped = milestones.length > 1;
  const Icon = ICONS[main.icon];
  const hasDetails = grouped || Boolean(main.projects || main.highlights || main.technologies);

  return (
    <li className={`${styles.milestone} ${styles[main.state]} ${index % 2 === 0 ? styles.left : styles.right} ${active ? styles.current : ''} ${revealed ? styles.revealed : ''}`} data-journey-milestone>
      <article className={styles.card} aria-labelledby={`journey-title-${chapter.id}`}>
        <div className={styles.cardCover} aria-hidden="true">
          <span className={styles.coverNumber}>{String(index + 1).padStart(2, '0')}</span>
          <span className={`${styles.marker} ${active ? styles.activeMarker : ''}`}>
            <Icon size={19} strokeWidth={1.6} />
          </span>
          <span className={styles.coverLabel}>Chapter {String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.date}>{chapter.dateLabel ?? main.dateLabel}</span>
          <div className={styles.categoryRow}>
            <span className={styles.category}>{chapter.category ?? main.category}</span>
            {main.status && <span className={styles.status}>{main.status}</span>}
          </div>
          <h3 id={`journey-title-${chapter.id}`}>{chapter.title ?? main.title}</h3>
          {!grouped && main.organization && (
            <p className={styles.organization}>{main.organization}{main.location && <span> · {main.location}</span>}</p>
          )}
          <p className={styles.description}>{chapter.description ?? main.description}</p>
          {grouped && (
            <ul className={styles.chapterTopics} aria-label="Chapters included">
              {milestones.map((milestone) => <li key={milestone.id}>{milestone.projects?.[0] ?? milestone.title}</li>)}
            </ul>
          )}
          {hasDetails && (
            <details className={styles.chapterDetails}>
              <summary><span>Explore chapter details</span><ChevronDown size={15} aria-hidden="true" /></summary>
              <div className={styles.chapterContent}>
                {milestones.map((milestone) => (
                  <div className={styles.chapterEntry} key={milestone.id}>
                    {grouped && (
                      <>
                        <span className={styles.entryDate}>{milestone.dateLabel}</span>
                        <h4>{milestone.title}</h4>
                        {milestone.organization && <p className={styles.organization}>{milestone.organization}{milestone.location && <span> · {milestone.location}</span>}</p>}
                        <p className={styles.entryDescription}>{milestone.description}</p>
                      </>
                    )}
                    <MilestoneDetails milestone={milestone} />
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      </article>
    </li>
  );
}

export default function JourneySection() {
  const { reducedMotion } = useMotionSettings();
  const viewportRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [observing, setObserving] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    const viewport = viewportRef.current;
    const items = timelineRef.current?.querySelectorAll<HTMLElement>('[data-journey-milestone]');
    if (!viewport || !items) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const chapter = CHAPTERS[Array.from(items).indexOf(entry.target as HTMLElement)];
        if (chapter) setRevealed((current) => new Set(current).add(chapter.id));
        observer.unobserve(entry.target);
      }
    }, { root: viewport, threshold: 0.1 });
    items.forEach((item) => observer.observe(item));
    const frame = window.requestAnimationFrame(() => setObserving(true));
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      const position = maxScroll > 0 ? viewport.scrollLeft / maxScroll : 0;
      setActiveIndex(Math.round(position * (CHAPTERS.length - 1)));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    schedule();
    viewport.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(viewport);
    return () => {
      viewport.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const moveToChapter = (index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    viewport.scrollTo({
      left: maxScroll * Math.max(0, Math.min(index, CHAPTERS.length - 1)) / (CHAPTERS.length - 1),
      behavior: reducedMotion ? 'instant' : 'smooth'
    });
  };

  const handleTimelineKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); moveToChapter(activeIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveToChapter(activeIndex - 1); }
  };

  return (
    <section id="journey" className={styles.section} aria-labelledby="journey-heading">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>The story so far</p>
        <h2 id="journey-heading">My Journey<span>.</span></h2>
        <p className={styles.lead}>From curious beginnings to building intelligent systems — a timeline of learning, creating, and growing.</p>
        <p className={styles.introText}>My journey began in Saudi Arabia, took me to Delhi Technological University, and evolved into a passion for software engineering, artificial intelligence, and solving real-world problems.</p>
        <p className={styles.dateNote}>Project chapters marked “During B.Tech” are grouped by theme; their exact dates and order are not documented.</p>
      </header>

      <div className={styles.timelineControls}>
        <div>
          <span className={styles.position}>{String(activeIndex + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}</span>
          <p>Ten chapters, one story. Swipe or use the arrows to explore.</p>
        </div>
        <div className={styles.arrowControls}>
          <button type="button" aria-label="Previous journey chapter" disabled={activeIndex === 0} onClick={() => moveToChapter(activeIndex - 1)}><ChevronLeft size={20} aria-hidden="true" /></button>
          <button type="button" aria-label="Next journey chapter" disabled={activeIndex === CHAPTERS.length - 1} onClick={() => moveToChapter(activeIndex + 1)}><ChevronRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
      <div ref={viewportRef} className={styles.timelineViewport} role="region" aria-label="My journey, scroll horizontally" tabIndex={0} onKeyDown={handleTimelineKeyDown}>
        <ol
          ref={timelineRef}
          className={`${styles.timeline} ${observing && !reducedMotion ? styles.observing : ''}`}
          aria-label="My journey timeline"
        >
          {CHAPTERS.map((chapter, index) => (
            <JourneyCard key={chapter.id} chapter={chapter} index={index} active={activeIndex === index} revealed={revealed.has(chapter.id) || reducedMotion} />
          ))}
        </ol>
      </div>
      <div className={styles.chapterPagination} aria-label="Journey chapters">
        {CHAPTERS.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            aria-label={`Go to chapter ${index + 1}: ${chapter.title ?? MILESTONES_BY_ID.get(chapter.milestoneIds[0])!.title}`}
            aria-current={activeIndex === index ? 'step' : undefined}
            onClick={() => moveToChapter(index)}
          ><span /></button>
        ))}
      </div>

      <div className={styles.beyond}>
        <div className={styles.beyondHeading}>
          <span className={styles.beyondLine} aria-hidden="true" />
          <h3>Beyond the Code</h3>
        </div>
        <div className={styles.beyondGrid}>
          {JOURNEY_BEYOND.map((item) => (
            <div className={styles.beyondItem} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className={styles.closing}>
        <span className={styles.closingRule} aria-hidden="true" />
        <h3>Still Writing My Story.</h3>
        <p>Every project, challenge, and experience has shaped the engineer I&apos;m becoming. And the most exciting chapters are still ahead.</p>
        <span className={styles.continuation} aria-hidden="true"><span /><span /><span /></span>
      </footer>
    </section>
  );
}
