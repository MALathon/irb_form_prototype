import { useState } from 'react';
import type { FormData, ValidationError as FormValidationError } from '../types';

interface ValidationErrors {
  [sectionId: string]: {
    [questionId: string]: FormValidationError;
  };
}

export const useFormValidation = (formData: FormData) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateSection = async (sectionId: string): Promise<boolean> => {
    const sectionData = formData[sectionId];
    if (!sectionData) {
      setErrors(prev => ({
        ...prev,
        [sectionId]: {
          general: { 
            message: 'Section data is missing',
            type: 'error'
          }
        }
      }));
      return false;
    }

    // Clear errors for this section if validation passes
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[sectionId];
      return newErrors;
    });
    
    return true;
  };

  const clearErrors = (sectionId: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[sectionId];
      return newErrors;
    });
  };

  const canProceed = (sectionId: string): boolean => {
    return !errors[sectionId] || Object.keys(errors[sectionId]).length === 0;
  };

  return {
    errors,
    validateSection,
    clearErrors,
    canProceed
  };
}; 