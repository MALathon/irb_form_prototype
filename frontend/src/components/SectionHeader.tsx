import React, { useState } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  StepIconProps, 
  StepConnector, 
  stepConnectorClasses, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import WarningIcon from '@mui/icons-material/Warning';
import type { Section } from '../types';

interface SectionHeaderProps {
  sections: Section[];
  completedSections: string[];
  skippedSections: string[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  disabledSections?: string[];
  wizardSteps?: string[];
  showAllSections?: boolean;
  onWizardStepClick?: () => void;
  onStartOver?: () => void;
  navigationHistory?: string[];
}

interface CustomStepIconProps extends StepIconProps {
  skipped?: boolean;
  disabled?: boolean;
  active?: boolean;
  isWizardStep?: boolean;
}

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const CustomStepIcon = (props: CustomStepIconProps) => {
  const { completed, skipped, disabled, active, isWizardStep } = props;
  
  if (completed) {
    return <CheckCircleIcon color={isWizardStep ? "disabled" : "success"} />;
  }
  if (skipped) {
    return <WarningIcon color="warning" />;
  }
  if (disabled || isWizardStep) {
    return <RadioButtonUncheckedIcon sx={{ color: 'text.disabled' }} />;
  }
  if (active) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 2,
          borderColor: 'primary.main',
          borderRadius: '50%',
          padding: '2px'
        }}
      >
        <RadioButtonUncheckedIcon color="primary" />
      </Box>
    );
  }
  return <RadioButtonUncheckedIcon />;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  sections,
  completedSections,
  skippedSections,
  activeSection,
  onSectionClick,
  disabledSections = [],
  wizardSteps = [],
  showAllSections = false,
  onWizardStepClick,
  onStartOver,
  navigationHistory = [],
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWizardStep, setSelectedWizardStep] = useState<string>('');

  const handleWizardStepClick = (sectionId: string) => {
    setSelectedWizardStep(sectionId);
    setDialogOpen(true);
  };

  const handleStartOver = () => {
    setDialogOpen(false);
    if (onStartOver) {
      onStartOver();
    }
  };

  const handleEditOnly = () => {
    setDialogOpen(false);
    if (onWizardStepClick) {
      onWizardStepClick();
    }
  };

  const visibleSections = sections.filter((section) => {
    if (showAllSections) return true;
    
    return (
      navigationHistory.includes(section.id) ||
      section.id === activeSection ||
      wizardSteps.includes(section.id)
    );
  });

  const handleSectionClick = (sectionId: string) => {
    if (wizardSteps.includes(sectionId)) {
      handleWizardStepClick(sectionId);
    } else if (!disabledSections.includes(sectionId) && 
               (navigationHistory.includes(sectionId) || completedSections.includes(sectionId))) {
      onSectionClick(sectionId);
    }
  };

  return (
    <>
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper 
          nonLinear 
          activeStep={visibleSections.findIndex(s => s.id === activeSection)}
          alternativeLabel
          connector={<CustomConnector />}
        >
          {visibleSections.map((section) => {
            const isDisabled = disabledSections.includes(section.id);
            const isActive = section.id === activeSection;
            const isWizardStep = wizardSteps.includes(section.id);
            
            return (
              <Step
                key={section.id}
                completed={completedSections.includes(section.id)}
                active={isActive}
              >
                <StepLabel
                  onClick={() => {
                    handleSectionClick(section.id);
                  }}
                  StepIconComponent={(props) => (
                    <CustomStepIcon 
                      {...props} 
                      skipped={skippedSections.includes(section.id)}
                      disabled={isDisabled}
                      active={isActive}
                      isWizardStep={isWizardStep}
                    />
                  )}
                  sx={{ 
                    cursor: isDisabled ? 'default' : 'pointer',
                    '&:hover': isDisabled ? {} : { color: isWizardStep ? 'text.disabled' : 'primary.main' },
                    color: isDisabled || isWizardStep ? 'text.disabled' : 
                           isActive ? 'primary.main' :
                           skippedSections.includes(section.id) ? 'warning.main' : undefined,
                  }}
                >
                  {section.title}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Change {selectedWizardStep === 'study_phase' ? 'Study Phase' : 'Data Collection'}?
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Starting over will clear all your current progress.
          </Alert>
          <Typography>
            Would you like to:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleEditOnly}
              fullWidth
              sx={{ mb: 1 }}
            >
              Just edit the {selectedWizardStep === 'study_phase' ? 'phase' : 'data collection type'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleStartOver}
              fullWidth
            >
              Start over with a new configuration
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SectionHeader; 