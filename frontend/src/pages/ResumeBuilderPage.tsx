import { Link } from 'react-router-dom';
import { TEMPLATE_OPTIONS } from '../components/resume/resumeConstants';
import { useResumeBuilder } from '../components/resume/useResumeBuilder';
import { ResumePreview } from '../components/resume/templates/ResumePreview';
import { TemplateSelectorSection } from '../components/resume/sections/TemplateSelectorSection';
import { PersonalDetailsSection } from '../components/resume/sections/PersonalDetailsSection';
import { SummarySection } from '../components/resume/sections/SummarySection';
import { SkillsSection } from '../components/resume/sections/SkillsSection';
import { ExperienceSection } from '../components/resume/sections/ExperienceSection';
import { EducationSection } from '../components/resume/sections/EducationSection';
import { ProjectsSection } from '../components/resume/sections/ProjectsSection';

const SECTION_TITLE = 'text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400';

export default function ResumeBuilderPage() {
  const builder = useResumeBuilder();
  const { formData, skillInput, isSaving, isLoading, status } = builder;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_80%_40%_at_50%_-20%,rgba(99,102,241,0.14),transparent_60%),#030712] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <Link to="/dashboard" className="text-sm text-indigo-300 hover:text-indigo-200">← Back to dashboard</Link>
            <h1 className="mt-2 text-3xl font-semibold">Resume Builder</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Create a polished resume, switch templates instantly, and export it as a PDF.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Active template</p>
            <p className="mt-1 text-indigo-300">
              {TEMPLATE_OPTIONS.find((t) => t.value === formData.selectedTemplate)?.description ?? 'Select a template'}
            </p>
          </div>
        </div>

        {/* Main two-column layout */}
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* ── Form panel ──────────────────────────────────────────────── */}
          <div className="space-y-6 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
            <TemplateSelectorSection
              options={TEMPLATE_OPTIONS}
              selectedTemplate={formData.selectedTemplate}
              onSelect={builder.setTemplate}
            />
            <PersonalDetailsSection
              data={formData.personalDetails}
              onChange={builder.updatePersonalDetails}
            />
            <SummarySection
              value={formData.professionalSummary}
              onChange={builder.updateSummary}
            />
            <SkillsSection
              skills={formData.skills}
              skillInput={skillInput}
              onInputChange={builder.setSkillInput}
              onAdd={builder.addSkill}
              onRemove={builder.removeSkill}
            />
            <ExperienceSection
              items={formData.experience}
              onChange={(i, f, v) => builder.updateArrayItem('experience', i, f, v)}
              onAdd={() => builder.addArrayItem('experience')}
              onRemove={(i) => builder.removeArrayItem('experience', i)}
            />
            <EducationSection
              items={formData.education}
              onChange={(i, f, v) => builder.updateArrayItem('education', i, f, v)}
              onAdd={() => builder.addArrayItem('education')}
              onRemove={(i) => builder.removeArrayItem('education', i)}
            />
            <ProjectsSection
              items={formData.projects}
              onChange={(i, f, v) => builder.updateArrayItem('projects', i, f, v)}
              onAdd={() => builder.addArrayItem('projects')}
              onRemove={(i) => builder.removeArrayItem('projects', i)}
            />

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={builder.handleSave}
                disabled={isSaving}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isSaving ? 'Saving…' : 'Save Resume'}
              </button>
              <button
                type="button"
                onClick={builder.handleDownload}
                disabled={isSaving}
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm font-medium text-slate-200 disabled:opacity-60"
              >
                Download PDF
              </button>
            </div>

            {isLoading && <p className="mt-3 text-sm text-slate-400">Loading saved resume details…</p>}
            {status && <p className="mt-3 text-sm text-slate-400">{status}</p>}
          </div>

          {/* ── Preview panel ────────────────────────────────────────────── */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className={SECTION_TITLE}>Live preview</h2>
                <span className="text-sm text-slate-400">{formData.selectedTemplate}</span>
              </div>
              <ResumePreview formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
