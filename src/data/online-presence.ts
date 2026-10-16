import { DATA } from '@/data/resume';

export interface OnlinePresenceStats {
  leetcode: { solved: number; easy: number; medium: number; hard: number } | null;
  neetcode: { solved: number; easy: number; medium: number; hard: number } | null;
  github: { contributions: number | null; publicRepos: number | null };
}

export const ONLINE_PROFILES = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    handle: '@pr33t2005',
    href: 'https://leetcode.com/u/pr33t2005/',
    description: 'Algorithms and problem-solving practice',
    accent: 'amber',
    featured: true
  },
  {
    id: 'neetcode',
    name: 'NeetCode',
    handle: '@SuperGengar989',
    href: 'https://neetcode.io/user/SuperGengar989',
    description: 'Structured coding interview practice',
    accent: 'green',
    featured: false
  },
  {
    id: 'github',
    name: 'GitHub',
    handle: '@patelpreet404-alt',
    href: DATA.contact.social.GitHub.url,
    description: 'Projects and source code',
    accent: 'violet',
    featured: false
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Preet Patel',
    href: DATA.contact.social.LinkedIn.url,
    description: 'Education and professional experience',
    connectionCount: '100+',
    accent: 'blue',
    featured: false
  }
] as const;
