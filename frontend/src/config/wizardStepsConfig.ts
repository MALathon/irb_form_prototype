import { HelpOutline as HelpOutlineIcon, CheckCircle as CheckCircleIcon, Science as ScienceIcon, Timeline as TimelineIcon, Psychology as PsychologyIcon, Storage as StorageIcon, Addchart as NewDataIcon } from '@mui/icons-material';
import { PHASES, DATA_COLLECTION_TYPES, TIME_ESTIMATES } from './wizardConfig';
import type { WizardStep } from '../types/wizard';
import type { Section } from '../types/form';

export const wizardSteps: WizardStep[] = [
  {
    id: 'selection_method',
    title: 'Getting Started',
    question: "How would you like to get started?",
    explanation: "Don't worry - you can always change your selections later. We're here to help you build the right IRB application for your AI research.",
    options: [
      {
        label: "Guide me through it",
        description: "Answer a few simple questions and we'll help determine the best approach for your research. Perfect if you're not sure which phase fits best.",
        timeImpact: TIME_ESTIMATES.SELECTION_METHOD.guided,
        value: 'guided',
        Icon: HelpOutlineIcon
      },
      {
        label: "I know what I need",
        description: "Already familiar with AI research phases? You can directly select your phase and data collection approach. You can always modify these later.",
        timeImpact: TIME_ESTIMATES.SELECTION_METHOD.direct,
        value: 'direct',
        Icon: CheckCircleIcon
      }
    ]
  },
  {
    id: 'ai_readiness',
    title: 'AI Readiness',
    question: "Where are you in your AI development journey?",
    explanation: "Let's figure out which phase best matches your current stage. Remember, every great AI project starts somewhere!",
    options: [
      {
        label: "Just getting started",
        description: "You're at the beginning of your AI journey - planning to collect data and develop your initial model. This is an exciting first step!",
        value: 'not_started',
        leadTo: PHASES.discovery,
        timeImpact: TIME_ESTIMATES.PHASES.discovery,
        Icon: ScienceIcon
      },
      {
        label: "Have a model that needs testing",
        description: "You've developed your AI model and now need to validate its performance. We'll help you plan the right testing approach.",
        value: 'developed',
        leadTo: PHASES.pilot,
        timeImpact: TIME_ESTIMATES.PHASES.pilot,
        Icon: TimelineIcon
      },
      {
        label: "Ready for clinical implementation",
        description: "Your model is tested and you're ready to implement it in clinical practice. We'll help ensure a smooth transition.",
        value: 'tested',
        leadTo: PHASES.validation,
        timeImpact: TIME_ESTIMATES.PHASES.validation,
        Icon: PsychologyIcon
      }
    ]
  },
  {
    id: 'data_plans',
    title: 'Data Plans',
    question: "Tell us about your data plans",
    explanation: "Different data approaches have different requirements - we'll help you navigate them. You can always refine these details in the form.",
    options: [
      {
        label: "I have existing data",
        description: "You'll be working with previously collected data. We'll help you document its sources and quality appropriately.",
        value: 'existing',
        leadTo: DATA_COLLECTION_TYPES.retrospective,
        timeImpact: TIME_ESTIMATES.DATA_COLLECTION.retrospective,
        Icon: StorageIcon
      },
      {
        label: "I need to collect new data",
        description: "You'll be gathering new data as part of your study. We'll help you plan your collection process.",
        value: 'new',
        leadTo: DATA_COLLECTION_TYPES.prospective,
        timeImpact: TIME_ESTIMATES.DATA_COLLECTION.prospective,
        Icon: NewDataIcon
      }
    ]
  }
];

// Path-specific section configurations
export const directPathSections: Section[] = [
  {
    id: 'selection_method',
    title: 'Getting Started',
    description: 'Choose how to proceed',
    questions: [],
    isWizardStep: true,
    dynamicFields: false
  },
  {
    id: 'configure_study',
    title: 'Configure Study',
    description: 'Select phase and data collection',
    questions: [],
    isWizardStep: true,
    dynamicFields: false
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review selections',
    questions: [],
    isWizardStep: true,
    dynamicFields: false
  }
];

export const guidedPathSections: Section[] = [
  {
    id: 'selection_method',
    title: 'Getting Started',
    description: 'Choose how to proceed',
    questions: [],
    isWizardStep: true,
    dynamicFields: false
  },
  {
    id: 'ai_readiness',
    title: 'AI Readiness',
    description: 'Assess your AI maturity',
    questions: [],
    isWizardStep: true,
    dynamicFields: false
  },
  {
    id: 'data_plans',
    title: 'Data Plans',
    description: 'Define your data approach',
    questions: [],
    isWizardStep: true,
    dynamicFields: false
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review selections',
    questions: [],
    isWizardStep: true,
    dynamicFields: false
  }
]; 