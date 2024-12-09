import { PHASES, DATA_COLLECTION_TYPES, TIME_ESTIMATES } from '../config/wizardConfig';
import type { Question } from './form';
import type { SvgIconProps } from '@mui/material';

// Types based on constants
export type Phase = typeof PHASES[keyof typeof PHASES];
export type DataCollection = typeof DATA_COLLECTION_TYPES[keyof typeof DATA_COLLECTION_TYPES];

// Add time estimate types
export type PhaseTimeEstimate = typeof TIME_ESTIMATES.PHASES[keyof typeof TIME_ESTIMATES.PHASES];
export type DataCollectionTimeEstimate = typeof TIME_ESTIMATES.DATA_COLLECTION[keyof typeof TIME_ESTIMATES.DATA_COLLECTION];
export type SelectionMethodTimeEstimate = typeof TIME_ESTIMATES.SELECTION_METHOD[keyof typeof TIME_ESTIMATES.SELECTION_METHOD];

// Interfaces
export interface ModuleConfig {
  title: string;
  modules: {
    core: string[];
    additional: string[];
  };
  explanation: string;
  timeEstimate: number;
  sections?: Array<{
    id: string;
    title: string;
    description: string;
    questions: Question[];
    isWizardStep: boolean;
  }>;
}

// Use the Phase and DataCollection types for the module mappings
export type PhaseModules = Record<Phase, ModuleConfig>;
export type DataCollectionModules = Record<DataCollection, ModuleConfig>;

// WizardState using the defined types
export interface WizardState {
  phase?: Phase;
  dataCollection?: DataCollection;
  estimatedTime: number;
  selectedModules?: {
    core: string[];
    additional: string[];
  };
}

// Type guards
export function isPhase(value: unknown): value is Phase {
  return typeof value === 'string' && Object.values(PHASES).includes(value as Phase);
}

export function isDataCollection(value: unknown): value is DataCollection {
  return typeof value === 'string' && Object.values(DATA_COLLECTION_TYPES).includes(value as DataCollection);
}

// Add to existing types
export interface WizardStepOption {
  label: string;
  description: string;
  timeImpact: PhaseTimeEstimate | DataCollectionTimeEstimate | SelectionMethodTimeEstimate;
  value: string;
  Icon?: React.ComponentType<SvgIconProps>;
  leadTo?: Phase | DataCollection;
}

export interface WizardStep {
  id: string;
  title: string;
  question: string;
  explanation: string;
  options: WizardStepOption[];
} 