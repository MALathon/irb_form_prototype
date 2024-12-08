import type { Section } from './form';
import type { StudyRole } from './study';

export interface TeamMember {
  id: string;
  name: string;
  role: StudyRole;
  title: string;
  department: string;
  expertise: string[];
  email?: string;
  institution?: string;
}

export interface TeamManagementProps {
  value: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

export interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (member: TeamMember) => void;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url?: string;
}

export interface FileUploadProps {
  onChange: (files: UploadedFile[]) => void;
  value?: UploadedFile[];
  multiple?: boolean;
  onFileDelete?: (fileId: string) => void;
  onFileDownload?: (file: UploadedFile) => void;
}

export interface ProgressTrackerProps {
  completedSections: string[];
  totalSections: number;
  currentSection: string;
  estimatedTimeRemaining: number;
  validationErrors: Record<string, string[]>;
}

export interface HelpPanelProps {
  section: Section;
  onClose: () => void;
}

export interface SectionHeaderProps {
  sections: Section[];
  completedSections: string[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  disabledSections?: string[];
} 