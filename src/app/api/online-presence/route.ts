import type { OnlinePresenceStats } from '@/data/online-presence';

export const runtime = 'nodejs';

const LEETCODE_QUERY = `query publicProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }
}`;

function count(value: unknown): number | null {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

async function leetcodeStats(): Promise<OnlinePresenceStats['leetcode']> {
  const response = await fetch('https://leetcode.com/graphql/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://leetcode.com',
      Referer: 'https://leetcode.com/u/pr33t2005/'
    },
    body: JSON.stringify({ query: LEETCODE_QUERY, variables: { username: 'pr33t2005' } }),
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) return null;
  const result = await response.json();
  const user = result?.data?.matchedUser;
  if (user?.username !== 'pr33t2005' || !Array.isArray(user?.submitStatsGlobal?.acSubmissionNum)) return null;
  const values = new Map<string, unknown>(user.submitStatsGlobal.acSubmissionNum.map((item: { difficulty: string; count: unknown }) => [item.difficulty, item.count]));
  const solved = count(values.get('All'));
  const easy = count(values.get('Easy'));
  const medium = count(values.get('Medium'));
  const hard = count(values.get('Hard'));
  if (solved === null || easy === null || medium === null || hard === null || easy + medium + hard !== solved) return null;
  return { solved, easy, medium, hard };
}

async function neetcodeStats(): Promise<OnlinePresenceStats['neetcode']> {
  const response = await fetch('https://neetcode.io/api/callableFunctionHttp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://neetcode.io',
      Referer: 'https://neetcode.io/user/SuperGengar989'
    },
    body: JSON.stringify({ data: { functionId: 'getProfileByHandle', handle: 'SuperGengar989' } }),
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) return null;
  const result = await response.json();
  const user = result?.data;
  if (user?.anonUsername !== 'SuperGengar989') return null;
  const easy = count(user?.ncAllDifficultyStats?.easy?.completed);
  const medium = count(user?.ncAllDifficultyStats?.medium?.completed);
  const hard = count(user?.ncAllDifficultyStats?.hard?.completed);
  const solved = count(user?.ranking?.userSolvedCount);
  if (solved === null || easy === null || medium === null || hard === null || easy + medium + hard !== solved) return null;
  return { solved, easy, medium, hard };
}

async function githubContributions(): Promise<number | null> {
  const response = await fetch('https://github.com/users/patelpreet404-alt/contributions', {
    headers: { Accept: 'text/html', 'User-Agent': 'PreetPortfolio/1.0' },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) return null;
  const html = await response.text();
  const match = html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions?\s+in the last year/i);
  return match ? count(Number(match[1].replaceAll(',', ''))) : null;
}

async function githubRepositories(): Promise<number | null> {
  const response = await fetch('https://api.github.com/users/patelpreet404-alt', {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'PreetPortfolio/1.0' },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) return null;
  const user = await response.json();
  return user?.login === 'patelpreet404-alt' ? count(user.public_repos) : null;
}

export async function GET(): Promise<Response> {
  const [leetcode, neetcode, contributions, publicRepos] = await Promise.all([
    leetcodeStats().catch(() => null),
    neetcodeStats().catch(() => null),
    githubContributions().catch(() => null),
    githubRepositories().catch(() => null)
  ]);

  const stats: OnlinePresenceStats = {
    leetcode,
    neetcode,
    github: { contributions, publicRepos }
  };
  const complete = leetcode !== null && neetcode !== null && contributions !== null && publicRepos !== null;
  return Response.json({ ...stats, fetchedAt: new Date().toISOString() }, {
    headers: { 'Cache-Control': `public, s-maxage=${complete ? 900 : 60}, stale-while-revalidate=300` }
  });
}
