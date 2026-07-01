import type React from 'react';
import type { ResumeFormData } from '../../../types/resume';
import { MinimalistTemplate }        from './MinimalistTemplate';
import { ModernAccentTemplate }      from './ModernAccentTemplate';
import { ProfessionalSplitTemplate } from './ProfessionalSplitTemplate';
import { TimelineTemplate }          from './TimelineTemplate';

interface Props { formData: ResumeFormData }

const TEMPLATE_MAP: Record<string, React.FC<Props>> = {
  'minimalist':         MinimalistTemplate,
  'professional-split': ProfessionalSplitTemplate,
  'modern-accent':      ModernAccentTemplate,
  'timeline':           TimelineTemplate,
};

/**
 * Selects and renders the correct template based on `formData.selectedTemplate`.
 * Wraps the result in a subtle inset container.
 */
export function ResumePreview({ formData }: Props) {
  const Template = TEMPLATE_MAP[formData.selectedTemplate] ?? MinimalistTemplate;

  return (
    <div style={{ borderRadius: 20, background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', padding: 12, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)' }}>
      <Template formData={formData} />
    </div>
  );
}
