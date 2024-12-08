import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Stack,
  Alert,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import type { 
  FormData, 
  Section, 
  DateRange, 
  Question,
  ValidationError 
} from '../types/index';
import { formConfig } from '../config/formConfig';

interface ReviewPageProps {
  formData: FormData;
  onEdit: (sectionId: string) => void;
  onSubmit: () => void;
  skippedSections: string[];
}

const ReviewPage: React.FC<ReviewPageProps> = ({ 
  formData, 
  onEdit, 
  onSubmit,
  skippedSections
}) => {
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  const formatAnswer = (value: any, type: string, questionId: string) => {
    if (!value) return 'Not provided';
    
    if (type === 'date-range') {
      const dateRange = formData.date_range as DateRange;
      const start = formatDate(dateRange?.start);
      const end = formatDate(dateRange?.end);
      return `${start} to ${end}`;
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return value.toString();
  };

  const isQuestionIncomplete = (question: Question, sectionId: string) => {
    if (!question.required) return false;
    
    if (question.type === 'date-range') {
      const dateRange = formData.date_range as DateRange | undefined;
      return !dateRange?.start || !dateRange?.end;
    }
    
    const value = formData[question.id];
    return value === undefined || value === null || value === '';
  };

  const renderSectionReview = (section: Section) => {
    const isSkipped = skippedSections.includes(section.id);
    const incompleteQuestions = section.questions
      .filter(q => isQuestionIncomplete(q, section.id));

    // Only show section as skipped if it has incomplete required questions
    const hasIncompleteRequiredQuestions = incompleteQuestions.some(q => q.required);

    return (
      <Paper 
        key={section.id} 
        sx={{ 
          p: 3, 
          mb: 2,
          border: hasIncompleteRequiredQuestions ? '1px solid' : 'none',
          borderColor: 'warning.main',
          bgcolor: hasIncompleteRequiredQuestions ? 'warning.lighter' : 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color={hasIncompleteRequiredQuestions ? 'warning.dark' : 'text.primary'}>
            {section.title}
          </Typography>
          <Button
            startIcon={<EditIcon />}
            onClick={() => onEdit(section.id)}
            variant="outlined"
            color={hasIncompleteRequiredQuestions ? 'warning' : 'primary'}
            size="small"
          >
            Edit
          </Button>
        </Box>
        {hasIncompleteRequiredQuestions && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This section has incomplete required fields
          </Alert>
        )}
        <Divider sx={{ mb: 2 }} />
        {section.questions.map(question => {
          const isIncomplete = isQuestionIncomplete(question, section.id);
          return (
            <Box key={question.id} sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle2" 
                color={isIncomplete && question.required ? 'warning.dark' : 'text.secondary'}
              >
                {question.label}
                {question.required && ' *'}
              </Typography>
              <Typography>
                {formatAnswer(
                  question.type === 'date-range' ? formData.date_range : formData[question.id],
                  question.type,
                  question.id
                )}
              </Typography>
            </Box>
          );
        })}
      </Paper>
    );
  };

  const hasIncompleteFields = skippedSections.length > 0;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Review Your Responses</Typography>
      
      {hasIncompleteFields && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          Please complete all required fields before submitting
        </Alert>
      )}
      
      {Object.values(formConfig.sections).map(renderSectionReview)}
      
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onSubmit}
          disabled={hasIncompleteFields}
        >
          Submit Application
        </Button>
      </Stack>
    </Box>
  );
};

export default ReviewPage; 