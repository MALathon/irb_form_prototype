export interface StudyRole {
  id: string;
  label: string;
  description: string;
  canEdit: boolean;
  canDelete: boolean;
  required?: boolean;
} 