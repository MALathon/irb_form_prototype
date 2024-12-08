import React from 'react';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
  FormLabel,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { DateRange, Question, FormSectionProps } from '../types/form';
import { TeamManagement } from './TeamManagement';
import type { SxProps, Theme } from '@mui/material/styles';
import ChipSelect from './ChipSelect';
import { FileUpload, type UploadedFile } from './FileUpload';

const getDropdownValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return '';
};

const FormSection: React.FC<FormSectionProps> = ({
  section,
  data,
  onChange,
  errors = {},
  skippedFields = [],
  onHelpClick,
  helpIcon
}) => {
  if (!section) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">
          Error: Section configuration is missing
        </Typography>
      </Box>
    );
  }

  const getQuestionContainerStyles = (isSkipped: boolean): SxProps<Theme> => {
    if (!isSkipped) return {};
    
    return {
      p: 2,
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'warning.light',
      bgcolor: 'warning.lighter',
      '& .MuiFormLabel-root': {
        color: 'warning.dark',
      },
    } as const;
  };

  const renderQuestionInput = (question: Question) => {
    const error = errors[question.id];

    switch (question.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            multiline={question.multiline}
            rows={question.multiline ? 4 : 1}
            value={data[question.id] || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
            error={!!error}
            helperText={error?.message}
          />
        );

      case 'dropdown':
        return (
          <FormControl fullWidth error={!!error}>
            <Select
              value={getDropdownValue(data[question.id])}
              onChange={(e: SelectChangeEvent<string>) => onChange(question.id, e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Select an option</em>
              </MenuItem>
              {question.options?.map((option) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                return (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        );

      case 'date-range': {
        const dateRange = (data.date_range || { start: null, end: null }) as DateRange;
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newDate) => {
                  onChange('date_range_start', newDate);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message
                  }
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newDate) => {
                  onChange('date_range_end', newDate);
                }}
                minDate={startDate || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message
                  }
                }}
              />
            </Stack>
          </LocalizationProvider>
        );
      }

      case 'chips':
        return (
          <ChipSelect
            options={question.options?.map(opt => 
              typeof opt === 'string' ? opt : opt.value
            ) || []}
            selected={Array.isArray(data[question.id]) ? data[question.id] as string[] : []}
            onChange={(selected) => onChange(question.id, selected)}
          />
        );

      case 'multi_select_with_detail':
        // Implementation for multi-select with additional details
        return null;

      case 'checkbox_group':
        // Implementation for checkbox group
        return null;

      case 'radio':
        return (
          <FormControl fullWidth error={!!error}>
            <RadioGroup
              value={data[question.id] || 'no'}
              onChange={(e) => onChange(question.id, e.target.value)}
            >
              {question.options?.map((option) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                const disabled = typeof option === 'string' ? false : option.disabled;
                const isComingSoon = typeof option === 'string' ? false : option.isComingSoon;
                
                return (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {label}
                        {isComingSoon && (
                          <Chip
                            label="Coming Soon"
                            size="small"
                            color="info"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                    disabled={disabled}
                    sx={{
                      opacity: disabled ? 0.6 : 1,
                      '&:hover': {
                        cursor: disabled ? 'not-allowed' : 'pointer'
                      }
                    }}
                  />
                );
              })}
            </RadioGroup>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        );

      case 'rich_text':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={data[question.id] || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
            error={!!error}
            helperText={error?.message}
            placeholder={question.placeholder}
          />
        );

      case 'file_upload':
        return (
          <FileUpload
            value={data[question.id] as UploadedFile[] || []}
            onChange={(files) => {
              onChange(question.id, files);
            }}
            multiple={true}
            onFileDelete={(fileId) => {
              const currentFiles = data[question.id] as UploadedFile[] || [];
              onChange(
                question.id, 
                currentFiles.filter(f => f.id !== fileId)
              );
            }}
            onFileDownload={(file) => {
              // Handle file download if needed
              console.log('Download file:', file);
            }}
          />
        );

      case 'team_list':
        return (
          <TeamManagement
            value={data[question.id] || []}
            onChange={(members) => onChange(question.id, members)}
          />
        );

      default:
        return (
          <Typography color="error">
            Unsupported question type: {question.type}
          </Typography>
        );
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        gap: 1
      }}>
        <Typography variant="h5" component="h1">{section.title}</Typography>
        {helpIcon && onHelpClick && (
          <IconButton 
            onClick={onHelpClick}
            size="small"
            sx={{ mt: -0.5 }}
          >
            {helpIcon}
          </IconButton>
        )}
      </Box>

      <Typography variant="body1" sx={{ mb: 4 }}>{section.description}</Typography>

      <Stack spacing={4}>
        {section.questions.map((question: Question) => {
          const isSkipped = skippedFields?.includes(question.id);
          return (
            <Box 
              key={question.id} 
              sx={{ 
                ...getQuestionContainerStyles(isSkipped)
              }}
            >
              <FormControl fullWidth error={!!errors[question.id]}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FormLabel 
                    required={question.required} 
                    sx={{ flex: 1 }}
                  >
                    {question.label}
                  </FormLabel>
                  {question.tooltip && (
                    <Tooltip title={question.tooltip} arrow placement="top">
                      <IconButton size="small">
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                {renderQuestionInput(question)}
              </FormControl>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default FormSection; 