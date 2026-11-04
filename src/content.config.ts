import { file, glob } from 'astro/loaders';
import { defineCollection, reference, z } from 'astro:content';

/** `YYYY`, `YYYY-MM` or `YYYY-MM-DD`. */
const partialDate = z.string().regex(/^\d{4}(-\d{2}){0,2}$/, 'expected YYYY, YYYY-MM or YYYY-MM-DD');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD');
const httpsUrl = z.string().url().startsWith('https://');
const nonEmpty = z.string().trim().min(1);
/** Open items for Jumi to confirm. Never rendered; collected into the summary. */
const todo = z.string().startsWith('TODO(jumi):').optional();

export const projectAreas = ['testing', 'ai', 'api', 'web'] as const;
export const certificationAreas = ['qa', 'development', 'ai', 'pm', 'data', 'marketing'] as const;

const socials = defineCollection({
  loader: file('src/content/socials.json'),
  schema: z.object({
    label: nonEmpty,
    url: httpsUrl,
    handle: nonEmpty,
    icon: z.enum(['github', 'linkedin', 'youtube']),
    order: z.number().int(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    title: nonEmpty,
    repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'expected owner/name'),
    url: httpsUrl,
    links: z.array(z.object({ label: nonEmpty, url: httpsUrl })).default([]),
    tagline: nonEmpty,
    problem: nonEmpty.optional(),
    built: nonEmpty.optional(),
    blurb: nonEmpty.optional(),
    highlights: z.array(nonEmpty).default([]),
    stack: z.array(nonEmpty).default([]),
    testing: nonEmpty.optional(),
    areas: z.array(z.enum(projectAreas)).min(1),
    featured: z.boolean().default(false),
    order: z.number().int(),
    todo,
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/experience' }),
  schema: z.object({
    role: nonEmpty,
    org: nonEmpty,
    orgNote: nonEmpty.optional(),
    start: partialDate,
    end: z.union([partialDate, z.literal('present')]),
    summary: nonEmpty.optional(),
    highlights: z.array(nonEmpty).min(1),
    stack: z.array(nonEmpty).default([]),
    order: z.number().int(),
    todo,
  }),
});

const education = defineCollection({
  loader: file('src/content/education.json'),
  schema: z.object({
    degree: nonEmpty,
    school: nonEmpty,
    schoolShort: nonEmpty.optional(),
    start: partialDate,
    end: partialDate,
    notes: z.array(nonEmpty).default([]),
  }),
});

const impact = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/impact' }),
  schema: z.object({
    title: nonEmpty,
    intro: nonEmpty,
    asOf: isoDate,
    source: nonEmpty,
    period: nonEmpty,
    stats: z
      .array(
        z.object({
          value: z.number().int().nonnegative(),
          label: nonEmpty,
          detail: nonEmpty,
        }),
      )
      .min(1),
    roles: z
      .array(
        z.object({
          title: nonEmpty,
          period: nonEmpty,
          stack: z.array(nonEmpty).min(1),
          highlights: z.array(z.object({ lead: nonEmpty, text: nonEmpty })).min(1),
        }),
      )
      .min(1),
    footnote: nonEmpty,
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills.json'),
  schema: z.object({
    title: nonEmpty,
    order: z.number().int(),
    items: z
      .array(
        z.object({
          name: nonEmpty,
          note: nonEmpty,
          projects: z.array(reference('projects')).default([]),
          experience: z.array(reference('experience')).default([]),
          todo,
        }),
      )
      .min(1),
  }),
});

const certifications = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/certifications' }),
  schema: z
    .object({
      title: nonEmpty,
      provider: nonEmpty,
      kind: z.enum(['specialization', 'professional-certificate', 'course-set']),
      url: httpsUrl.optional(),
      areas: z.array(z.enum(certificationAreas)).min(1),
      year: z.number().int().min(2000).max(2100),
      completed: partialDate.optional(),
      description: nonEmpty,
      order: z.number().int(),
      todo,
    })
    .refine((c) => c.kind === 'course-set' || c.url !== undefined, {
      message: 'a specialization or professional certificate needs its verification url',
    }),
});

const courses = defineCollection({
  loader: file('src/content/courses.json'),
  schema: z.object({
    title: nonEmpty,
    url: httpsUrl,
    certification: reference('certifications'),
    provider: nonEmpty.optional(),
    completed: isoDate.optional(),
    order: z.number().int(),
  }),
});

const disciplines = defineCollection({
  loader: file('src/content/disciplines.json'),
  schema: z.object({
    title: nonEmpty,
    order: z.number().int(),
    summary: nonEmpty,
    canDo: z.array(nonEmpty).min(1),
    credentials: z.array(nonEmpty).default([]),
    certifications: z.array(reference('certifications')).default([]),
    asEngineer: nonEmpty,
  }),
});

export const collections = {
  socials,
  projects,
  experience,
  education,
  impact,
  skills,
  certifications,
  courses,
  disciplines,
};
