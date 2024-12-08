import { useCallback } from 'react';
import { formConfig } from '../config/formConfig';
import type { 
  FormData, 
  Section, 
  SectionDependency, 
  DateRange,
  WizardState,
  Phase,
  DataCollection
} from '../types/index';

export const useFormNavigation = (
  formData: FormData,
  activeSection: string,
  completedSections: string[],
  wizardState?: WizardState
) => {
  const checkSectionDependency = useCallback((section: Section, data: FormData): boolean => {
    if (!section.dependsOn) return true;
    
    // Check if section depends on wizard state
    if ('wizardState' in section.dependsOn) {
      const { phase, dataCollection } = wizardState || {};
      const wizardDeps = section.dependsOn as { 
        wizardState: { 
          phase?: Phase; 
          dataCollection?: DataCollection; 
        } 
      };
      
      if (wizardDeps.wizardState.phase && wizardDeps.wizardState.phase !== phase) {
        return false;
      }
      if (wizardDeps.wizardState.dataCollection && wizardDeps.wizardState.dataCollection !== dataCollection) {
        return false;
      }
    }
    
    // Check regular section dependencies
    const dependency = section.dependsOn as SectionDependency;
    const dependentValue = data[dependency.sectionId];
    
    if (Array.isArray(dependency.value)) {
      return typeof dependentValue === 'string' && dependency.value.includes(dependentValue);
    }
    
    return dependentValue === dependency.value;
  }, [wizardState]);

  const visibleSections = useCallback((data: FormData) => {
    return Object.entries(formConfig.sections)
      .filter(([_, section]) => checkSectionDependency(section, data))
      .map(([id]) => id);
  }, [checkSectionDependency]);

  const nextSection = useCallback(() => {
    const sections = visibleSections(formData);
    const currentIndex = sections.indexOf(activeSection);
    return sections[currentIndex + 1];
  }, [formData, activeSection, visibleSections]);

  const previousSection = useCallback(() => {
    const sections = visibleSections(formData);
    const currentIndex = sections.indexOf(activeSection);
    return sections[currentIndex - 1];
  }, [formData, activeSection, visibleSections]);

  const estimatedTimeRemaining = useCallback(() => {
    const sections = visibleSections(formData);
    const remainingSections = sections.length - completedSections.length;
    return Math.max(0, remainingSections * 5); // 5 minutes per section
  }, [formData, completedSections.length, visibleSections]);

  return {
    visibleSections,
    nextSection,
    previousSection,
    estimatedTimeRemaining
  };
}; 