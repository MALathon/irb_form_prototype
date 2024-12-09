import type { 
  Phase, 
  DataCollection, 
  PhaseModules, 
  DataCollectionModules,
  ModuleConfig 
} from '../types/wizard';

// Define the values as lowercase string literals
export const PHASES = {
  discovery: 'discovery',
  pilot: 'pilot',
  validation: 'validation'
} as const;

export const DATA_COLLECTION_TYPES = {
  retrospective: 'retrospective',
  prospective: 'prospective'
} as const;

// Core module definitions
export const CORE_MODULES = [
  "Protocol Information",
  "Protocol Documentation",
  "Ethics Review",
  "Safety Assessment",
  "Model Documentation"
] as const;

export const DATA_CORE_MODULES = [
  "Data Security Plan",
  "Data Quality Assessment",
  "Data Source Documentation"
] as const;

// Define time estimates as constants
export const TIME_ESTIMATES = {
  PHASES: {
    discovery: 30,
    pilot: 45,
    validation: 60
  },
  DATA_COLLECTION: {
    retrospective: 15,
    prospective: 30
  },
  SELECTION_METHOD: {
    guided: 5,
    direct: 2
  }
} as const;

// Define base module configurations
const discoveryConfig: ModuleConfig = {
  title: "Discovery Phase",
  modules: {
    core: Array.from(CORE_MODULES),
    additional: []
  },
  explanation: "Focus on initial model development and basic validation.",
  timeEstimate: TIME_ESTIMATES.PHASES.discovery,
  sections: [{
    id: 'model_development',
    title: 'Model Development',
    description: 'Plan your AI model development',
    questions: [],
    isWizardStep: false
  }]
};

const pilotConfig: ModuleConfig = {
  title: "Pilot Phase",
  modules: {
    core: Array.from(CORE_MODULES),
    additional: [
      "Performance Validation",
      "Error Analysis",
      "Clinical Integration Planning"
    ]
  },
  explanation: "Emphasis on thorough testing and validation in a controlled environment.",
  timeEstimate: TIME_ESTIMATES.PHASES.pilot
};

const validationConfig: ModuleConfig = {
  title: "Validation Phase",
  modules: {
    core: Array.from(CORE_MODULES),
    additional: [
      "Performance Validation",
      "Error Analysis",
      "Clinical Integration Planning",
      "Production Deployment",
      "Monitoring Systems",
      "Clinical Workflow Integration"
    ]
  },
  explanation: "Focus on clinical implementation and production deployment.",
  timeEstimate: TIME_ESTIMATES.PHASES.validation
};

// Phase modules with proper typing using ModuleConfig
export const phaseModules: PhaseModules = {
  discovery: discoveryConfig,
  pilot: pilotConfig,
  validation: validationConfig
};

// Data collection module configurations
const retrospectiveConfig: ModuleConfig = {
  title: "Retrospective Data Collection",
  modules: {
    core: Array.from(DATA_CORE_MODULES),
    additional: ["Data Access Agreements"]
  },
  explanation: "Retrospective analysis focuses on existing data quality and bias assessment.",
  timeEstimate: TIME_ESTIMATES.DATA_COLLECTION.retrospective
};

const prospectiveConfig: ModuleConfig = {
  title: "Prospective Data Collection",
  modules: {
    core: Array.from(DATA_CORE_MODULES),
    additional: [
      "Patient Recruitment Strategy",
      "Timeline Planning",
      "Quality Control Measures",
      "Participant Follow-up Plan"
    ]
  },
  explanation: "Prospective data collection requires additional planning for future data gathering.",
  timeEstimate: TIME_ESTIMATES.DATA_COLLECTION.prospective
};

// Data collection modules with proper typing using ModuleConfig
export const dataCollectionModules: DataCollectionModules = {
  retrospective: retrospectiveConfig,
  prospective: prospectiveConfig
};

// Helper functions with proper typing
export const calculateTotalTime = (state: {
  phase?: Phase;
  dataCollection?: DataCollection;
  selectedModules?: {
    core: string[];
    additional: string[];
  };
}): number => {
  // Start with 0 instead
  let totalTime = 0;

  // Add phase time if exists
  if (state.phase && TIME_ESTIMATES.PHASES[state.phase]) {
    totalTime += TIME_ESTIMATES.PHASES[state.phase];
  }

  // Add data collection time if exists
  if (state.dataCollection && TIME_ESTIMATES.DATA_COLLECTION[state.dataCollection]) {
    totalTime += TIME_ESTIMATES.DATA_COLLECTION[state.dataCollection];
  }

  return totalTime;
};

export const calculateEstimatedTime = (phase?: Phase, dataCollection?: DataCollection): number => {
  return calculateTotalTime({
    phase,
    dataCollection
  });
};

// Update getModulesForSelection to return mutable arrays
export const getModulesForSelection = (phase?: Phase, dataCollection?: DataCollection) => {
  const selectedPhaseModules = phase && phaseModules[phase] 
    ? phaseModules[phase].modules 
    : { core: [], additional: [] };  // Remove as const

  const selectedDataModules = dataCollection && dataCollectionModules[dataCollection]
    ? dataCollectionModules[dataCollection].modules
    : { core: [], additional: [] };  // Remove as const

  return {
    core: [...selectedPhaseModules.core, ...selectedDataModules.core],
    additional: [...selectedPhaseModules.additional, ...selectedDataModules.additional]
  };
};