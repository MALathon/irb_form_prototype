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

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  isComingSoon?: boolean;
  default?: boolean;
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

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  required?: boolean;
  tooltip?: string;
  helpText?: string;
  multiline?: boolean;
  options?: Array<SelectOption | string>;
  placeholder?: string;
  template?: string | Record<string, any>;
  validation?: ValidationRule;
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
  isWizardStep: boolean;
  dynamicFields?: boolean;
  dependsOn?: SectionDependency;
  isDisabled?: boolean;
}

export interface SectionDependency {
  sectionId: string;
  value: string | string[];
}

export interface FormConfig {
  sections: Record<string, Section>;
}

export interface FormData {
  [key: string]: any;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface ValidationError {
  message: string;
  type: 'error' | 'warning';
}

export interface FormSectionProps {
  section: Section;
  data: FormData;
  onChange: (id: string, value: any) => void;
  errors?: Record<string, ValidationError>;
  skippedFields?: string[];
  onHelpClick?: () => void;
  helpIcon?: React.ReactNode;
}