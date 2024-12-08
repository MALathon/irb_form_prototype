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
} from '@mui/material';
import {
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  Timer as TimerIcon,
  HelpOutline as HelpOutlineIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  NavigateNext as NavigateNextIcon,
  AddCircle as AddCircleIcon,
  ArrowBack as BackIcon,
  CheckCircle as BaseModuleIcon,
  AddCircle as NewModuleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './';

interface WizardStep {
  id: string;
  question: string;
  explanation: string;
  options: {
    label: string;
    description: string;
    timeImpact?: number;
    value: string;
    icon?: React.ReactNode;
    leadTo?: string;
  }[];
}

interface WizardState {
  phase?: 'discovery' | 'pilot' | 'validation';
  dataCollection?: 'prospective' | 'retrospective';
  estimatedTime: number;
  selectedModules?: {
    core: string[];
    additional: string[];
  };
}

interface AIWizardProps {
  onComplete: (state: WizardState) => void;
  initialState?: WizardState;
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: any[];
}

const wizardSteps: WizardStep[] = [
  {
    id: 'selection_method',
    question: "How would you like to get started?",
    explanation: "Don't worry - you can always change your selections later. We're here to help you build the right IRB application for your AI research.",
    options: [
      {
        label: "Guide me through it",
        description: "Answer a few simple questions and we'll help determine the best approach for your research. Perfect if you're not sure which phase fits best.",
        timeImpact: 5,
        value: 'guided',
        icon: <HelpOutlineIcon />
      },
      {
        label: "I know what I need",
        description: "Already familiar with AI research phases? You can directly select your phase and data collection approach. You can always modify these later.",
        timeImpact: 2,
        value: 'direct',
        icon: <CheckCircleIcon />
      }
    ]
  },
  {
    id: 'ai_readiness',
    question: "Where are you in your AI development journey?",
    explanation: "Let's figure out which phase best matches your current stage. Remember, every great AI project starts somewhere!",
    options: [
      {
        label: "Just getting started",
        description: "You're at the beginning of your AI journey - planning to collect data and develop your initial model. This is an exciting first step!",
        value: 'not_started',
        leadTo: 'discovery',
        timeImpact: 30,
        icon: <ScienceIcon />
      },
      {
        label: "Have a model that needs testing",
        description: "You've developed your AI model and now need to validate its performance. We'll help you plan the right testing approach.",
        value: 'developed',
        leadTo: 'pilot',
        timeImpact: 45,
        icon: <TimelineIcon />
      },
      {
        label: "Ready for clinical implementation",
        description: "Your model is tested and you're ready to implement it in clinical practice. We'll help ensure a smooth transition.",
        value: 'tested',
        leadTo: 'validation',
        timeImpact: 60,
        icon: <PsychologyIcon />
      }
    ]
  },
  {
    id: 'data_plans',
    question: "Tell us about your data plans",
    explanation: "Different data approaches have different requirements - we'll help you navigate them. You can always refine these details in the form.",
    options: [
      {
        label: "I have existing data",
        description: "You'll be working with previously collected data. We'll help you document its sources and quality appropriately.",
        value: 'existing',
        leadTo: 'retrospective',
        timeImpact: 15
      },
      {
        label: "I need to collect new data",
        description: "You'll be gathering new data as part of your study. We'll help you plan your collection process.",
        value: 'new',
        leadTo: 'prospective',
        timeImpact: 30
      }
    ]
  }
];

const renderModuleList = (modules: { core: string[], additional: string[] }) => (
  <Box>
    {modules.core.length > 0 && (
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <BaseModuleIcon fontSize="small" color="success" />
          Core Modules:
        </Typography>
        <List dense>
          {modules.core.map((module, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={module} />
            </ListItem>
          ))}
        </List>
      </Box>
    )}
    
    {modules.additional.length > 0 && (
      <Box>
        <Typography 
          variant="subtitle2" 
          color="primary.main" 
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <NewModuleIcon fontSize="small" color="primary" />
          Additional Modules:
        </Typography>
        <List dense>
          {modules.additional.map((module, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <AddCircleIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={module}
                primaryTypographyProps={{
                  color: 'primary.main',
                  fontWeight: 500
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    )}
  </Box>
);

// Add these type definitions at the top
type Phase = 'discovery' | 'pilot' | 'validation';
type DataCollection = 'prospective' | 'retrospective';

interface PhaseConfirmationProps {
  phase: Phase;  // Update the type here
  dataCollection: DataCollection;  // Update the type here
  estimatedTime: number;
  onConfirm: () => void;
  onReset: () => void;
  onBack: () => void;
  renderModuleList: (modules: { core: string[], additional: string[] }) => React.ReactNode;
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
        <Paper sx={{ p: 3, height: 'fit-content' }}>
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
        <Paper sx={{ p: 3, height: 'fit-content' }}>
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
        <Paper sx={{ p: 3, height: 'fit-content' }}>
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

interface ModuleConfig {
  title: string;
  modules: {
    core: string[];
    additional: string[];
  };
  explanation: string;
}

interface DataCollectionModules {
  retrospective: ModuleConfig;
  prospective: ModuleConfig;
}

interface PhaseModules {
  discovery: ModuleConfig;
  pilot: ModuleConfig;
  validation: ModuleConfig;
}

// Define core modules specific to phase
const PHASE_CORE_MODULES = [
  "Protocol Documentation",
  "Ethics Review",
  "Safety Assessment",
  "Model Documentation"
];

// Define core modules specific to data collection
const DATA_CORE_MODULES = [
  "Data Security Plan",
  "Data Quality Assessment",
  "Data Source Documentation"
];

// Update phase modules with phase-specific core modules
const phaseModules: PhaseModules = {
  discovery: {
    title: "Discovery Phase Selected",
    modules: {
      core: PHASE_CORE_MODULES,
      additional: []  // No additional modules for discovery (baseline)
    },
    explanation: "Focus on initial model development and basic validation."
  },
  pilot: {
    title: "Pilot Phase Selected",
    modules: {
      core: PHASE_CORE_MODULES,
      additional: [
        "Performance Validation",
        "Error Analysis",
        "Clinical Integration Planning"
      ]
    },
    explanation: "Emphasis on thorough testing and validation in a controlled environment."
  },
  validation: {
    title: "Validation Phase Selected",
    modules: {
      core: PHASE_CORE_MODULES,
      additional: [
        "Performance Validation",
        "Error Analysis",
        "Clinical Integration Planning",
        "Production Deployment",
        "Monitoring Systems",
        "Clinical Workflow Integration"
      ]
    },
    explanation: "Focus on real-world implementation and monitoring."
  }
};

// Update data collection modules with data-specific core modules
const dataCollectionModules: DataCollectionModules = {
  retrospective: {
    title: "Retrospective Data Collection Selected",
    modules: {
      core: DATA_CORE_MODULES,
      additional: []  // No additional modules for retrospective (baseline)
    },
    explanation: "Retrospective analysis focuses on existing data quality and bias assessment."
  },
  prospective: {
    title: "Prospective Data Collection Selected",
    modules: {
      core: DATA_CORE_MODULES,
      additional: [
        "Patient Recruitment Strategy",
        "Timeline Planning",
        "Quality Control Measures",
        "Participant Follow-up Plan"
      ]
    },
    explanation: "Prospective data collection requires additional planning for future data gathering."
  }
};

// Update direct path sections
const directPathSections: Section[] = [
  {
    id: 'getting_started',
    title: 'Getting Started',
    description: 'Choose how to proceed',
    questions: []
  },
  {
    id: 'configure_study',
    title: 'Configure Study',
    description: 'Select phase and data collection',
    questions: []
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review and confirm selections',
    questions: []
  }
];

// Update guided path sections to match the correct flow
const guidedPathSections: Section[] = [
  {
    id: 'getting_started',
    title: 'Getting Started',
    description: 'Choose how to proceed',
    questions: []
  },
  {
    id: 'ai_readiness',
    title: 'AI Readiness',
    description: 'Assess your AI maturity',
    questions: []
  },
  {
    id: 'data_plans',
    title: 'Data Plans',
    description: 'Define your data approach',
    questions: []
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review selections',
    questions: []
  }
];

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
      title: 'Getting Started',
      description: 'Choose how to proceed',
      questions: []
    }
  ]);

  // Add completedSections state
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  // Add useEffect to handle path changes
  useEffect(() => {
    if (path === 'direct') {
      setSections(directPathSections);
    } else if (path === 'guided') {
      setSections(guidedPathSections);
    } else {
      setSections([{
        id: 'getting_started',
        title: 'Getting Started',
        description: 'Choose how to proceed',
        questions: []
      }]);
    }
  }, [path]);

  // Add useEffect to handle state initialization
  useEffect(() => {
    if (initialState) {
      setState(initialState);
    }
  }, [initialState]);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    
    if (currentStep === 0) {
      // Update sections immediately based on selected path
      if (value === 'direct') {
        setSections([
          {
            id: 'getting_started',
            title: 'Getting Started',
            description: 'Choose how to proceed',
            questions: []
          },
          {
            id: 'configure_study',
            title: 'Configure Study',
            description: 'Select phase and data collection',
            questions: []
          },
          {
            id: 'review',
            title: 'Review',
            description: 'Review selections',
            questions: []
          }
        ]);
      } else {
        setSections([
          {
            id: 'getting_started',
            title: 'Getting Started',
            description: 'Choose how to proceed',
            questions: []
          },
          {
            id: 'ai_readiness',
            title: 'AI Readiness',
            description: 'Assess your AI maturity',
            questions: []
          },
          {
            id: 'data_plans',
            title: 'Data Plans',
            description: 'Define your data approach',
            questions: []
          },
          {
            id: 'review',
            title: 'Review',
            description: 'Review selections',
            questions: []
          }
        ]);
      }
      return;
    }
    
    if (path === 'direct') {
      if (currentStep === 1) {
        const phaseTimeMap = {
          discovery: 30,
          pilot: 45,
          validation: 60
        };
        const dataTimeMap = {
          prospective: 30,
          retrospective: 15
        };
        
        if (value === directSelections.phase || value === directSelections.dataCollection) {
          // Calculate total time from scratch based on current selections
          const phaseTime = value === directSelections.phase ? 
            phaseTimeMap[value as Phase] : 
            (state.phase ? phaseTimeMap[state.phase] : 0);
          
          const dataTime = value === directSelections.dataCollection ? 
            dataTimeMap[value as DataCollection] : 
            (state.dataCollection ? dataTimeMap[state.dataCollection] : 0);

          setState(prev => ({
            ...prev,
            phase: value === directSelections.phase ? value as Phase : prev.phase,
            dataCollection: value === directSelections.dataCollection ? value as DataCollection : prev.dataCollection,
            estimatedTime: phaseTime + dataTime
          }));
        }
      }
    } else {
      // Guided path logic
      if (currentStep === 1) {
        const selectedOption = wizardSteps[1].options.find(opt => opt.value === value);
        if (selectedOption?.leadTo) {
          // Reset time when changing phase
          setState({
            phase: selectedOption.leadTo as Phase,
            dataCollection: undefined,
            estimatedTime: selectedOption.timeImpact || 0
          });
        }
      } else if (currentStep === 2) {
        const selectedOption = wizardSteps[2].options.find(opt => opt.value === value);
        if (selectedOption?.leadTo) {
          // Add data collection time to existing phase time
          setState(prev => ({
            ...prev,
            dataCollection: selectedOption.leadTo as DataCollection,
            estimatedTime: (prev.phase ? wizardSteps[1].options.find(opt => opt.leadTo === prev.phase)?.timeImpact || 0 : 0) + 
                          (selectedOption.timeImpact || 0)
          }));
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
        setCompletedSections(['getting_started']);
      } else {
        setPath('guided');
        setCurrentStep(1);
        setSelectedOption('');
        setSections(guidedPathSections);
        setCompletedSections(['getting_started']);
      }
    } else if (path === 'direct') {
      if (currentStep === 1 && directSelections.phase && directSelections.dataCollection) {
        setState({
          phase: directSelections.phase,
          dataCollection: directSelections.dataCollection,
          estimatedTime: calculateEstimatedTime(directSelections.phase, directSelections.dataCollection)
        });
        setCurrentStep(2);
        setCompletedSections(['getting_started', 'configure_study']);
      } else if (currentStep === 2) {
        onComplete(state);
      }
    } else {
      // Guided path logic
      if (currentStep === 1) {
        const aiReadinessOption = wizardSteps[1].options.find(opt => opt.value === selectedOption);
        if (aiReadinessOption?.leadTo) {
          // Set only phase time
          setState({
            phase: aiReadinessOption.leadTo as Phase,
            dataCollection: undefined,
            estimatedTime: aiReadinessOption.timeImpact || 0
          });
          setCurrentStep(2);
          setSelectedOption('');
          setCompletedSections(prev => [...prev, 'ai_readiness']);
        }
      } else if (currentStep === 2) {
        const dataPlansOption = wizardSteps[2].options.find(opt => opt.value === selectedOption);
        if (dataPlansOption?.leadTo) {
          // Add data collection time to phase time
          setState(prev => ({
            ...prev,
            dataCollection: dataPlansOption.leadTo as DataCollection,
            estimatedTime: (prev.phase ? wizardSteps[1].options.find(opt => opt.leadTo === prev.phase)?.timeImpact || 0 : 0) + 
                          (dataPlansOption.timeImpact || 0)
          }));
          setCurrentStep(3);
          setCompletedSections(prev => [...prev, 'data_plans']);
        }
      } else if (currentStep === 3) {
        onComplete(state);
      }
    }
  };

  // Update calculateEstimatedTime to handle type checking
  const calculateEstimatedTime = (phase: Phase, dataCollection: DataCollection) => {
    const phaseTimeMap: Record<Phase, number> = {
      discovery: 30,
      pilot: 45,
      validation: 60
    };
    const dataTimeMap: Record<DataCollection, number> = {
      prospective: 30,
      retrospective: 15
    };
    
    return phaseTimeMap[phase] + dataTimeMap[dataCollection];
  };

  // Add this function to generate all possible sections based on current selections
  const getAllPossibleSections = () => {
    const sections = [
      {
        id: 'initial_information',
        title: 'Getting Started',
        description: 'Help us understand your study better',
        questions: []
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
          (section.id.includes('model_development') && currentPhase !== 'discovery') ||
          (section.id.includes('testing_') && currentPhase !== 'pilot') ||
          (section.id.includes('clinical_') && currentPhase !== 'validation')
        );
        
        // Data collection specific conditions
        const isDataSpecific = section.id.includes('data_collection_') || 
                              section.id.includes('data_source');
        const isWrongDataType = isDataSpecific && (
          (section.id.includes('data_collection_') && currentDataCollection !== 'prospective') ||
          (section.id.includes('data_source') && currentDataCollection !== 'retrospective')
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
    // For data collection steps, only show data collection modules
    if (currentStep === 2 || currentStep === 4) {
      return state.dataCollection && (
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              {dataCollectionModules[state.dataCollection].title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {dataCollectionModules[state.dataCollection].explanation}
            </Typography>
            {renderModuleList(dataCollectionModules[state.dataCollection].modules)}
          </Paper>
        </Stack>
      );
    }

    // For phase selection, show phase modules
    if (state.phase) {
      return (
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              {phaseModules[state.phase].title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {phaseModules[state.phase].explanation}
            </Typography>
            {renderModuleList(phaseModules[state.phase].modules)}
          </Paper>
        </Stack>
      );
    }

    return null;
  };

  const renderDirectSelection = () => (
    <Stack spacing={4}>
      {/* Phase Selection */}
      <Box>
        <Typography variant="h6" gutterBottom>Study Phase</Typography>
        <Stack spacing={2}>
          {[
            { value: 'discovery' as Phase, timeImpact: 30 },
            { value: 'pilot' as Phase, timeImpact: 45 },
            { value: 'validation' as Phase, timeImpact: 60 }
          ].map(({ value: phase, timeImpact }) => (
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
                setState(prev => ({
                  ...prev,
                  phase,
                  estimatedTime: timeImpact + (prev.dataCollection === 'prospective' ? 30 : 
                                             prev.dataCollection === 'retrospective' ? 15 : 0)
                }));
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  {phase} Phase
                </Typography>
                <Chip
                  size="small"
                  label={`+${timeImpact} min`}
                  color={directSelections.phase === phase ? "primary" : "default"}
                  variant={directSelections.phase === phase ? "filled" : "outlined"}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Data Collection Selection */}
      <Box>
        <Typography variant="h6" gutterBottom>Data Collection</Typography>
        <Stack spacing={2}>
          {[
            { value: 'prospective' as DataCollection, timeImpact: 30 },
            { value: 'retrospective' as DataCollection, timeImpact: 15 }
          ].map(({ value: type, timeImpact }) => (
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
                setState(prev => ({
                  ...prev,
                  dataCollection: type,
                  estimatedTime: timeImpact + (prev.phase === 'discovery' ? 30 : 
                                             prev.phase === 'pilot' ? 45 : 
                                             prev.phase === 'validation' ? 60 : 0)
                }));
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  {type} Data
                </Typography>
                <Chip
                  size="small"
                  label={`+${timeImpact} min`}
                  color={directSelections.dataCollection === type ? "primary" : "default"}
                  variant={directSelections.dataCollection === type ? "filled" : "outlined"}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Stack>
  );

  const handleWizardComplete = () => {
    // Get the modules based on selections
    const selectedPhaseModules = state.phase ? phaseModules[state.phase].modules : { core: [], additional: [] };
    const selectedDataModules = state.dataCollection ? dataCollectionModules[state.dataCollection].modules : { core: [], additional: [] };

    // Combine all selected modules
    const selectedModules = {
      core: [...selectedPhaseModules.core, ...selectedDataModules.core],
      additional: [...selectedPhaseModules.additional, ...selectedDataModules.additional]
    };

    onComplete({
      phase: state.phase,
      dataCollection: state.dataCollection,
      estimatedTime: state.estimatedTime,
      selectedModules
    });
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
            skippedSections={[]}
            activeSection={currentSectionId}
            onSectionClick={(sectionId) => {
              const stepIndex = sections.findIndex(s => s.id === sectionId);
              if (stepIndex <= currentStep) {
                setCurrentStep(stepIndex);
              }
            }}
            wizardSteps={[]}
            showAllSections={true}
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
              onReset={() => {
                setState({ estimatedTime: 0 });
                setPath(null);
                setCurrentStep(0);
              }}
              onBack={() => {
                if (path === 'direct') {
                  setCurrentStep(1); // Back to configure_study
                } else {
                  setCurrentStep(2); // Back to data_plans
                }
              }}
              renderModuleList={renderModuleList}
            />
          ) : (
            // Guided Questions View
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {wizardSteps[currentStep].question}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {wizardSteps[currentStep].explanation}
                </Typography>
              </Box>

              {currentStep === 0 ? (
                // Getting Started - Full Width Layout
                <Stack spacing={2}>
                  {wizardSteps[currentStep].options.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                          {option.icon && (
                            <Box sx={{ 
                              color: selectedOption === option.value ? 'primary.main' : 'text.secondary',
                              transition: 'color 0.2s ease-in-out'
                            }}>
                              {option.icon}
                            </Box>
                          )}
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
                      {wizardSteps[currentStep].options.map((option) => (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
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
                              {option.icon && (
                                <Box sx={{ 
                                  color: selectedOption === option.value ? 'primary.main' : 'text.secondary',
                                  transition: 'color 0.2s ease-in-out'
                                }}>
                                  {option.icon}
                                </Box>
                              )}
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
    </Box>
  );
};

export default AIWizard; 