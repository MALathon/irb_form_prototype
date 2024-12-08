import type { 
  FormConfig, 
  Question, 
  Section, 
  ValidationRule, 
  SearchConfig, 
  DynamicListField,
  StudyRole,
  TeamMember,
  SelectOption
} from '../types/index';

// Define STUDY_ROLES first before using it
export const STUDY_ROLES: StudyRole[] = [
  {
    id: 'pi',
    label: 'Principal Investigator',
    description: 'Lead researcher responsible for the study',
    canEdit: true,
    canDelete: false,
    required: true
  },
  {
    id: 'co_investigator',
    label: 'Co-Investigator',
    description: 'Collaborating researcher with significant responsibilities',
    canEdit: true,
    canDelete: true
  },
  {
    id: 'study_coordinator',
    label: 'Study Coordinator',
    description: 'Manages day-to-day study operations',
    canEdit: true,
    canDelete: true
  },
  {
    id: 'data_scientist',
    label: 'Data Scientist',
    description: 'Responsible for AI/ML model development and analysis',
    canEdit: true,
    canDelete: true
  },
  {
    id: 'clinical_expert',
    label: 'Clinical Expert',
    description: 'Provides clinical domain expertise',
    canEdit: true,
    canDelete: true
  },
  {
    id: 'biostatistician',
    label: 'Biostatistician',
    description: 'Handles statistical analysis and study design',
    canEdit: true,
    canDelete: true
  }
];

// Add initial information gathering questions
const initialInformationQuestions: Question[] = [
  {
    id: 'supporting_files',
    type: 'file_upload',
    label: 'Upload Supporting Documents',
    required: false,
    tooltip: 'Upload any relevant documents that could help with your application',
    helpText: 'You can upload protocols, papers, or any other supporting materials'
  },
  {
    id: 'existing_information',
    type: 'rich_text',
    label: "Do you have any existing information about your study that you'd like to share?",
    required: false,
    multiline: true,
    tooltip: 'This could include preliminary research, similar studies, or any other relevant information',
    placeholder: `Examples:
- Previous research papers or protocols
- Preliminary data analysis results
- Similar studies in your field
- Existing IRB protocols that could be referenced
- Team members already identified
- Known data sources or requirements`
  },
  {
    id: 'ai_assistance',
    type: 'radio',
    label: 'Would you like AI assistance to help pre-fill some information?',
    required: true,
    options: ["Yes, help me get started", "No, I'll fill everything manually"],
    tooltip: 'Our AI can analyze your initial information to suggest relevant content throughout the protocol',
    placeholder: `The AI assistant can help by:
- Identifying potential team roles based on your study needs
- Suggesting relevant data sources and requirements
- Recommending safety considerations based on similar studies
- Pre-filling common protocol sections for your review
- Highlighting potential ethical considerations

All suggestions will be clearly marked and require your review.`
  }
];

// Add team management questions
const teamManagementQuestions: Question[] = [
  {
    id: 'team_search',
    type: 'dropdown',
    label: 'Search for team members',
    required: false,
    tooltip: 'Search the MDM database for potential team members',
    searchConfig: {
      endpoint: '/api/mdm/search',
      minChars: 2,
      resultTemplate: {
        name: 'string',
        title: 'string',
        department: 'string',
        expertise: 'string'
      }
    }
  },
  {
    id: 'team_members',
    type: 'dynamic_list',
    label: 'Current Team Members',
    required: true,
    tooltip: 'Manage your study team members and their roles',
    template: {
      role: { 
        type: 'dropdown',
        label: 'Role',
        options: STUDY_ROLES.map(role => role.label)
      },
      responsibilities: {
        type: 'text',
        label: 'Specific Responsibilities'
      },
      time_commitment: {
        type: 'text',
        label: 'Time Commitment (%)',
        validation: {
          type: 'number',
          min: 0,
          max: 100
        }
      }
    }
  }
];

// Base form configuration
export const formConfig: FormConfig = {
  sections: {
    initial_information: {
      id: 'initial_information',
      title: 'Getting Started',
      description: 'Help us understand your study better',
      questions: initialInformationQuestions
    },
    team_management: {
      id: 'team_management',
      title: 'Study Team',
      description: 'Build and manage your research team',
      questions: teamManagementQuestions
    }
  }
};

// Update generateFormConfig to always show all possible sections
export const generateFormConfig = (wizardState: {
  phase?: 'discovery' | 'pilot' | 'validation';
  dataCollection?: 'prospective' | 'retrospective';
}): FormConfig => {
  const sections: Record<string, Section> = {
    // Initial sections
    initial_information: formConfig.sections.initial_information,
    study_phase: {
      id: 'study_phase',
      title: 'Study Phase',
      description: 'Select your AI study phase',
      questions: [],
      isWizardStep: true
    },
    data_collection: {
      id: 'data_collection',
      title: 'Data Collection',
      description: 'Define your data collection approach',
      questions: [],
      isWizardStep: true
    },
    team_management: formConfig.sections.team_management,

    // Discovery phase sections
    model_development: {
      id: 'model_development',
      title: 'Model Development',
      description: 'Plan your AI model development',
      questions: [],
      isDisabled: wizardState.phase !== 'discovery',
      isWizardStep: false
    },

    // Pilot phase sections
    model_details: {
      id: 'model_details',
      title: 'Model Details',
      description: 'Technical specifications of your AI model',
      questions: [],
      isDisabled: wizardState.phase !== 'pilot',
      isWizardStep: false
    },
    testing_protocol: {
      id: 'testing_protocol',
      title: 'Testing Protocol',
      description: 'Define your testing methodology',
      questions: [],
      isDisabled: wizardState.phase !== 'pilot',
      isWizardStep: false
    },

    // Validation phase sections
    clinical_integration: {
      id: 'clinical_integration',
      title: 'Clinical Integration',
      description: 'Plan for clinical implementation',
      questions: [],
      isDisabled: wizardState.phase !== 'validation',
      isWizardStep: false
    },
    monitoring: {
      id: 'monitoring',
      title: 'Monitoring Plan',
      description: 'Define ongoing monitoring strategy',
      questions: [],
      isDisabled: wizardState.phase !== 'validation',
      isWizardStep: false
    },

    // Data collection sections
    data_collection_protocol: {
      id: 'data_collection_protocol',
      title: 'Data Collection Protocol',
      description: 'Define your data collection procedures',
      questions: [],
      isDisabled: wizardState.dataCollection !== 'prospective',
      isWizardStep: false
    },
    data_source: {
      id: 'data_source',
      title: 'Data Sources',
      description: 'Document your data sources',
      questions: [],
      isDisabled: wizardState.dataCollection !== 'retrospective',
      isWizardStep: false
    },

    // Common sections
    safety_ethics: {
      id: 'safety_ethics',
      title: 'Safety & Ethics',
      description: 'Address safety and ethical considerations',
      questions: [],
      isDisabled: !wizardState.phase || !wizardState.dataCollection,
      isWizardStep: false
    }
  };

  return { sections };
}; 