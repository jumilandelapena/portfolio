/**
 * Reads the content collections straight from disk so the data-integrity
 * tests compare the rendered page with the files that produced it.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const contentDir = path.resolve(import.meta.dirname, '..', '..', 'src', 'content');

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(contentDir, file), 'utf8')) as T;
}

function readGlob<T>(dir: string): (T & { id: string })[] {
  return readdirSync(path.join(contentDir, dir))
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({ id: f.replace(/\.json$/, ''), ...readJson<T>(path.join(dir, f)) }));
}

export interface ProjectData {
  title: string;
  repo: string;
  url: string;
  links?: { label: string; url: string }[];
  featured?: boolean;
  areas: string[];
}

export interface CertificationData {
  title: string;
  url?: string;
  areas: string[];
}

export interface CourseData {
  id: string;
  title: string;
  url: string;
  certification: string;
}

export interface ImpactData {
  asOf: string;
  source: string;
  stats: { value: number; label: string }[];
}

export interface SocialData {
  id: string;
  label: string;
  url: string;
}

export interface ExperienceData {
  role: string;
  org: string;
}

export const content = {
  projects: readGlob<ProjectData>('projects'),
  certifications: readGlob<CertificationData>('certifications'),
  courses: readJson<CourseData[]>('courses.json'),
  impact: readGlob<ImpactData>('impact'),
  socials: readJson<SocialData[]>('socials.json'),
  experience: readGlob<ExperienceData>('experience'),
};
