export type QuestionType = 
  | 'text' 
  | 'dropdown' 
  | 'chips' 
  | 'radio' 
  | 'date-range'
  | 'slider'
  | 'autocomplete'
  | 'repeatable';

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[];
  multiline?: boolean;
  tooltip: string;
  template?: string;
  required?: boolean;
  multiple?: boolean;
  dependsOn?: {
    questionId: string;
    value: string | string[];
  };
  validation?: {
    type: 'number' | 'date' | 'text';
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface QuestionTooltipProps {
  text: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  dependsOn?: {
    sectionId: string;
    value: string | string[];
  };
}

export interface FormSectionProps {
  section: Section;
  data: Record<string, any>;
  onChange: (questionId: string, value: any) => void;
  onValidationChange?: (questionId: string, isValid: boolean) => void;
} 