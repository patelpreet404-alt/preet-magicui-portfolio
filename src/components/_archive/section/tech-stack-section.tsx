import Image from 'next/image';
import {
  Braces, Boxes, Code2, Database, GitBranch,
  Network, ScanSearch, Sparkles,
  type LucideIcon
} from 'lucide-react';
import { DATA } from '@/data/resume';
import styles from './tech-stack-section.module.css';

const BRAND_ICONS: Record<string, string> = {
  TypeScript: 'typescript', React: 'react', 'Next.js': 'nextjs',
  Python: 'python', FastAPI: 'fastapi', Flask: 'flask',
  PostgreSQL: 'postgresql', Supabase: 'supabase',
  'Scikit-learn': 'scikitlearn',
  'C++17': 'cplusplus', 'LLVM IR': 'llvm',
  Docker: 'docker', Git: 'git'
};

const CONCEPT_ICONS: Record<string, LucideIcon> = {
  SQL: Database, RAG: ScanSearch, LangChain: GitBranch,
  FAISS: Boxes, Gemini: Sparkles, Flex: Braces, Bison: Network
};

const LIGHT_MARKS = new Set(['Next.js', 'Flask']);

function SkillBadge({ name }: { name: string }) {
  const brand = BRAND_ICONS[name];
  const Icon = CONCEPT_ICONS[name] ?? Code2;

  return (
    <li className={styles.skill} title={name}>
      <span className={styles.circle}>
        {brand ? (
          <Image
            src={`/tech-icons/${brand}.svg`}
            width={30}
            height={30}
            alt=""
            aria-hidden="true"
            unoptimized
            className={LIGHT_MARKS.has(name) ? styles.lightMark : undefined}
          />
        ) : <Icon size={27} strokeWidth={1.7} aria-hidden="true" />}
      </span>
      <span className={styles.label}>{name}</span>
    </li>
  );
}

export default function TechStackSection() {
  return (
    <section id="skills" className={styles.section} aria-labelledby="tech-stack-heading">
      <header className={styles.header}>
        <h2 id="tech-stack-heading">Tech Stack</h2>
        <span className={styles.rule} aria-hidden="true" />
        <p>The languages, frameworks, and tools I&apos;ve used across these projects.</p>
      </header>
      <div className={styles.grid}>
        {DATA.skillGroups.map((group) => (
          <section key={group.title} className={styles.category} aria-label={group.title}>
            <h3>{group.title}</h3>
            <ul className={styles.skills}>
              {group.skills.map((name) => <SkillBadge key={name} name={name} />)}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
