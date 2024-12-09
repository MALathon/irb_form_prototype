export const STUDY_ROLES = [
  {
    id: 'pi',
    label: 'Principal Investigator',
    description: 'Lead researcher responsible for the study',
    canEdit: true,
    canDelete: false,
    required: true
  },
  {
    id: 'co_pi',
    label: 'Co-Principal Investigator',
    description: 'Secondary lead researcher',
    canEdit: true,
    canDelete: true,
    required: false
  },
  {
    id: 'researcher',
    label: 'Researcher',
    description: 'Team member conducting research activities',
    canEdit: true,
    canDelete: true,
    required: false
  },
  {
    id: 'data_scientist',
    label: 'Data Scientist',
    description: 'Team member responsible for data analysis and AI/ML development',
    canEdit: true,
    canDelete: true,
    required: false
  },
  {
    id: 'clinician',
    label: 'Clinical Expert',
    description: 'Medical professional providing clinical expertise',
    canEdit: true,
    canDelete: true,
    required: false
  }
]; 