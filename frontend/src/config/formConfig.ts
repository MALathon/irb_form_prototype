import type { FormConfig, Section, Question } from '../types/form';
import type { WizardState, Phase } from '../types/wizard';
import { moduleQuestions } from './moduleQuestions';
import { phaseModules } from './wizardConfig';

// Define base section structure
const createSection = (
  id: string,
  title: string,
  description: string,
  questions: Question[] = []
): Section => ({
  id,
  title,
  description,
  questions,
  isWizardStep: false,
  dynamicFields: false
});

// Base form configuration
export const formConfig: FormConfig = {
  sections: {
    protocol_information: createSection(
      'protocol_information',
      'Protocol Information',
      'Basic information about your research protocol',
      moduleQuestions.protocol_information || []
    )
  }
};

// Generate form configuration based on wizard state
export const generateFormConfig = (wizardState: WizardState): FormConfig => {
  const config: FormConfig = {
    sections: {
      protocol_information: createSection(
        'protocol_information',
        'Protocol Information',
        'Basic information about your research protocol',
        moduleQuestions.protocol_information || []
      )
    }
  };

  // Add selected modules from wizard
  if (wizardState.selectedModules) {
    // Add core modules
    wizardState.selectedModules.core.forEach((moduleTitle: string) => {
      const sectionId = moduleTitle.toLowerCase().replace(/\s+/g, '_');
      config.sections[sectionId] = createSection(
        sectionId,
        moduleTitle,
        `Complete ${moduleTitle} information`,
        moduleQuestions[sectionId] || []
      );
    });

    // Add additional modules
    wizardState.selectedModules.additional.forEach((moduleTitle: string) => {
      const sectionId = moduleTitle.toLowerCase().replace(/\s+/g, '_');
      config.sections[sectionId] = createSection(
        sectionId,
        moduleTitle,
        `Complete ${moduleTitle} information`,
        moduleQuestions[sectionId] || []
      );
    });
  }

  // Add phase-specific sections if phase is selected
  if (wizardState.phase) {
    const phase = wizardState.phase as Phase;
    const phaseConfig = phaseModules[phase];
    
    if (phaseConfig && phaseConfig.sections) {
      phaseConfig.sections.forEach((section) => {
        config.sections[section.id] = {
          ...section,
          questions: moduleQuestions[section.id] || [],
          dynamicFields: false
        } as Section;
      });
    }
  }

  // Add data collection specific sections
  if (wizardState.dataCollection) {
    if (wizardState.dataCollection === 'prospective') {
      config.sections.data_collection_protocol = createSection(
        'data_collection_protocol',
        'Data Collection Protocol',
        'Define collection procedures',
        moduleQuestions.data_collection_protocol || []
      );
    } else {
      config.sections.data_source = createSection(
        'data_source',
        'Data Sources',
        'Document data sources',
        moduleQuestions.data_source || []
      );
    }
  }

  return config;
}; 