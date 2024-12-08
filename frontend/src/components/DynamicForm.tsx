import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Chip,
  Stack,
} from '@mui/material';
import {
  HelpOutline as HelpIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as BackIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import type { 
  FormData, 
  DateRange, 
  FormConfig,
  WizardState,
  Question,
  Section,
} from '../types/index';
import { 
  FormSection,
  HelpPanel,
  SectionHeader,
} from './';
import { useFormValidation } from '../hooks';
import { formConfig, generateFormConfig } from '../config/formConfig';
import ReviewPage from './ReviewPage';
import LandingPage from './LandingPage';
import AIWizard from './AIWizard';
import { moduleQuestions } from '../config/moduleQuestions';

// Add RootLayout component at the top of the file
const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box 
    sx={{ 
      minHeight: '100vh',
      width: '100vw',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}
  >
    {children}
  </Box>
);

const DynamicForm: React.FC = () => {
  const theme = useTheme();
  const [wizardComplete, setWizardComplete] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({ 
    phase: undefined,
    dataCollection: undefined,
    estimatedTime: 0 
  });
  const [activeSection, setActiveSection] = useState('');
  const [formData, setFormData] = useState<FormData>({});
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [skippedSections, setSkippedSections] = useState<string[]>([]);
  const [visitedSections, setVisitedSections] = useState<string[]>(['initial_information']);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const isSettingsOpen = Boolean(settingsAnchorEl);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [phaseSelectOpen, setPhaseSelectOpen] = useState(false);
  const [dataTypeSelectOpen, setDataTypeSelectOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<{
    phase?: 'discovery' | 'pilot' | 'validation';
    dataCollection?: 'prospective' | 'retrospective';
  }>({});

  const { 
    errors, 
    validateSection, 
    clearErrors,
    canProceed 
  } = useFormValidation(formData);

  // Add currentFormConfig state
  const [currentFormConfig, setCurrentFormConfig] = useState<FormConfig>(() => 
    generateFormConfig({})
  );

  // Track skipped required fields for the current section
  const getSkippedFields = (sectionId: string) => {
    const section = currentFormConfig.sections[sectionId];
    if (!section) return [];
    
    return section.questions
      .filter((q: Question) => q.required === true)
      .filter((q: Question) => {
        if (q.type === 'date-range') {
          const dateRange = formData.date_range as DateRange | undefined;
          return !dateRange?.start || !dateRange?.end;
        }
        return !formData[q.id];
      })
      .map((q: Question) => q.id);
  };

  const handleQuestionChange = (questionId: string, value: unknown): void => {
    setFormData(prev => {
      const newData = { ...prev };

      if (questionId === 'date_range_start' || questionId === 'date_range_end') {
        const dateRange = (newData.date_range || {
          start: null,
          end: null
        }) as DateRange;
        
        if (questionId === 'date_range_start') {
          dateRange.start = value as Date;
        } else {
          dateRange.end = value as Date;
        }
        
        newData.date_range = dateRange;
      } else {
        if (value instanceof Date) {
          newData[questionId] = value;
        } else if (Array.isArray(value)) {
          newData[questionId] = value as string[];
        } else if (typeof value === 'number') {
          newData[questionId] = value;
        } else if (value === null) {
          newData[questionId] = null;
        } else if (typeof value === 'string') {
          newData[questionId] = value;
        }
      }

      return newData;
    });
    
    clearErrors(activeSection);
  };

  // Add function to check if section is incomplete
  const checkSectionCompletion = (sectionId: string) => {
    const section = currentFormConfig.sections[sectionId];
    const skippedFields = section.questions
      .filter(q => q.required === true)
      .filter(q => {
        if (q.type === 'date-range') {
          const dateRange = formData.date_range as DateRange | undefined;
          return !dateRange?.start || !dateRange?.end;
        }
        return !formData[q.id];
      })
      .map(q => q.id);

    return skippedFields.length > 0;
  };

  // Add new state for tracking navigation
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['initial_information']);
  
  // Add state for navigation warning dialog
  const [navigationWarningOpen, setNavigationWarningOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Improve section change handling
  const handleSectionChange = async (sectionId: string) => {
    // Check if current section is incomplete
    if (checkSectionCompletion(activeSection)) {
      setNavigationWarningOpen(true);
      setPendingNavigation(sectionId);
      return;
    }

    // Don't allow navigation to disabled sections
    if (disabledSections.includes(sectionId)) {
      return;
    }

    // Update navigation history
    setNavigationHistory(prev => [...prev, sectionId]);
    setActiveSection(sectionId);
    setVisitedSections(prev => 
      prev.includes(sectionId) ? prev : [...prev, sectionId]
    );
  };

  // Improve back navigation
  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current section
      const previousSection = newHistory[newHistory.length - 1];
      
      setNavigationHistory(newHistory);
      setActiveSection(previousSection);
    }
  };

  // Improve next navigation
  const handleNext = async () => {
    if (checkSectionCompletion(activeSection)) {
      setNavigationWarningOpen(true);
      return;
    }

    const isValid = await validateSection(activeSection);
    
    if (!isValid || !canProceed(activeSection)) {
      return;
    }

    if (activeSection === 'getting_started') {
      // After Getting Started, go to first module from wizard
      if (wizardState.selectedModules?.core.length) {
        const firstModuleId = wizardState.selectedModules.core[0].toLowerCase().replace(/\s+/g, '_');
        setActiveSection(firstModuleId);
        setNavigationHistory(prev => [...prev, firstModuleId]);
      }
    } else {
      // Normal next section logic
      const currentIndex = Object.keys(currentFormConfig.sections).indexOf(activeSection);
      const nextSection = Object.keys(currentFormConfig.sections)[currentIndex + 1];

      if (nextSection) {
        handleSectionChange(nextSection);
      } else {
        setIsReviewMode(true);
      }
    }
  };

  // Improve edit from review handling
  const handleEdit = (sectionId: string) => {
    setIsReviewMode(false);
    handleSectionChange(sectionId);
  };

  // Improve wizard completion handling
  const handleWizardComplete = (wizardState: WizardState) => {
    setWizardState(wizardState);
    setWizardComplete(true);
    setShowWizard(false);
    
    // Create the initial form configuration with Getting Started and wizard-selected modules
    const newConfig: FormConfig = {
      sections: {
        getting_started: {
          id: 'getting_started',
          title: 'Getting Started',
          description: 'Initial study information',
          questions: moduleQuestions.getting_started || [], // Use the questions from moduleQuestions
          isWizardStep: false
        }
      }
    };

    // Add wizard-selected modules to the configuration
    if (wizardState.selectedModules) {
      wizardState.selectedModules.core.forEach((moduleTitle) => {
        const sectionId = moduleTitle.toLowerCase().replace(/\s+/g, '_');
        newConfig.sections[sectionId] = {
          id: sectionId,
          title: moduleTitle,
          description: `Complete ${moduleTitle} information`,
          questions: moduleQuestions[sectionId] || [], // Use module-specific questions
          isWizardStep: false
        };
      });

      wizardState.selectedModules.additional.forEach((moduleTitle) => {
        const sectionId = moduleTitle.toLowerCase().replace(/\s+/g, '_');
        newConfig.sections[sectionId] = {
          id: sectionId,
          title: moduleTitle,
          description: `Complete ${moduleTitle} information`,
          questions: moduleQuestions[sectionId] || [], // Use module-specific questions
          isWizardStep: false
        };
      });
    }

    setCurrentFormConfig(newConfig);
    
    // Navigate to Getting Started
    setActiveSection('getting_started');
    setNavigationHistory(['ai_wizard', 'getting_started']);
  };

  // Add section completion tracking
  useEffect(() => {
    const checkSectionCompletion = () => {
      const section = currentFormConfig.sections[activeSection];
      if (!section) return;

      const isComplete = section.questions.every(q => {
        if (q.required !== true) return true;
        const value = formData[q.id];
        return value !== undefined && value !== null && value !== '';
      });

      if (isComplete && !completedSections.includes(activeSection)) {
        setCompletedSections(prev => [...prev, activeSection]);
      } else if (!isComplete && completedSections.includes(activeSection)) {
        setCompletedSections(prev => prev.filter(id => id !== activeSection));
      }
    };

    checkSectionCompletion();
  }, [activeSection, formData, currentFormConfig]);

  useEffect(() => {
    // Clear localStorage when the component mounts
    localStorage.removeItem('formProgress');
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const saved = localStorage.getItem('formProgress');
    if (saved) {
      try {
        const { formData: savedData, completedSections: savedSections, activeSection: savedSection } = JSON.parse(saved);
        
        const parsedData = Object.entries(savedData).reduce((acc, [key, value]) => {
          if (key === 'date_range' && value && typeof value === 'object') {
            const dateValue = value as { start: string | null; end: string | null };
            acc[key] = {
              start: dateValue.start ? new Date(dateValue.start) : null,
              end: dateValue.end ? new Date(dateValue.end) : null
            };
          } else if (typeof value === 'string') {
            acc[key] = value;
          } else if (Array.isArray(value)) {
            acc[key] = value;
          } else if (typeof value === 'number') {
            acc[key] = value;
          } else if (value === null) {
            acc[key] = null;
          } else if (value instanceof Date) {
            acc[key] = new Date(value);
          }
          return acc;
        }, {} as FormData);

        console.log('Loading saved progress:', { parsedData, savedSections, savedSection });
        setFormData(parsedData);
        setCompletedSections(savedSections);
        setActiveSection(savedSection);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  const section = currentFormConfig.sections[activeSection];

  const getValidationErrorMessages = () => {
    const sectionErrors = errors[activeSection];
    if (!sectionErrors) return {};
    
    return {
      [activeSection]: Object.values(sectionErrors).map(error => error.message)
    };
  };

  // Add state for submit dialog
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  // Update handleSubmit
  const handleSubmit = async () => {
    // Validate all sections before allowing submission
    const sections = Object.keys(currentFormConfig.sections);
    const validations = await Promise.all(
      sections.map(sectionId => validateSection(sectionId))
    );

    if (validations.some(isValid => !isValid)) {
      // Show error message about invalid sections
      return;
    }

    setSubmitDialogOpen(true);
  };

  // Add confirmation dialog
  <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)}>
    <DialogTitle>Submit Application?</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to submit your IRB application? Please ensure all sections are complete.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setSubmitDialogOpen(false)}>Review Again</Button>
      <Button 
        onClick={() => {
          console.log('Form submitted:', formData);
          // Add submission logic here
          setSubmitDialogOpen(false);
        }}
        color="primary"
        variant="contained"
      >
        Submit Application
      </Button>
    </DialogActions>
  </Dialog>

  // Add state for dialog
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Update handleClearForm to use dialog
  const handleClearForm = () => {
    setClearDialogOpen(true);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleStartForm = () => {
    setShowLandingPage(false);
    setShowWizard(true);
  };

  // Add these handler functions
  const handlePhaseClick = () => {
    setTempSelection({ phase: wizardState.phase });
    setPhaseSelectOpen(true);
  };

  const handleDataTypeClick = () => {
    setTempSelection({ dataCollection: wizardState.dataCollection });
    setDataTypeSelectOpen(true);
  };

  // Add proper type checking for wizard steps
  const isWizardStep = (sectionId: string): boolean => {
    return sectionId === 'ai_wizard';
  };

  // Update getBreadcrumbSections to use proper Section interface
  const getBreadcrumbSections = () => {
    // AI Wizard is always first
    const sections: Record<string, Section> = {
      ai_wizard: {
        id: 'ai_wizard',
        title: 'AI Wizard',
        description: 'Configure study type',
        questions: [],
        isWizardStep: true
      },
      getting_started: {
        id: 'getting_started',
        title: 'Getting Started',
        description: 'Initial study information',
        questions: moduleQuestions.getting_started,
        isWizardStep: false
      }
    };

    // Add module sections from wizard selections
    wizardState.selectedModules?.core.forEach((moduleTitle) => {
      const sectionId = moduleTitle.toLowerCase().replace(/\s+/g, '_');
      sections[sectionId] = {
        id: sectionId,
        title: moduleTitle,
        description: `Complete ${moduleTitle} information`,
        questions: [], // Questions would be defined in formConfig
        dynamicFields: false,
        isWizardStep: false
      };
    });

    wizardState.selectedModules?.additional.forEach((moduleTitle) => {
      const sectionId = moduleTitle.toLowerCase().replace(/\s+/g, '_');
      sections[sectionId] = {
        id: sectionId,
        title: moduleTitle,
        description: `Complete ${moduleTitle} information`,
        questions: [], // Questions would be defined in formConfig
        dynamicFields: false,
        isWizardStep: false
      };
    });

    return sections;
  };

  // Add this effect to track visited sections
  useEffect(() => {
    if (activeSection && !visitedSections.includes(activeSection)) {
      setVisitedSections(prev => [...prev, activeSection]);
    }
  }, [activeSection]);

  // Update the disabledSections calculation to use visitedSections
  const disabledSections = Object.entries(currentFormConfig.sections)
    .filter(([id, section]) => 
      id !== 'initial_information' && 
      !visitedSections.includes(id) &&
      !completedSections.includes(id) ||
      section.isDisabled === true ||
      (isWizardStep(id) && !wizardComplete)
    )
    .map(([id]) => id);

  // Add renderFormSection function
  const renderFormSection = () => {
    if (!section) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error">
            Error: Could not find section configuration for "{activeSection}"
          </Typography>
        </Box>
      );
    }

    return (
      <FormSection
        section={section}
        data={formData}
        onChange={handleQuestionChange}
        errors={errors[activeSection] || {}}
        skippedFields={skippedSections.includes(activeSection) ? getSkippedFields(activeSection) : []}
        onHelpClick={() => setHelpOpen(true)}
        helpIcon={<HelpIcon />}
      />
    );
  };

  // Add renderStudyTypeChip function
  const renderStudyTypeChip = () => (
    <Box sx={{ 
      position: 'absolute', 
      top: -40,
      right: 48,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      zIndex: 1
    }}>
      {wizardState.phase && (
        <Chip
          label={`${wizardState.phase.charAt(0).toUpperCase()}${wizardState.phase.slice(1)} Phase`}
          color="primary"
          variant="outlined"
          onClick={handlePhaseClick}
          onDelete={handlePhaseClick}
          deleteIcon={<EditIcon />}
          sx={{ 
            '& .MuiChip-deleteIcon': {
              color: 'primary.main',
              '&:hover': {
                color: 'primary.dark'
              }
            }
          }}
        />
      )}
      {wizardState.dataCollection && (
        <Chip
          label={`${wizardState.dataCollection.charAt(0).toUpperCase()}${wizardState.dataCollection.slice(1)} Data`}
          color="primary"
          variant="outlined"
          onClick={handleDataTypeClick}
          onDelete={handleDataTypeClick}
          deleteIcon={<EditIcon />}
          sx={{ 
            '& .MuiChip-deleteIcon': {
              color: 'primary.main',
              '&:hover': {
                color: 'primary.dark'
              }
            }
          }}
        />
      )}
    </Box>
  );

  // Update render conditions to use RootLayout
  if (showLandingPage) {
    return (
      <RootLayout>
        <LandingPage onStart={handleStartForm} />
      </RootLayout>
    );
  }

  if (showWizard) {
    return (
      <RootLayout>
        <AIWizard 
          onComplete={handleWizardComplete} 
          initialState={wizardState}
        />
      </RootLayout>
    );
  }

  if (isReviewMode) {
    return (
      <RootLayout>
        <ReviewPage
          formData={formData}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          skippedSections={skippedSections}
        />
      </RootLayout>
    );
  }

  // Add these computed values
  const isLastSection = activeSection === Object.keys(currentFormConfig.sections)[Object.keys(currentFormConfig.sections).length - 1];
  const canNavigateBack = (() => {
    // Disable back button if we're on Getting Started (first form after AI Wizard)
    if (activeSection === 'getting_started') {
      return false;
    }
    
    // Otherwise, use normal navigation rules
    return activeSection !== 'initial_information' || showWizard;
  })();

  // Update the settings menu to use more icons meaningfully
  const renderSettingsMenu = () => (
    <Menu
      anchorEl={settingsAnchorEl}
      open={isSettingsOpen}
      onClose={handleSettingsClose}
    >
      <MenuItem onClick={() => {
        handleClearForm();
        handleSettingsClose();
      }}>
        <ListItemIcon>
          <DeleteIcon color="error" />
        </ListItemIcon>
        <ListItemText>Clear Form</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleSettingsClose}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText>Edit Settings</ListItemText>
      </MenuItem>
    </Menu>
  );

  // Add icons to navigation buttons
  const renderNavigationButtons = () => (
    <Box sx={{ 
      mt: theme.spacing(4), 
      display: 'flex', 
      justifyContent: 'space-between',
      borderTop: `1px solid ${theme.palette.divider}`,
      pt: theme.spacing(3)
    }}>
      <Button
        startIcon={<BackIcon />}
        onClick={handleBack}
        disabled={!canNavigateBack}
      >
        Back
      </Button>
      <Button
        variant="contained"
        endIcon={isLastSection ? <CheckCircleIcon /> : <NavigateNextIcon />}
        onClick={handleNext}
      >
        {isLastSection ? 'Review' : 'Next'}
      </Button>
    </Box>
  );

  // Move all dialogs into a fragment inside the main return statement
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Title Section */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          pt: theme.spacing(4),
          pb: theme.spacing(2)
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h3" gutterBottom color="primary.dark" sx={{ fontWeight: 700 }}>
                IRB Application Builder
              </Typography>
              <IconButton 
                onClick={() => setHelpOpen(true)}
                color="primary"
                sx={{ mt: -1 }}
              >
                <HelpIcon />
              </IconButton>
            </Box>
            
            {/* Add Timer */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: 'background.paper',
              p: 1,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider'
            }}>
              <AccessTimeIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Est. time: {wizardState.estimatedTime} min
              </Typography>
            </Box>
          </Box>
          <Typography variant="h6" color="text.secondary">
            Complete each section to build your comprehensive IRB application
          </Typography>
        </Container>
      </Box>

      {/* Breadcrumb Navigation */}
      <Box 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', py: 2 }}>
          {renderStudyTypeChip()}
          <SectionHeader
            sections={Object.values(getBreadcrumbSections())}
            completedSections={['ai_wizard', ...completedSections]} // Always include ai_wizard as completed
            skippedSections={skippedSections}
            activeSection={activeSection}
            onSectionClick={handleSectionChange}
            wizardSteps={['ai_wizard']}
            showAllSections={true}  // Always show all sections after wizard
            disabledSections={disabledSections}
            navigationHistory={navigationHistory}
            onWizardStepClick={() => {
              setPhaseSelectOpen(true);
            }}
            onStartOver={() => {
              handleClearForm();
              setShowWizard(true);
            }}
          />
        </Container>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative' }}>
            {/* Settings Button */}
            <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
              <IconButton onClick={handleSettingsClick}>
                <SettingsIcon />
              </IconButton>
              {renderSettingsMenu()}
            </Box>

            {/* Form Section */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderFormSection()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {renderNavigationButtons()}
          </Box>
        </Container>
      </Box>

      {/* Help Panel */}
      <Drawer
        anchor="right"
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <HelpPanel
          section={section}
          onClose={() => setHelpOpen(false)}
        />
      </Drawer>

      {/* Floating Help Button for Mobile */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'block', md: 'none' }
        }}
      >
        <IconButton
          onClick={() => setHelpOpen(true)}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.common.white,
            '&:hover': {
              bgcolor: theme.palette.primary.dark
            },
            boxShadow: theme.shadows[2],
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.short
            })
          }}
        >
          <HelpIcon />
        </IconButton>
      </Box>

      {/* Group all dialogs together */}
      <>
        {/* Submit Dialog */}
        <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)}>
          <DialogTitle>Submit Application?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to submit your IRB application? Please ensure all sections are complete.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSubmitDialogOpen(false)}>Review Again</Button>
            <Button 
              onClick={() => {
                console.log('Form submitted:', formData);
                setSubmitDialogOpen(false);
              }}
              color="primary"
              variant="contained"
            >
              Submit Application
            </Button>
          </DialogActions>
        </Dialog>

        {/* Navigation Warning Dialog */}
        <Dialog open={navigationWarningOpen} onClose={() => setNavigationWarningOpen(false)}>
          <DialogTitle>Incomplete Section</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              This section has incomplete required fields:
            </Typography>
            {/* Add error messages */}
            <Box sx={{ mt: 2 }}>
              {Object.entries(getValidationErrorMessages()).map(([sectionId, messages]) => (
                messages.map((message, index) => (
                  <Typography 
                    key={`${sectionId}-${index}`} 
                    color="error" 
                    variant="body2" 
                    sx={{ mt: 1 }}
                  >
                    • {message}
                  </Typography>
                ))
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNavigationWarningOpen(false)}>
              Stay Here
            </Button>
            <Button 
              onClick={() => {
                if (pendingNavigation) {
                  setActiveSection(pendingNavigation);
                  setNavigationWarningOpen(false);
                  setPendingNavigation(null);
                }
              }}
              color="warning"
            >
              Leave Anyway
            </Button>
          </DialogActions>
        </Dialog>

        {/* Phase Selection Dialog */}
        <Dialog open={phaseSelectOpen} onClose={() => setPhaseSelectOpen(false)}>
          <DialogTitle>Change Study Phase</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {['discovery', 'pilot', 'validation'].map((phase) => (
                <Button
                  key={phase}
                  variant={tempSelection.phase === phase ? 'contained' : 'outlined'}
                  onClick={() => {
                    setTempSelection(prev => ({ ...prev, phase: phase as 'discovery' | 'pilot' | 'validation' }));
                    setWizardState(prev => ({
                      ...prev,
                      phase: phase as 'discovery' | 'pilot' | 'validation'
                    }));
                    const newConfig = generateFormConfig({
                      ...wizardState,
                      phase: phase as 'discovery' | 'pilot' | 'validation'
                    });
                    setCurrentFormConfig(newConfig);
                    setPhaseSelectOpen(false);
                  }}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {phase} Phase
                </Button>
              ))}
            </Stack>
          </DialogContent>
        </Dialog>

        {/* Data Type Selection Dialog */}
        <Dialog open={dataTypeSelectOpen} onClose={() => setDataTypeSelectOpen(false)}>
          <DialogTitle>Change Data Collection Type</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {['prospective', 'retrospective'].map((type) => (
                <Button
                  key={type}
                  variant={tempSelection.dataCollection === type ? 'contained' : 'outlined'}
                  onClick={() => {
                    setTempSelection(prev => ({ ...prev, dataCollection: type as 'prospective' | 'retrospective' }));
                    setWizardState(prev => ({
                      ...prev,
                      dataCollection: type as 'prospective' | 'retrospective'
                    }));
                    const newConfig = generateFormConfig({
                      ...wizardState,
                      dataCollection: type as 'prospective' | 'retrospective'
                    });
                    setCurrentFormConfig(newConfig);
                    setDataTypeSelectOpen(false);
                  }}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {type} Data Collection
                </Button>
              ))}
            </Stack>
          </DialogContent>
        </Dialog>

        {/* Clear Form Dialog */}
        <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
          <DialogTitle>Clear Form?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to clear all form data? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                localStorage.removeItem('formProgress');
                setFormData({});
                setCompletedSections([]);
                setSkippedSections([]);
                setVisitedSections(['initial_information']);
                setActiveSection('initial_information');
                setIsReviewMode(false);
                setShowLandingPage(true);
                setShowWizard(false);
                setWizardState({ 
                  phase: undefined,
                  dataCollection: undefined,
                  estimatedTime: 0 
                });
                setCurrentFormConfig(formConfig);
                clearErrors(activeSection);
                setClearDialogOpen(false);
              }}
              color="error"
            >
              Clear All Data
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </Box>
  );
};

export default DynamicForm; 