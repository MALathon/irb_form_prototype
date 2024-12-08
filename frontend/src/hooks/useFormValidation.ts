import { useState, useCallback } from 'react';
import type { FormData, ValidationError, DateRange } from '../types';
import { formConfig } from '../config/formConfig';

export const useFormValidation = (formData: FormData) => {
  const [errors, setErrors] = useState<Record<string, Record<string, ValidationError>>>({});
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const validateSection = useCallback(async (sectionId: string): Promise<boolean> => {
    const section = formConfig.sections[sectionId];
    if (!section) return false;

    const sectionErrors: Record<string, ValidationError> = {};
    let isComplete = true;
    
    section.questions.forEach(question => {
      if (!question.required) return;
      
      if (question.type === 'date-range') {
        const dateRange = formData.date_range as DateRange | undefined;
        console.log('Validating date range:', dateRange);
        if (!dateRange || !dateRange.start || !dateRange.end) {
          sectionErrors['date_range'] = {
            message: 'Both start and end dates are required',
            type: 'error'
          };
          isComplete = false;
        }
      } else {
        const value = formData[question.id];
        if (value === undefined || value === null || value === '') {
          sectionErrors[question.id] = {
            message: 'This field is required',
            type: 'error'
          };
          isComplete = false;
        }
      }
    });

    console.log('Validating section:', sectionId);
    console.log('Form data:', formData);
    console.log('Section errors:', sectionErrors);
    console.log('Is complete:', isComplete);

    setErrors(prev => {
      if (Object.keys(sectionErrors).length > 0) {
        return { ...prev, [sectionId]: sectionErrors };
      } else {
        const newErrors = { ...prev };
        delete newErrors[sectionId];
        return newErrors;
      }
    });

    return isComplete;
  }, [formData]);

  const canProceed = useCallback((sectionId: string): boolean => {
    const section = formConfig.sections[sectionId];
    const sectionErrors = errors[sectionId];
    const hasErrors = sectionErrors && Object.keys(sectionErrors).length > 0;

    // For the data requirements section, check all required fields
    if (sectionId === 'data_requirements') {
      const dateRange = formData.date_range as DateRange | undefined;
      const hasValidDateRange = Boolean(dateRange?.start && dateRange?.end);
      const hasRequiredFields = section.questions
        .filter(q => q.required)
        .every(q => {
          if (q.type === 'date-range') {
            return hasValidDateRange;
          }
          return formData[q.id] !== undefined && formData[q.id] !== null && formData[q.id] !== '';
        });

      console.log('Data requirements validation:', {
        hasErrors,
        hasValidDateRange,
        hasRequiredFields,
        dateRange,
        formData
      });

      return !hasErrors && hasRequiredFields && hasValidDateRange;
    }
    
    return !hasErrors;
  }, [errors, formData]);

  const clearErrors = useCallback((sectionId: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[sectionId];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateSection,
    clearErrors,
    canProceed,
    completedSections,
    setCompletedSections
  };
}; 