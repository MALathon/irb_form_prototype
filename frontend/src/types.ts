export interface TeamMember {
  id: string;
  name: string;
  title: string;
  department: string;
  expertise: string[];
  email: string;
  role?: StudyRole;
  responsibilities?: string;
  timeCommitment?: number;
}

export interface StudyRole {
  id: string;
  label: string;
  description: string;
  canEdit: boolean;
  canDelete: boolean;
  required?: boolean;
}

export interface ValidationRule {
  type: 'number' | 'date' | 'text';
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface SearchConfig {
  endpoint: string;
  minChars: number;
  resultTemplate: Record<string, string>;
}

export interface DynamicListField {
  type: string;
  label: string;
  options?: string[];
  required?: boolean;
  validation?: ValidationRule;
  multiline?: boolean;
}

export type QuestionType = 
  | 'text' 
  | 'dropdown' 
  | 'chips' 
  | 'radio' 
  | 'date-range'
  | 'slider'
  | 'autocomplete'
  | 'repeatable'
  | 'rich_text'
  | 'searchable_select'
  | 'team_list'
  | 'multi_select_with_detail'
  | 'checkbox_group'
  | 'dynamic_list'
  | 'file_upload';

export interface SelectOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  tooltip: string;
  options?: (string | SelectOption)[];
  multiline?: boolean;
  template?: Record<string, DynamicListField>;
  placeholder?: string;
  helpText?: string;
  validation?: ValidationRule;
  searchConfig?: SearchConfig;
  detailPrompt?: string;
  justificationPrompt?: string;
  dependsOn?: {
    questionId: string;
    value: string | string[];
  };
}

export interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  dynamicFields?: boolean;
  dependsOn?: {
    sectionId: string;
    value: string | string[];
  };
  isWizardStep?: boolean;
  isDisabled?: boolean;
}

export interface SectionDependency {
  sectionId: string;
  value: string | string[];
}

export interface FormConfig {
  sections: Record<string, Section>;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface ValidationError {
  message: string;
  type: 'error' | 'warning';
}

export interface FormData {
  [key: string]: unknown;
}

export interface FormSectionProps {
  section: Section;
  data: FormData;
  onChange: (questionId: string, value: unknown) => void;
  onValidationChange?: (questionId: string, isValid: boolean) => void;
  errors?: Record<string, ValidationError>;
  skippedFields?: string[];
  onHelpClick?: () => void;
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

export interface FormValidation {
  errors: Record<string, Record<string, ValidationError>>;
  validateSection: (sectionId: string) => Promise<boolean>;
  canProceed: (sectionId: string) => boolean;
}

export interface FormNavigation {
  nextSection: () => string | undefined;
  previousSection: () => string | undefined;
  visibleSections: (data: FormData) => string[];
  estimatedTimeRemaining: () => number;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url?: string;
}

export type Phase = 'discovery' | 'pilot' | 'validation';
export type DataCollection = 'prospective' | 'retrospective';

export interface WizardState {
  phase?: Phase;
  dataCollection?: DataCollection;
  estimatedTime: number;
} 