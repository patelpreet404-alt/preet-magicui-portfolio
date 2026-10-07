# Preet Patel — Portfolio

A personal portfolio built with Next.js 16, React 19, Tailwind CSS, and Magic UI. It is based on the [Magic UI portfolio template](https://github.com/magicuidesign/portfolio) and uses information from Preet's résumé and existing portfolio.

## Run locally

Requires Node.js 18+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit content

- Profile, contact links, experience, education, skills, and projects: `src/data/resume.tsx`
- Home page sections: `src/app/page.tsx`
- Blog posts, when ready to publish: `content/*.mdx`

The original sample blog posts have been removed. The blog stays available at `/blog` and shows an empty state until original posts are added.

The ResearchPaper AI card links to a live sample and shows a screenshot. The other project cards use designed covers until screenshots or demos are available. Add an image path or video URL to a project in `src/data/resume.tsx` when ready.

## Deploy

This project can be deployed as a Next.js site on Vercel. The default site URL is `https://preet-magicui-portfolio.vercel.app`; set `NEXT_PUBLIC_SITE_URL` if you use a different domain so social sharing metadata points to the right site. Project source links work without any environment variables.

## License

The template is MIT licensed. See [LICENSE](LICENSE) for the original copyright notice.
