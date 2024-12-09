import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIconProps,
} from '@mui/material';
import {
  Timer as TimerIcon,
  Refresh as RefreshIcon,
  NavigateNext as NavigateNextIcon,
  ArrowBack as BackIcon,
  CheckCircle as BaseModuleIcon,
  AddCircle as NewModuleIcon,
  CheckCircle as CheckCircleIcon,
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  Storage as StorageIcon,
  Addchart as NewDataIcon,
  PushPin as PinIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './';
import ScrollIndicator from './ScrollIndicator';
import { 
  PHASES,
  DATA_COLLECTION_TYPES,
  phaseModules,
  dataCollectionModules,
  getModulesForSelection,
  calculateTotalTime,
  TIME_ESTIMATES
} from '../config/wizardConfig';
import { wizardSteps, directPathSections, guidedPathSections } from '../config/wizardStepsConfig';

import type {
  Phase,
  DataCollection,
  WizardState,
  WizardStepOption,
  WizardStep
} from '../types/wizard';

import { isPhase, isDataCollection } from '../types/wizard';
import type { Section } from '../types/form';

interface AIWizardProps {
  onComplete: (state: WizardState) => void;
  initialState?: WizardState;
}

// Update the interface to handle readonly arrays
interface ModuleListConfig {
  core: string[];
  additional: string[];
}

const renderModuleList = (moduleConfig: ModuleListConfig) => {
  const allModules = [...moduleConfig.core, ...moduleConfig.additional];
  return (
    <List>
      {allModules.map((module, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            {index < moduleConfig.core.length ? 
              <BaseModuleIcon color="success" /> 
              : 
              <NewModuleIcon color="info" />
            }
          </ListItemIcon>
          <ListItemText primary={module} />
        </ListItem>
      ))}
    </List>
  );
};

interface PhaseConfirmationProps {
  phase: Phase;
  dataCollection: DataCollection;
  estimatedTime: number;
  onConfirm: () => void;
  onReset: () => void;
  onBack: () => void;
  renderModuleList: (moduleConfig: ModuleListConfig) => React.ReactNode;
}

const PhaseConfirmation: React.FC<PhaseConfirmationProps> = ({
  phase,
  dataCollection,
  estimatedTime,
  onConfirm,
  onReset,
  onBack,
  renderModuleList
}) => {
  // Add default values and type guards
  const safePhase = phase || '';
  const safeDataCollection = dataCollection || '';
  const phaseTitle = safePhase ? `${safePhase.charAt(0).toUpperCase()}${safePhase.slice(1)} Phase` : '';
  const dataTitle = safeDataCollection ? `${safeDataCollection.charAt(0).toUpperCase()}${safeDataCollection.slice(1)} Data` : '';

  // Early return if we don't have required data
  if (!phase || !dataCollection) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error" gutterBottom>
            Please complete all selections before proceeding.
          </Typography>
          <Button
            variant="contained"
            onClick={onBack}
            startIcon={<BackIcon />}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" color="primary.dark" align="center" gutterBottom>
        Great! Here's Your Study Plan
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        We've tailored this plan based on your needs. Don't worry - you can always adjust these selections later if needed.
      </Typography>

      {/* Main Content - Three Column Layout */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 3,
        mb: 4
      }}>
        {/* Phase Info */}
        <Paper sx={{ 
          p: 3, 
          height: 'fit-content',
          position: 'relative'  // Add for pin positioning
        }}>
          <PinIcon sx={{ 
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%) rotate(-45deg)',
            color: 'primary.main',
            fontSize: 28
          }} />
          <Typography variant="overline" color="primary.main">
            Study Phase
          </Typography>
          <Typography variant="h6" gutterBottom>
            {phaseTitle}
          </Typography>
          {phase && phaseModules[phase] && (
            <Box sx={{ 
              p: 1.5, 
              bgcolor: 'primary.lighter', 
              borderRadius: 1,
              mt: 1
            }}>
              {renderModuleList(phaseModules[phase].modules)}
            </Box>
          )}
        </Paper>

        {/* Data Collection Info */}
        <Paper sx={{ 
          p: 3, 
          height: 'fit-content',
          position: 'relative'  // Add for pin positioning
        }}>
          <PinIcon sx={{ 
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%) rotate(-45deg)',
            color: 'primary.main',
            fontSize: 28
          }} />
          <Typography variant="overline" color="primary.main">
            Data Collection
          </Typography>
          <Typography variant="h6" gutterBottom>
            {dataTitle}
          </Typography>
          {dataCollection && dataCollectionModules[dataCollection] && (
            <Box sx={{ 
              p: 1.5, 
              bgcolor: 'info.lighter', 
              borderRadius: 1,
              mt: 1
            }}>
              {renderModuleList(dataCollectionModules[dataCollection].modules)}
            </Box>
          )}
        </Paper>

        {/* Time Estimate & Actions */}
        <Paper sx={{ 
          p: 3, 
          height: 'fit-content',
          position: 'relative'  // Add for pin positioning
        }}>
          <PinIcon sx={{ 
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%) rotate(-45deg)',
            color: 'primary.main',
            fontSize: 28
          }} />
          <Typography variant="overline" color="primary.main">
            Estimated Time
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 3
          }}>
            <TimerIcon color="primary" />
            <Typography variant="h6">
              {estimatedTime} minutes
            </Typography>
          </Box>
          
          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={onConfirm}
              sx={{ 
                bgcolor: 'success.main',
                '&:hover': {
                  bgcolor: 'success.dark'
                }
              }}
            >
              Confirm & Start
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<BackIcon />}
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              size="large"
              color="error"
              onClick={onReset}
              startIcon={<RefreshIcon />}
            >
              Start Over
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Box sx={{ mt: 3, mb: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Ready to start building your IRB application? Click 'Confirm & Start' below. 
          You can always come back and modify your selections if needed.
        </Typography>
      </Box>
    </Container>
  );
};

