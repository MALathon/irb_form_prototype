import type { Question } from '../types';
import { STUDY_ROLES } from './formConfig';

export const moduleQuestions: Record<string, Question[]> = {
  // Add Getting Started section
  getting_started: [
    {
      id: 'study_title',
      type: 'text',
      label: 'Study Title',
      required: true,
      tooltip: 'Provide a descriptive title for your AI/ML research study',
      helpText: 'Include key aspects: AI/ML focus, clinical domain, and study type'
    },
    {
      id: 'study_summary',
      type: 'rich_text',
      label: 'Study Summary',
      required: true,
      tooltip: 'Brief overview of your AI/ML research study',
      multiline: true,
      helpText: 'Include: background, objectives, and significance'
    },
    {
      id: 'research_team',
      type: 'team_list',
      label: 'Research Team',
      required: true,
      tooltip: 'List the key members of your research team',
      helpText: 'Add team members and assign their roles',
      options: STUDY_ROLES.map(role => ({
        value: role.id,
        label: role.label
      }))
    },
    {
      id: 'supporting_documents',
      type: 'file_upload',
      label: 'Supporting Documents',
      required: false,
      tooltip: 'Upload any relevant documentation',
      helpText: 'Examples: preliminary data, related publications, or other supporting materials'
    },
    {
      id: 'use_ai_assistance',
      type: 'radio',
      label: 'Would you like AI assistance with your IRB application?',
      required: true,
      tooltip: `The AI assistant helps with your IRB application by:

Document Analysis
• Analyzing uploaded documents
• Identifying key study components
• Finding relevant information

Smart Features
• Real-time content suggestions
• Terminology recommendations
• Examples from successful applications

Quality Control
• Section consistency checks
• Completeness verification
• IRB requirement validation

User Control
• Review all suggestions
• Edit any content
• Accept/reject recommendations
• Secure processing`,
      helpText: '',
      options: [
        {
          value: 'yes',
          label: 'Yes, I would like AI assistance to help build my application (Coming Soon)',
          disabled: true,
          isComingSoon: true
        },
        {
          value: 'no',
          label: 'No, I prefer to fill everything manually',
          default: true
        }
      ]
    }
  ],

  // Protocol Documentation
  protocol_documentation: [
    {
      id: 'protocol_title',
      type: 'text',
      label: 'Protocol Title',
      required: true,
      tooltip: 'Provide a descriptive title for your AI/ML research protocol',
      helpText: 'Include key aspects: AI/ML focus, clinical domain, and study type'
    },
    {
      id: 'protocol_summary',
      type: 'rich_text',
      label: 'Protocol Summary',
      required: true,
      tooltip: 'Brief overview of your AI/ML research protocol',
      multiline: true,
      helpText: 'Include: objective, methodology, and expected outcomes'
    },
    {
      id: 'ai_system_description',
      type: 'rich_text',
      label: 'AI System Description',
      required: true,
      tooltip: 'Detailed description of the AI/ML system being studied',
      multiline: true
    }
  ],

  // Ethics Review
  ethics_review: [
    {
      id: 'ethical_considerations',
      type: 'rich_text',
      label: 'Ethical Considerations',
      required: true,
      tooltip: 'Describe ethical implications of using AI/ML in this context',
      multiline: true
    },
    {
      id: 'bias_mitigation',
      type: 'rich_text',
      label: 'Bias Mitigation Strategy',
      required: true,
      tooltip: 'How will you identify and address potential biases?',
      multiline: true
    },
    {
      id: 'privacy_protection',
      type: 'rich_text',
      label: 'Privacy Protection Measures',
      required: true,
      tooltip: 'Describe measures to protect patient privacy',
      multiline: true
    }
  ],

  // Safety Assessment
  safety_assessment: [
    {
      id: 'risk_assessment',
      type: 'rich_text',
      label: 'Risk Assessment',
      required: true,
      tooltip: 'Evaluate potential risks of AI/ML system deployment',
      multiline: true
    },
    {
      id: 'safety_monitoring',
      type: 'rich_text',
      label: 'Safety Monitoring Plan',
      required: true,
      tooltip: 'How will you monitor and ensure system safety?',
      multiline: true
    },
    {
      id: 'contingency_plan',
      type: 'rich_text',
      label: 'Contingency Plan',
      required: true,
      tooltip: 'Plan for handling system failures or unexpected behavior',
      multiline: true
    }
  ],

  // Model Documentation
  model_documentation: [
    {
      id: 'model_architecture',
      type: 'rich_text',
      label: 'Model Architecture',
      required: true,
      tooltip: 'Describe the AI/ML model architecture and components',
      multiline: true
    },
    {
      id: 'training_data',
      type: 'rich_text',
      label: 'Training Data Description',
      required: true,
      tooltip: 'Describe the data used to train the model',
      multiline: true
    },
    {
      id: 'performance_metrics',
      type: 'rich_text',
      label: 'Performance Metrics',
      required: true,
      tooltip: 'Define metrics used to evaluate model performance',
      multiline: true
    }
  ],

  // Performance Validation
  performance_validation: [
    {
      id: 'validation_methodology',
      type: 'rich_text',
      label: 'Validation Methodology',
      required: true,
      tooltip: 'Describe how you will validate model performance',
      multiline: true
    },
    {
      id: 'success_criteria',
      type: 'rich_text',
      label: 'Success Criteria',
      required: true,
      tooltip: 'Define criteria for successful validation',
      multiline: true
    }
  ],

  // Clinical Integration Planning
  clinical_integration_planning: [
    {
      id: 'integration_approach',
      type: 'rich_text',
      label: 'Integration Approach',
      required: true,
      tooltip: 'How will the AI/ML system be integrated into clinical workflow?',
      multiline: true
    },
    {
      id: 'training_requirements',
      type: 'rich_text',
      label: 'Training Requirements',
      required: true,
      tooltip: 'Describe training needed for clinical staff',
      multiline: true
    }
  ]
}; 