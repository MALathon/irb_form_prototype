import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { 
  Box, 
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
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

// Add a function to check if all items fit
const shouldShowArrows = (totalItems: number) => {
  const viewportWidth = window.innerWidth;
  const slidesToShow = viewportWidth > 1024 ? 5 : viewportWidth > 600 ? 3 : 1;
  return totalItems > slidesToShow;
};

// Custom arrow components
const NextArrow = (props: any) => {
  const { onClick, currentSlide, slideCount, slidesToShow } = props;
  const isLastSlide = currentSlide + slidesToShow >= slideCount;
  const showArrows = shouldShowArrows(slideCount);

  if (!showArrows) return null;

  return (
    <IconButton 
      onClick={onClick} 
      sx={{ 
        position: 'absolute',
        right: -40,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        opacity: isLastSlide ? 0.3 : 1,
        cursor: isLastSlide ? 'not-allowed' : 'pointer',
        '&.slick-hidden': {
          display: 'none'
        }
      }}
      disabled={isLastSlide}
    >
      <NavigateNextIcon />
    </IconButton>
  );
};

const PrevArrow = (props: any) => {
  const { onClick, currentSlide } = props;
  const isFirstSlide = currentSlide === 0;
  const showArrows = shouldShowArrows(props.slideCount);

  if (!showArrows) return null;

  return (
    <IconButton 
      onClick={onClick} 
      sx={{ 
        position: 'absolute',
        left: -40,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        opacity: isFirstSlide ? 0.3 : 1,
        cursor: isFirstSlide ? 'not-allowed' : 'pointer',
        '&.slick-hidden': {
          display: 'none'
        }
      }}
      disabled={isFirstSlide}
    >
      <NavigateBeforeIcon />
    </IconButton>
  );
};

// Create custom connector styling
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.root}`]: {
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)',
  },
  [`&.${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
    borderTopWidth: 2,
    borderRadius: 1,
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
}));

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
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: false,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    focusOnSelect: false,
    variableWidth: false,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    touchThreshold: 10,
    accessibility: true,
    adaptiveHeight: false,
    useCSS: true,
    useTransform: true,
    edgeFriction: 0.35,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ],
    beforeChange: (current: number, next: number) => {
      const totalSlides = sections.length;
      const slidesToShow = window.innerWidth > 1024 ? 5 : window.innerWidth > 600 ? 3 : 1;
      
      if (totalSlides <= slidesToShow) {
        return false;
      }
    },
    afterChange: () => {
      // Reset track position
      const track = document.querySelector('.slick-track') as HTMLElement;
      if (track) {
        requestAnimationFrame(() => {
          track.style.transform = track.style.transform.replace(
            /translate3d\((.*?)\)/,
            (_, offset) => {
              const currentOffset = parseInt(offset);
              if (currentOffset > 0) {
                return 'translate3d(0px, 0px, 0px)';
              }
              return `translate3d(${offset}, 0px, 0px)`;
            }
          );
        });
      }
    },
    centerPadding: '40px',  // Add padding for connectors
    className: 'section-slider',
  };

  return (
    <Box sx={{ mx: 5 }}>
      <Slider {...sliderSettings}>
        {sections.map((section, index) => {
          const isCompleted = completedSections.includes(section.id);
          const isActive = section.id === activeSection;
          const isDisabled = disabledSections.includes(section.id);
          const isFirst = index === 0;

          return (
            <Box key={section.id} sx={{ px: 2 }}>
              <Box sx={{ 
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 20,
                  left: '-50%',
                  right: '50%',
                  height: 2,
                  bgcolor: isCompleted ? 'success.main' : 
                          isActive ? 'primary.main' : 
                          'grey.300',
                  zIndex: 0,
                  display: isFirst ? 'none' : 'block'
                }
              }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box
                    onClick={() => !isDisabled && onSectionClick(section.id)}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isActive ? 'primary.main' : 'background.paper',
                      border: 1,
                      borderColor: isCompleted ? 'success.main' : 
                                 isActive ? 'primary.main' : 
                                 'grey.300',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.5 : 1,
                      transition: 'transform 0.2s',
                      mx: 'auto',
                      mb: 1,
                      '&:hover': {
                        transform: isDisabled ? 'none' : 'scale(1.1)'
                      }
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <RadioButtonUncheckedIcon color={isActive ? "primary" : "action"} />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontWeight: isActive ? 600 : 400,
                      mt: 1
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
};

export default SectionHeader; 