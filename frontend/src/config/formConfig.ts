import type { FormConfig, Section } from '../types/form';
import type { WizardState, Phase } from '../types/wizard';
import { moduleQuestions } from './moduleQuestions';
import { phaseModules } from './wizardConfig';

// Base form configuration
export const formConfig: FormConfig = {
  sections: {
    getting_started: {
      id: 'getting_started',
      title: 'Getting Started',
      description: 'Initial study information',
      questions: moduleQuestions.getting_started || [],
      isWizardStep: false,
      dynamicFields: false
    }
  }
};

// Generate form configuration based on wizard state
export const generateFormConfig = (wizardState: WizardState): FormConfig => {
  const config: FormConfig = {
    sections: {
      getting_started: {
        id: 'getting_started',
        title: 'Getting Started',
        description: 'Initial study information',
        questions: moduleQuestions.getting_started || [],
        isWizardStep: false,
        dynamicFields: false
      }
    }
  };

  // Add selected modules from wizard
  if (wizardState.selectedModules) {
    // Add core modules
    wizardState.selectedModules.core.forEach((moduleTitle: string) => {
      const sectionId = moduleTitle.toLowerCase().replace(/\s+/g, '_');
      config.sections[sectionId] = {
        id: sectionId,
        title: moduleTitle,
        description: `Complete ${moduleTitle} information`,
        questions: moduleQuestions[sectionId] || [],
        isWizardStep: false,
        dynamicFields: false
      };
    });

    // Add additional modules
    wizardState.selectedModules.additional.forEach((moduleTitle: string) => {
      const sectionId = moduleTitle.toLowerCase().replace(/\s+/g, '_');
      config.sections[sectionId] = {
        id: sectionId,
        title: moduleTitle,
        description: `Complete ${moduleTitle} information`,
        questions: moduleQuestions[sectionId] || [],
        isWizardStep: false,
        dynamicFields: false
      };
    });
  }

  // Add phase-specific sections if phase is selected
  if (wizardState.phase) {
    const phase = wizardState.phase as Phase;
    const phaseConfig = phaseModules[phase];
    
    if (phaseConfig && phaseConfig.sections) {
      phaseConfig.sections.forEach((section: Section) => {
        config.sections[section.id] = {
          ...section,
          questions: moduleQuestions[section.id] || [],
          dynamicFields: false
        };
      });
    }
  }

  // Add data collection specific sections
  if (wizardState.dataCollection) {
    if (wizardState.dataCollection === 'prospective') {
      config.sections.data_collection_protocol = {
        id: 'data_collection_protocol',
        title: 'Data Collection Protocol',
        description: 'Define collection procedures',
        questions: moduleQuestions.data_collection_protocol || [],
        isWizardStep: false,
        dynamicFields: false
      };
    } else {
      config.sections.data_source = {
        id: 'data_source',
        title: 'Data Sources',
        description: 'Document data sources',
        questions: moduleQuestions.data_source || [],
        isWizardStep: false,
        dynamicFields: false
      };
    }
  }

  return config;
}; 