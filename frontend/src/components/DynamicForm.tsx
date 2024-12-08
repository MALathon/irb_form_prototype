import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
  ThemeProvider,
  CssBaseline,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material';
import {
  HelpOutline as HelpIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../theme/theme';
import type { 
  FormData, 
  Section, 
  DateRange, 
  ValidationError,
  FormConfig,
  Question,
  WizardState
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

// Add type for wizard sections
interface WizardSection {
  id: string;
  title: string;
  description: string;
  questions: never[];
  isWizardStep: boolean;
}

interface WizardSections {
  [key: string]: WizardSection;
}

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
      .filter((q: Question) => q.required)
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
      .filter(q => q.required)
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
  
  // Improve section change handling
  const handleSectionChange = (sectionId: string) => {
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
  const handleNext = () => {
    const currentIndex = Object.keys(currentFormConfig.sections).indexOf(activeSection);
    const nextSection = Object.keys(currentFormConfig.sections)[currentIndex + 1];

    if (nextSection) {
      handleSectionChange(nextSection);
    } else {
      // If no next section, move to review
      setIsReviewMode(true);
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
    
    // Generate new form config based on wizard selections
    const newConfig = generateFormConfig(wizardState);
    setCurrentFormConfig(newConfig);
    
    // Add wizard steps to completed sections
    setCompletedSections(['study_phase', 'data_collection']);
    
    // Start with initial section
    setActiveSection('initial_information');
    setNavigationHistory(['initial_information']);
  };

  // Add section completion tracking
  useEffect(() => {
    const checkSectionCompletion = () => {
      const section = currentFormConfig.sections[activeSection];
      if (!section) return;

      const isComplete = section.questions.every(q => {
        if (!q.required) return true;
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

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const handleClearForm = () => {
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

  const handlePhaseChange = (newPhase: 'discovery' | 'pilot' | 'validation') => {
    const newWizardState = {
      ...wizardState,
      phase: newPhase,
    };
    
    // Update form configuration while preserving data
    const newConfig = generateFormConfig(newWizardState);
    const wizardSections: WizardSections = {
      study_phase: {
        id: 'study_phase',
        title: 'Study Phase',
        description: 'Select your AI study phase',
        questions: [],
        isWizardStep: true
      },
      data_collection: {
        id: 'data_collection',
        title: 'Data Collection',
        description: 'Define your data collection approach',
        questions: [],
        isWizardStep: true
      },
      ...newConfig.sections
    };

    // Store current form data
    const storedData = { ...formData };

    // Update configuration and wizard state
    setCurrentFormConfig({ sections: wizardSections });
    setWizardState(newWizardState);

    // Update completed sections
    setCompletedSections(prev => {
      const newCompleted = new Set(prev);
      // Add wizard steps
      newCompleted.add('study_phase');
      // Add sections that have data
      Object.keys(storedData).forEach(sectionId => {
        if (sectionId in wizardSections) {
          newCompleted.add(sectionId);
        }
      });
      return Array.from(newCompleted);
    });

    // Restore form data
    setFormData(storedData);
    setPhaseSelectOpen(false);
  };

  const handleDataTypeChange = (newDataType: 'prospective' | 'retrospective') => {
    const newWizardState = {
      ...wizardState,
      dataCollection: newDataType,
    };
    
    // Update form configuration while preserving data
    const newConfig = generateFormConfig(newWizardState);
    const wizardSections: WizardSections = {
      study_phase: {
        id: 'study_phase',
        title: 'Study Phase',
        description: 'Select your AI study phase',
        questions: [],
        isWizardStep: true
      },
      data_collection: {
        id: 'data_collection',
        title: 'Data Collection',
        description: 'Define your data collection approach',
        questions: [],
        isWizardStep: true
      },
      ...newConfig.sections
    };

    // Store current form data
    const storedData = { ...formData };

    // Update configuration and wizard state
    setCurrentFormConfig({ sections: wizardSections });
    setWizardState(newWizardState);

    // Update completed sections
    setCompletedSections(prev => {
      const newCompleted = new Set(prev);
      // Add wizard steps
      newCompleted.add('study_phase');
      newCompleted.add('data_collection');
      // Add sections that have data
      Object.keys(storedData).forEach(sectionId => {
        if (sectionId in wizardSections) {
          newCompleted.add(sectionId);
        }
      });
      return Array.from(newCompleted);
    });

    // Restore form data
    setFormData(storedData);
    setDataTypeSelectOpen(false);

    // If both phase and data collection are set, complete the wizard
    if (newWizardState.phase && newWizardState.dataCollection) {
      handleWizardComplete(newWizardState);
    }
  };

  // Add this function to handle the initial path selection
  const handlePathSelection = (path: 'guided' | 'direct') => {
    if (path === 'direct') {
      // Go directly to phase selection
      setActiveSection('study_phase');
      setNavigationHistory(['study_phase']);
    } else {
      // Start guided flow
      setActiveSection('ai_readiness');
      setNavigationHistory(['ai_readiness']);
    }
  };

  // Add this function to handle phase/data collection updates
  const handleWizardStateUpdate = (updates: Partial<WizardState>) => {
    const newState = { ...wizardState, ...updates };
    setWizardState(newState);
    const newConfig = generateFormConfig(newState);
    setCurrentFormConfig(newConfig);
  };

  // Add proper type checking for wizard steps
  const isWizardStep = (sectionId: string): boolean => {
    return ['study_phase', 'data_collection'].includes(sectionId);
  };

  // Update the disabledSections calculation
  const disabledSections = Object.entries(currentFormConfig.sections)
    .filter(([id, section]) => 
      id !== 'initial_information' && 
      !completedSections.includes(id) ||
      section.isDisabled === true ||
      (isWizardStep(id) && !wizardComplete)
    )
    .map(([id]) => id);

  // Add check before rendering FormSection
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

  // Add this helper function to transform validation errors
  const transformValidationErrors = (errors: Record<string, Record<string, ValidationError>>): Record<string, string[]> => {
    return Object.entries(errors).reduce((acc, [sectionId, sectionErrors]) => {
      acc[sectionId] = Object.values(sectionErrors).map(error => error.message);
      return acc;
    }, {} as Record<string, string[]>);
  };

  // Add these computed values
  const isLastSection = activeSection === Object.keys(currentFormConfig.sections)[Object.keys(currentFormConfig.sections).length - 1];
  const canNavigateBack = activeSection !== 'initial_information' || showWizard;

  // Main form view
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Title Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          pt: 4,
          pb: 2
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom color="primary.dark" sx={{ fontWeight: 700 }}>
            IRB Application Builder
          </Typography>
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
            sections={Object.values(currentFormConfig.sections)}
            completedSections={completedSections}
            skippedSections={skippedSections}
            activeSection={activeSection}
            onSectionClick={handleSectionChange}
            wizardSteps={['study_phase', 'data_collection']}
            showAllSections={wizardComplete}
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
              </Menu>
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
            <Box sx={{ 
              mt: 4, 
              display: 'flex', 
              justifyContent: 'space-between',
              borderTop: 1,
              borderColor: 'divider',
              pt: 3
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
                endIcon={<NextIcon />}
                onClick={handleNext}
              >
                {isLastSection ? 'Review' : 'Next'}
              </Button>
            </Box>
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
    </Box>
  );
};

export default DynamicForm; 