const AIWizard: React.FC<AIWizardProps> = ({ onComplete, initialState }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [path, setPath] = useState<'guided' | 'direct' | null>(null);
  const [state, setState] = useState<WizardState>(initialState || {
    phase: undefined,
    dataCollection: undefined,
    estimatedTime: 0
  });
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Update the directSelections state to use proper types
  const [directSelections, setDirectSelections] = useState<{
    phase: Phase | null;
    dataCollection: DataCollection | null;
  }>({
    phase: null,
    dataCollection: null
  });

  // Update sections based on path
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'selection_method',
      title: '90',
      description: 'Choose how to proceed',
      questions: [],
      isWizardStep: true,
      dynamicFields: false
    }
  ]);

  // Update useEffect to only set sections when path is selected
  useEffect(() => {
    if (path === 'direct') {
      setSections(directPathSections);
    } else if (path === 'guided') {
      setSections(guidedPathSections);
    } else {
      // If no path selected, only show Getting Started
      setSections([{
        id: 'selection_method',
        title: 'Getting Started',
        description: 'Choose how to proceed',
        questions: [],
        isWizardStep: true,
        dynamicFields: false
      }]);
    }
  }, [path]);

  // Add completedSections state
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  // Add useEffect to handle state initialization
  useEffect(() => {
    if (initialState) {
      setState(initialState);
    }
  }, [initialState]);

  // Add state to track initial selection
  const [initialSelection, setInitialSelection] = useState<'direct' | 'guided' | null>(null);

  // Add state to track guided path selections
  const [guidedSelections, setGuidedSelections] = useState<{
    aiReadiness: string;
    dataPlans: string;
  }>({
    aiReadiness: '',
    dataPlans: ''
  });

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    
    if (currentStep === 0) {
      if (value === 'direct' || value === 'guided') {
        setInitialSelection(value);
        setPath(value);
        setSections(value === 'direct' ? directPathSections : guidedPathSections);
      }
      setState((prev: WizardState): WizardState => ({
        ...prev,
        estimatedTime: 0
      }));
      return;
    }
    
    if (path === 'direct') {
      if (isPhase(value)) {
        const dataCollectionType = directSelections.dataCollection;
        
        setDirectSelections(prev => ({ ...prev, phase: value }));
        setState((prev: WizardState): WizardState => ({
          ...prev,
          phase: value,
          // Only use phase and data collection times
          estimatedTime: TIME_ESTIMATES.PHASES[value] + 
                        (dataCollectionType ? TIME_ESTIMATES.DATA_COLLECTION[dataCollectionType] : 0)
        }));
      } else if (isDataCollection(value)) {
        const phaseType = directSelections.phase;
        
        setDirectSelections(prev => ({ ...prev, dataCollection: value }));
        setState((prev: WizardState): WizardState => ({
          ...prev,
          dataCollection: value,
          // Only use phase and data collection times
          estimatedTime: (phaseType ? TIME_ESTIMATES.PHASES[phaseType] : 0) + 
                        TIME_ESTIMATES.DATA_COLLECTION[value]
        }));
      }
    } else {
      // Guided path logic
      if (currentStep === 1) {
        const aiReadinessOption = wizardSteps[1].options.find(opt => opt.value === value);
        if (aiReadinessOption?.leadTo && isPhase(aiReadinessOption.leadTo)) {
          const phase = aiReadinessOption.leadTo as Phase;
          setGuidedSelections(prev => ({ ...prev, aiReadiness: value }));
          setState(prev => ({
            ...prev,
            phase,
            estimatedTime: TIME_ESTIMATES.PHASES[phase]
          }));
          // Update completed sections immediately
          setCompletedSections(['selection_method', 'ai_readiness']);
        }
      } else if (currentStep === 2) {
        const dataPlansOption = wizardSteps[2].options.find(opt => opt.value === value);
        if (dataPlansOption?.leadTo && isDataCollection(dataPlansOption.leadTo)) {
          const dataCollection = dataPlansOption.leadTo as DataCollection;
          setGuidedSelections(prev => ({ ...prev, dataPlans: value }));
          setState(prev => ({
            ...prev,
            dataCollection,
            estimatedTime: calculateTotalTime({
              phase: prev.phase,
              dataCollection
            })
          }));
          // Update completed sections immediately
          if (state.phase) {
            setCompletedSections(['selection_method', 'ai_readiness', 'data_plans']);
          }
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    
    if (currentStep === 3) {
      if (path === 'direct') {
        setCurrentStep(1);
        setCompletedSections(['getting_started']);
      } else {
        setCurrentStep(2);
        setCompletedSections(['getting_started', 'ai_readiness']);
        // Reset state to only include phase time
        setState(prev => ({
          ...prev,
          dataCollection: undefined,
          estimatedTime: prev.phase ? wizardSteps[1].options.find(opt => opt.leadTo === prev.phase)?.timeImpact || 0 : 0
        }));
        const dataPlansOption = wizardSteps[2].options.find(opt => opt.leadTo === state.dataCollection);
        setSelectedOption(dataPlansOption?.value || '');
      }
      return;
    }
    
    if (currentStep === 1) {
      // Reset everything when going back to initial selection
      setPath(null);
      setCurrentStep(0);
      setSelectedOption('');
      setCompletedSections([]);
      setState({
        phase: undefined,
        dataCollection: undefined,
        estimatedTime: 0
      });
      setDirectSelections({
        phase: null,
        dataCollection: null
      });
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setCompletedSections(['getting_started']);
      // Reset state to only include phase time
      setState(prev => ({
        phase: prev.phase,
        dataCollection: undefined,
        estimatedTime: prev.phase ? wizardSteps[1].options.find(opt => opt.leadTo === prev.phase)?.timeImpact || 0 : 0
      }));
      const aiReadinessOption = wizardSteps[1].options.find(opt => opt.leadTo === state.phase);
      setSelectedOption(aiReadinessOption?.value || '');
    }
  };

  const handleNext = () => {
    if (!selectedOption && currentStep === 0) return;
    
    if (currentStep === 0) {
      // Mark Getting Started as complete with correct ID
      setCompletedSections(['selection_method']);
      
      // Reset state when starting new path
      setState({
        phase: undefined,
        dataCollection: undefined,
        estimatedTime: 0
      });
      
      if (selectedOption === 'direct') {
        setPath('direct');
        setCurrentStep(1);
        setSelectedOption('');
        setSections(directPathSections);
      } else {
        setPath('guided');
        setCurrentStep(1);
        setSelectedOption('');
        setSections(guidedPathSections);
      }
    } else if (path === 'direct') {
      if (currentStep === 1 && directSelections.phase && directSelections.dataCollection) {
        setState({
          phase: directSelections.phase,
          dataCollection: directSelections.dataCollection,
          estimatedTime: calculateTotalTime({
            phase: directSelections.phase,
            dataCollection: directSelections.dataCollection
          })
        });
        setCurrentStep(2);
        setCompletedSections(['selection_method', 'configure_study']);
      } else if (currentStep === 2) {
        // Ensure final time is correct before completing
        setState(prev => ({
          ...prev,
          estimatedTime: calculateTotalTime({
            phase: prev.phase,
            dataCollection: prev.dataCollection
          })
        }));
        onComplete(state);
      }
    } else {
      // Guided path logic
      if (currentStep === 1) {
        const aiReadinessOption = wizardSteps[1].options.find(opt => opt.value === selectedOption);
        if (aiReadinessOption?.leadTo && isPhase(aiReadinessOption.leadTo)) {
          const phase = aiReadinessOption.leadTo as Phase;
          setState({
            phase,
            dataCollection: undefined,
            estimatedTime: TIME_ESTIMATES.PHASES[phase]
          });
          setCurrentStep(2);
          setSelectedOption('');
          setCompletedSections(prev => [...prev, 'ai_readiness']);
        }
      } else if (currentStep === 2) {
        const dataPlansOption = wizardSteps[2].options.find(opt => opt.value === selectedOption);
        if (dataPlansOption?.leadTo && isDataCollection(dataPlansOption.leadTo)) {
          const dataCollection = dataPlansOption.leadTo as DataCollection;
          setState(prev => ({
            ...prev,
            dataCollection,
            estimatedTime: calculateTotalTime({
              phase: prev.phase,
              dataCollection
            })
          }));
          setCurrentStep(3);
          setCompletedSections(prev => [...prev, 'data_plans']);
        }
      } else if (currentStep === 3) {
        // Ensure final time is correct before completing
        setState(prev => ({
          ...prev,
          estimatedTime: calculateTotalTime({
            phase: prev.phase,
            dataCollection: prev.dataCollection
          })
        }));
        onComplete(state);
      }
    }
  };

  // Add this function to generate all possible sections based on current selections
  const getAllPossibleSections = () => {
    const sections = [
      {
        id: 'initial_information',
        title: 'Getting Started',
        description: 'Help us understand your study better',
        questions: [],
        isWizardStep: true
      },
      {
        id: 'study_phase',
        title: 'Study Phase',
        description: 'Select your AI study phase',
        questions: [],
        isWizardStep: true
      },
      {
        id: 'data_collection',
        title: 'Data Collection',
        description: 'Define your data collection approach',
        questions: [],
        isWizardStep: true
      },
      {
        id: 'team_management',
        title: 'Team Management',
        description: 'Build your research team',
        questions: []
      }
    ];

    // Add phase-specific sections
    if (path === 'guided' && selectedOption) {
      const phaseSpecificSections = {
        discovery: [
          {
            id: 'model_development',
            title: 'Model Development',
            description: 'Plan your AI model development',
            questions: []
          }
        ],
        pilot: [
          {
            id: 'model_details',
            title: 'Model Details',
            description: 'Technical specifications',
            questions: []
          },
          {
            id: 'testing_protocol',
            title: 'Testing Protocol',
            description: 'Define testing methodology',
            questions: []
          }
        ],
        validation: [
          {
            id: 'clinical_integration',
            title: 'Clinical Integration',
            description: 'Implementation planning',
            questions: []
          },
          {
            id: 'monitoring',
            title: 'Monitoring Plan',
            description: 'Ongoing monitoring strategy',
            questions: []
          }
        ]
      };

      // Add sections based on selected phase
      if (state.phase) {
        sections.push(...(phaseSpecificSections[state.phase] || []));
      }
    }

    // Add data collection specific sections
    if (state.dataCollection) {
      if (state.dataCollection === 'prospective') {
        sections.push({
          id: 'data_collection_protocol',
          title: 'Data Collection Protocol',
          description: 'Define collection procedures',
          questions: []
        });
      } else {
        sections.push({
          id: 'data_source',
          title: 'Data Sources',
          description: 'Document data sources',
          questions: []
        });
      }
    }

    // Always add safety and ethics
    sections.push({
      id: 'safety_ethics',
      title: 'Safety & Ethics',
      description: 'Address safety and ethical considerations',
      questions: []
    });

    return sections;
  };

  // Get active section based on current step
  const currentSectionId = sections[currentStep]?.id || 'selection_method';
  
  // Calculate completed sections
  const currentlyCompletedSections = sections
    .slice(0, currentStep)
    .map(section => section.id);

  // Replace the hardcoded getDisabledSections with a more dynamic approach
  const getDisabledSections = () => {
    const allSections = getAllPossibleSections();
    const currentPhase = state.phase;
    const currentDataCollection = state.dataCollection;
    
    return allSections
      .filter(section => {
        // Base conditions for disabled sections
        const isNotCurrentSection = section.id !== currentSectionId;
        const isNotCompleted = !currentlyCompletedSections.includes(section.id);
        
        // Phase-specific conditions
        const isPhaseSpecific = section.id.includes('model_') || 
                               section.id.includes('testing_') || 
                               section.id.includes('clinical_');
        const isWrongPhase = isPhaseSpecific && (
          (section.id.includes('model_development') && currentPhase !== PHASES.discovery) ||
          (section.id.includes('testing_') && currentPhase !== PHASES.pilot) ||
          (section.id.includes('clinical_') && currentPhase !== PHASES.validation)
        );
        
        // Data collection specific conditions
        const isDataSpecific = section.id.includes('data_collection_') || 
                              section.id.includes('data_source');
        const isWrongDataType = isDataSpecific && (
          (section.id.includes('data_collection_') && currentDataCollection !== DATA_COLLECTION_TYPES.prospective) ||
          (section.id.includes('data_source') && currentDataCollection !== DATA_COLLECTION_TYPES.retrospective)
        );
        
        // Common sections condition
        const isCommonSection = section.id === 'safety_ethics';
        const commonSectionDisabled = isCommonSection && (!currentPhase || !currentDataCollection);
        
        return (isNotCurrentSection && isNotCompleted) || 
               isWrongPhase || 
               isWrongDataType || 
               commonSectionDisabled;
      })
      .map(section => section.id);
  };

  const renderSelectionSummary = () => {
    // For direct path, show modules based on selections
    if (path === 'direct' && currentStep === 1) {
      // Show phase modules if phase is selected
      if (directSelections.phase) {
        return (
          <Stack spacing={3} sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>
                {phaseModules[directSelections.phase].title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {phaseModules[directSelections.phase].explanation}
              </Typography>
              {renderModuleList(phaseModules[directSelections.phase].modules)}
            </Paper>
          </Stack>
        );
      }
      // Show data collection modules if data collection is selected
      if (directSelections.dataCollection) {
        return (
          <Stack spacing={3} sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>
                {dataCollectionModules[directSelections.dataCollection].title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {dataCollectionModules[directSelections.dataCollection].explanation}
              </Typography>
              {renderModuleList(dataCollectionModules[directSelections.dataCollection].modules)}
            </Paper>
          </Stack>
        );
      }
    }

    // For guided path data plans step
    if (path === 'guided' && currentStep === 2) {
      const dataPlansOption = wizardSteps[2].options.find(opt => opt.value === selectedOption);
      if (dataPlansOption?.leadTo && isDataCollection(dataPlansOption.leadTo)) {
        const dataType = dataPlansOption.leadTo;
        return (
          <Stack spacing={3} sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>
                {dataCollectionModules[dataType].title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {dataCollectionModules[dataType].explanation}
              </Typography>
              {renderModuleList(dataCollectionModules[dataType].modules)}
            </Paper>
          </Stack>
        );
      }
    }

    // For guided path AI readiness step
    if (path === 'guided' && currentStep === 1) {
      const aiReadinessOption = wizardSteps[1].options.find(opt => opt.value === selectedOption);
      if (aiReadinessOption?.leadTo && isPhase(aiReadinessOption.leadTo)) {
        const phase = aiReadinessOption.leadTo;
        return (
          <Stack spacing={3} sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>
                {phaseModules[phase].title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {phaseModules[phase].explanation}
              </Typography>
              {renderModuleList(phaseModules[phase].modules)}
            </Paper>
          </Stack>
        );
      }
    }

    return null;
  };

  const renderDirectSelection = () => (
    <Stack spacing={4}>
      {/* Phase Selection */}
      <Box>
        <Typography variant="h6" gutterBottom>Study Phase</Typography>
        <Stack spacing={2}>
          {Object.values(PHASES).map(phase => {
            if (!isPhase(phase)) return null;
            const moduleConfig = phaseModules[phase];
            const PhaseIcon = {
              discovery: ScienceIcon,
              pilot: TimelineIcon,
              validation: PsychologyIcon
            }[phase] as React.ComponentType<SvgIconProps>;

            return (
              <Paper
                key={phase}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  bgcolor: directSelections.phase === phase ? 'primary.lighter' : 'background.paper',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: directSelections.phase === phase ? 'primary.main' : 'transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.lighter',
                  }
                }}
                onClick={() => {
                  setDirectSelections(prev => ({ ...prev, phase }));
                  setState((prev: WizardState): WizardState => ({
                    ...prev,
                    phase: phase,
                    estimatedTime: calculateTotalTime({
                      phase: phase,
                      dataCollection: directSelections.dataCollection || undefined
                    })
                  }));
                  // Update completed sections based on current selections
                  if (directSelections.dataCollection) {
                    setCompletedSections(['selection_method', 'configure_study']);
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {PhaseIcon && <PhaseIcon sx={{ color: directSelections.phase === phase ? 'primary.main' : 'action.active' }} />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      {phase} Phase
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {moduleConfig.explanation}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={`+${moduleConfig.timeEstimate} min`}
                    color={directSelections.phase === phase ? "primary" : "default"}
                    variant={directSelections.phase === phase ? "filled" : "outlined"}
                  />
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>

      {/* Data Collection Selection */}
      <Box>
        <Typography variant="h6" gutterBottom>Data Collection</Typography>
        <Stack spacing={2}>
          {Object.values(DATA_COLLECTION_TYPES).map(type => {
            if (!isDataCollection(type)) return null;
            const moduleConfig = dataCollectionModules[type];
            const DataIcon = (type === 'retrospective' ? StorageIcon : NewDataIcon) as React.ComponentType<SvgIconProps>;

            return (
              <Paper
                key={type}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  bgcolor: directSelections.dataCollection === type ? 'primary.lighter' : 'background.paper',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: directSelections.dataCollection === type ? 'primary.main' : 'transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.lighter',
                  }
                }}
                onClick={() => {
                  setDirectSelections(prev => ({ ...prev, dataCollection: type }));
                  setState((prev: WizardState): WizardState => ({
                    ...prev,
                    dataCollection: type,
                    estimatedTime: calculateTotalTime({
                      phase: directSelections.phase || undefined,
                      dataCollection: type
                    })
                  }));
                  // Update completed sections based on current selections
                  if (directSelections.phase) {
                    setCompletedSections(['selection_method', 'configure_study']);
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DataIcon sx={{ color: directSelections.dataCollection === type ? 'primary.main' : 'action.active' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      {type} Data
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {moduleConfig.explanation}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={`+${moduleConfig.timeEstimate} min`}
                    color={directSelections.dataCollection === type ? "primary" : "default"}
                    variant={directSelections.dataCollection === type ? "filled" : "outlined"}
                  />
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );

  const handleWizardComplete = () => {
    if (!state.phase || !state.dataCollection) return;
    
    const selectedModules = getModulesForSelection(state.phase, state.dataCollection);
    const estimatedTime = calculateTotalTime({
      phase: state.phase,
      dataCollection: state.dataCollection,
      selectedModules
    });
    
    onComplete({
      phase: state.phase,
      dataCollection: state.dataCollection,
      estimatedTime,
      selectedModules
    });
  };

  const renderOptionIcon = (option: WizardStepOption, isSelected: boolean) => {
    if (!option.Icon) return null;
    const IconComponent = option.Icon;
    return <IconComponent sx={{ color: isSelected ? 'primary.main' : 'action.active' }} />;
  };

  // Add explicit typing for currentStep
  const getCurrentStep = (): WizardStep | undefined => {
    return wizardSteps[currentStep];
  };

  // Update handleReset to clear all selections
  const handleReset = () => {
    setState({ estimatedTime: 0 });
    setPath(null);
    setCurrentStep(0);
    setCompletedSections([]);
    setSelectedOption('');
    setInitialSelection(null);
    setDirectSelections({
      phase: null,
      dataCollection: null
    });
    setGuidedSelections({
      aiReadiness: '',
      dataPlans: ''
    });
    setSections([{
      id: 'selection_method',
      title: 'Getting Started',
      description: 'Choose how to proceed',
      questions: [],
      isWizardStep: true,
      dynamicFields: false
    }]);
  };

  // Update section click handler to restore selections and handle navigation
  const handleSectionClick = (sectionId: string) => {
    const stepIndex = sections.findIndex(s => s.id === sectionId);
    
    const isNextUnfinished = stepIndex === completedSections.length;
    const canNavigate = completedSections.includes(sectionId) || 
                       sectionId === sections[currentStep]?.id ||
                       isNextUnfinished;

    if (canNavigate) {
      // Update completed sections if we have valid selections
      if (path === 'direct' && sectionId === 'configure_study') {
        if (directSelections.phase && directSelections.dataCollection) {
          setCompletedSections(['selection_method', 'configure_study']);
        }
      } else if (path === 'guided') {
        if (sectionId === 'ai_readiness' && guidedSelections.aiReadiness) {
          setCompletedSections(['selection_method', 'ai_readiness']);
        } else if (sectionId === 'data_plans' && guidedSelections.dataPlans) {
          setCompletedSections(['selection_method', 'ai_readiness', 'data_plans']);
        }
      }

      setCurrentStep(stepIndex);
      
      // Rest of the selection restoration logic...
      if (sectionId === 'selection_method') {
        setSelectedOption(initialSelection || '');
      } else if (path === 'direct' && sectionId === 'configure_study') {
        if (directSelections.phase || directSelections.dataCollection) {
          setState(prev => ({
            ...prev,
            phase: directSelections.phase || undefined,
            dataCollection: directSelections.dataCollection || undefined,
            estimatedTime: calculateTotalTime({
              phase: directSelections.phase || undefined,
              dataCollection: directSelections.dataCollection || undefined
            })
          }));
        }
      } else if (path === 'guided') {
        if (sectionId === 'ai_readiness') {
          setSelectedOption(guidedSelections.aiReadiness);
          if (guidedSelections.aiReadiness) {
            const aiReadinessOption = wizardSteps[1].options.find(
              opt => opt.value === guidedSelections.aiReadiness
            );
            if (aiReadinessOption?.leadTo && isPhase(aiReadinessOption.leadTo)) {
              setState(prev => ({
                ...prev,
                phase: aiReadinessOption.leadTo as Phase,
                estimatedTime: TIME_ESTIMATES.PHASES[aiReadinessOption.leadTo as Phase]
              }));
            }
          }
        } else if (sectionId === 'data_plans') {
          setSelectedOption(guidedSelections.dataPlans);
          if (guidedSelections.dataPlans) {
            const dataPlansOption = wizardSteps[2].options.find(
              opt => opt.value === guidedSelections.dataPlans
            );
            if (dataPlansOption?.leadTo && isDataCollection(dataPlansOption.leadTo)) {
              setState(prev => ({
                ...prev,
                dataCollection: dataPlansOption.leadTo as DataCollection,
                estimatedTime: prev.estimatedTime + 
                  TIME_ESTIMATES.DATA_COLLECTION[dataPlansOption.leadTo as DataCollection]
              }));
            }
          }
        } else if (sectionId === 'review') {
          // Always recalculate time when navigating to review
          setState(prev => ({
            ...prev,
            estimatedTime: calculateTotalTime({
              phase: prev.phase,
              dataCollection: prev.dataCollection
            })
          }));
        }
      }
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100vw',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h3" gutterBottom color="primary.dark" sx={{ fontWeight: 700 }}>
              AI Study Wizard
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Typography variant="h6" color="text.secondary">
              Let's figure out exactly what you need for your IRB application
            </Typography>
          </motion.div>
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
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <SectionHeader
            sections={sections}
            completedSections={completedSections}
            activeSection={currentSectionId}
            onSectionClick={handleSectionClick}
            disabledSections={getDisabledSections()}
          />
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ py: 8, flex: 1 }}>
        <Stack spacing={6} sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
          {path === 'direct' && currentStep === 1 ? (
            // Direct Selection View
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Configure your study
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Select your study phase and data collection approach
                </Typography>
              </Box>
              {renderDirectSelection()}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<BackIcon />}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!directSelections.phase || !directSelections.dataCollection}
                  endIcon={<NavigateNextIcon />}
                >
                  Review Selections
                </Button>
              </Box>
            </Stack>
          ) : (path === 'direct' && currentStep === 2) || (path === 'guided' && currentStep === 3) ? (
            // Show PhaseConfirmation for both paths at their respective review steps
            <PhaseConfirmation
              phase={state.phase as Phase}
              dataCollection={state.dataCollection as DataCollection}
              estimatedTime={state.estimatedTime}
              onConfirm={handleWizardComplete}
              onReset={handleReset}
              onBack={() => {
                if (path === 'direct') {
                  setCurrentStep(1);
                } else {
                  setCurrentStep(2);
                }
              }}
              renderModuleList={renderModuleList}
            />
          ) : (
            // Guided Questions View
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {getCurrentStep()?.question}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {getCurrentStep()?.explanation}
                </Typography>
              </Box>

              {currentStep === 0 ? (
                // Getting Started - Full Width Layout
                <Stack spacing={2}>
                  {wizardSteps[currentStep].options.map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          cursor: 'pointer',
                          bgcolor: selectedOption === option.value ? 'primary.lighter' : 'background.paper',
                          borderWidth: 2,
                          borderStyle: 'solid',
                          borderColor: selectedOption === option.value ? 'primary.main' : 'transparent',
                          boxShadow: selectedOption === option.value ? 4 : 1,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            bgcolor: selectedOption === option.value ? 'primary.lighter' : 'grey.50',
                            borderColor: selectedOption === option.value ? 'primary.main' : 'primary.light',
                            transform: 'translateY(-2px)',
                            boxShadow: 3
                          }
                        }}
                        onClick={() => handleOptionSelect(option.value)}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {renderOptionIcon(option, selectedOption === option.value)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="h6"
                              color={selectedOption === option.value ? 'primary.main' : 'text.primary'}
                            >
                              {option.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                          <Chip
                            size="small"
                            label={`+${option.timeImpact || 0} min`}
                            color={selectedOption === option.value ? "primary" : "default"}
                            variant={selectedOption === option.value ? "filled" : "outlined"}
                          />
                        </Stack>
                      </Paper>
                    </motion.div>
                  ))}
                </Stack>
              ) : (
                // AI Readiness and Data Plans - Split Layout
                <Box sx={{ display: 'flex', gap: 4 }}>
                  {/* Options Column */}
                  <Box sx={{ 
                    flex: selectedOption ? '1' : '2',
                    transition: 'all 0.3s ease-in-out'
                  }}>
                    <Stack spacing={2}>
                      {wizardSteps[currentStep].options.map((option, index) => (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Paper
                            sx={{
                              p: 3,
                              cursor: 'pointer',
                              bgcolor: selectedOption === option.value ? 'primary.lighter' : 'background.paper',
                              borderWidth: 2,
                              borderStyle: 'solid',
                              borderColor: selectedOption === option.value ? 'primary.main' : 'transparent',
                              boxShadow: selectedOption === option.value ? 4 : 1,
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                bgcolor: selectedOption === option.value ? 'primary.lighter' : 'grey.50',
                                borderColor: selectedOption === option.value ? 'primary.main' : 'primary.light',
                                transform: 'translateY(-2px)',
                                boxShadow: 3
                              }
                            }}
                            onClick={() => handleOptionSelect(option.value)}
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {renderOptionIcon(option, selectedOption === option.value)}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography 
                                  variant="h6"
                                  color={selectedOption === option.value ? 'primary.main' : 'text.primary'}
                                >
                                  {option.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {option.description}
                                </Typography>
                              </Box>
                              <Chip
                                size="small"
                                label={`+${option.timeImpact || 0} min`}
                                color={selectedOption === option.value ? "primary" : "default"}
                                variant={selectedOption === option.value ? "filled" : "outlined"}
                              />
                            </Stack>
                          </Paper>
                        </motion.div>
                      ))}
                    </Stack>
                  </Box>

                  {/* Modules Summary Column */}
                  <AnimatePresence>
                    {selectedOption && (
                      <motion.div
                        initial={{ opacity: 0, x: 20, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: '50%' }}
                        exit={{ opacity: 0, x: 20, width: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ flex: 1 }}
                      >
                        {renderSelectionSummary()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  startIcon={<BackIcon />}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedOption}
                  endIcon={<NavigateNextIcon />}
                >
                  Next
                </Button>
              </Box>
            </Stack>
          )}
        </Stack>
      </Container>

      {/* Add ScrollIndicator */}
      <ScrollIndicator />
    </Box>
  );
};

export default AIWizard; 